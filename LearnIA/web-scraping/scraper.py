from flask import Flask, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
from bs4 import BeautifulSoup

app = Flask(__name__)

# Initialize variables
matrix_courses = []

# FUNCTIONS

def get_courses(table):
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
    with open("courses.txt", 'w', encoding='utf-8') as file:
        pass

def get_resources(link, driver):

    resources = []
    try:
        # Click on the link
        driver.find_element(By.LINK_TEXT, link).click()

        # Wait for the page to load
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, '//tbody//td')))
        
        # Find the table data elements
        res_elements = driver.find_elements(By.XPATH, '//tbody//td')
        if not res_elements:
            print("No table data elements found.")
            return resources  # Return empty if no elements are found

        with open('resources.txt', 'w', encoding='utf-8') as file:
            for res in res_elements:
                file.write(res.text + '\n')
        
        # Parse the outer HTML of the first table data element
        table_data_html = res_elements[0].get_attribute("outerHTML")
        #print(f"Table Data HTML: {table_data_html}")  # Debugging statement

        soup = BeautifulSoup(table_data_html, 'html.parser')
        br_elements = soup.find_all('br')
        
        if not br_elements:
            print("No <br> elements found in the table data.")
        
        for br in br_elements:
            prev_node = br.find_previous(string=True)
            if prev_node and not prev_node.isspace():
                resource_name = prev_node.strip()
                print(f"Found resource: {resource_name}")  # Debugging statement
                resources.append(resource_name)
                
    except Exception as e:
        print(f"An error occurred: {e}")
        
    return resources

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
        
        # Wait for the page to load
        time.sleep(10)
        
        # Find all relevant elements
        tables = driver.find_elements('xpath', '//table[@class="DIVPeriodoES"]')

        # Find all relevant links
        links = driver.find_elements('xpath', '//a[@href and contains(@class, "vpmateriapuente") and contains(@data-language, "ES")]')
        
        # Managing tables
        links.pop(0)
        
        tables.pop(0)
        tables.pop(-2)
        tables.pop(-1)

        delete_content()

        # Write the courses to courses.txt
        semester = 0
        courses = []
        links_list = get_links(links)
        i = 0

        with open('courses.txt', 'w', encoding='utf-8') as file:
            for table in tables:
                semester += 1
                courses = get_courses(table)
                for course in courses:
                    link = links_list[i]
                    if course.startswith("Optativa"):
                        i += 1
                        continue
                    course_info = [semester, link, course]
                    matrix_courses.append(course_info)
                    file.write(str(semester) + " " + link +" " + course + '\n')
                    i += 1
    finally:
        # Quit the driver
        driver.quit()

    return jsonify(matrix_courses)

if __name__ == '__main__':
    app.run(debug=True)

