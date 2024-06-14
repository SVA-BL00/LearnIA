from flask import Flask, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import json
import os

current_dir = os.path.dirname(os.path.abspath(__file__))

materias_txt_path = os.path.join(current_dir, 'materias.txt')
materias_json_path = os.path.join(current_dir, 'materias.json')


app = Flask(__name__)

# Initialize variables
matrix_courses = []

# FUNCTIONS
def extract_courses(table):
    course_names = []
    table_html = table.get_attribute("outerHTML")
    soup = BeautifulSoup(table_html, 'html.parser')
    courses = soup.find_all('td', class_='texto2')
    for course in courses:
        course_html = course.decode_contents()
        soup_course = BeautifulSoup(course_html, 'html.parser')
        nota_materias = soup_course.find_all('span', class_='notaMateria') 

        for nota in nota_materias:
            prev_node = nota.find_previous(string=True)
            if prev_node and not prev_node.isspace():
                course_name = prev_node.strip()
                course_names.append(course_name)
    return course_names

def get_links(links):
    links_list = []
    for link in links:
        link_text = link.text.strip()
        links_list.append(link_text)
    return links_list

# Function for deleting the content of courses.txt
def delete_content():
    with open(materias_txt_path, 'w', encoding='utf-8') as file:
        pass

def manage_resources(html):
    resources_list = []
    soup_resource = BeautifulSoup(html, 'html.parser')
    resources = soup_resource.find_all('tr')
    for resource in resources:
        header = resource.find_all('td')
        for h in header:
            prev_node = h.find_all('br')
            for p in prev_node:
                node = p.find_previous(string=True)
                if node and not node.isspace():
                    resource = node.strip()
                    resources_list.append(resource)
    #return resources_list
    return list_to_string(remove_duplicates([s.replace("\xa0", "") for s in remove_elements_with_parentheses(resources_list)]))

def extract_objectives(html):
    try:
        soup = BeautifulSoup(html, 'html.parser')

        # Locate the "Objetivo general de la Unidad de Formación" section if it exists
        objectives_section = soup.find('h3', text=lambda text: text and 'Objetivo general de la Unidad de Formación' in text)

        if objectives_section:
            # If the section is found, find the next sibling <td> element
            objectives = objectives_section.find_next('td')

            # Extract the objectives within the <p> tags if they exist
            if objectives:
                objectives_list = objectives.find_all('p')
                if objectives_list:
                    # Extract the text from each <p> tag and join them with newline characters
                    objectives_text = "\n".join([p.get_text(strip=True) for p in objectives_list])
                    return objectives_text
                else:
                    return "No objectives found in the provided HTML content."
            else:
                return "No objectives section found in the provided HTML content."
        else:
            return "The 'Objetivo general de la Unidad de Formación' section was not found in the provided HTML content."
    except Exception as e:
        return "An error occurred: {}".format(e)


def remove_elements_with_parentheses(lst):
    return [s for s in lst if "(" not in s]

def list_to_string(lst):
    return "\n".join(lst)

def remove_duplicates(lst):
    seen = set()
    unique_list = []
    for s in lst:
        if s not in seen:
            unique_list.append(s)
            seen.add(s)
    return unique_list

def click_link(driver, link_text, wait, original_window):
    try:
        driver.find_element(By.LINK_TEXT, link_text).click()
        # Wait for the new window or tab
        wait.until(EC.number_of_windows_to_be(2))
        # Loop through until we find a new window handle
        for window_handle in driver.window_handles:
            if window_handle != original_window:
                driver.switch_to.window(window_handle)
                break

        # Wait for the new tab to finish loading content
        wait.until(EC.presence_of_element_located((By.TAG_NAME, 'body')))
        time.sleep(5)

        print(f"Clicked link: {link_text}")  # Debugging statement
    except Exception as e:
        print(f"An error occurred: {e}")

def close_tab(driver, wait, original_window):
    try:
        driver.close()
        driver.switch_to.window(original_window)
        # Wait for the tab to close
        wait.until(EC.number_of_windows_to_be(1))
    except Exception as e:
        print(f"An error occurred: {e}")

@app.route('/fetch_courses', methods=['GET'])
def fetch_courses():
    # Set up Chrome options
    options = Options()
    options.add_experimental_option("detach", True)

    # Initialize the Chrome driver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        # Open the target URL
        driver.get("https://samp.itesm.mx/Programas/VistaPrograma?clave=ITC19&modoVista=Default&idioma=ES&cols=0#")
        
        # Setup wait for later
        wait = WebDriverWait(driver, 10)

        # Wait for the page to load
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'DIVPeriodoES')))

        # Store the ID of the original window
        original_window = driver.current_window_handle

        # Check we don't have other windows open already
        assert len(driver.window_handles) == 1

        # Find all relevant elements
        tables = driver.find_elements('xpath', '//table[@class="DIVPeriodoES"]')

        # Find all relevant links
        links = driver.find_elements('xpath', '//a[@href and contains(@class, "vpmateriapuente") and contains(@data-language, "ES")]')
        
        # Managing tables
        links.pop(0)
        
        tables.pop(0)
        tables.pop(-3)
        tables.pop(-2)
        tables.pop(-1)

        delete_content()

        # Write the courses to courses.txt
        semester = 0
        courses = []
        obj = []
        resources = []
        links_list = get_links(links)
        i = 0

        with open(materias_txt_path, 'w', encoding='utf-8') as file:
            for table in tables:
                semester += 1
                courses = extract_courses(table)
                for course in courses:
                    link = links_list[i]
                    if course.startswith("Optativa"):
                        i += 1
                        continue
        
                    click_link(driver, link, wait, original_window)
                    element = wait.until(EC.presence_of_element_located((By.XPATH, '//div[contains(@class, "panel-body")]')))
                    html = element.get_attribute('outerHTML')
                    close_tab(driver, wait, original_window)
                    resources = manage_resources(html)
                    obj = extract_objectives(html)
                    #print(html)
                    #print(obj)
                    course_info = [semester, link, course, obj, resources]
                    matrix_courses.append(course_info) 
                    file.write(str(semester) + " " + link + " " + course + '\n' + obj + '\n'+ resources +'\n')
                    i += 1
        

        with open(materias_json_path, 'w', encoding='utf-8') as json_file:
            json.dump(matrix_courses, json_file)

    finally:
        # Quit the driver
        driver.quit()

    return jsonify(matrix_courses)

fetch_courses()

@app.route('/get_courses', methods=['GET'])
def get_courses():
    with open(materias_json_path, 'r', encoding='utf-8') as json_file:
        data = json.load(json_file)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)

