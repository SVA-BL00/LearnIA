from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Set your OpenAI API key from environment variable
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/temario', methods=['POST'])
def temario():
    if not request.is_json:
        return jsonify({'error': 'Invalid input format, JSON expected'}), 400

    data = request.json
    nombre_carrera = data.get('nombreCarrera')
    nombre = data.get('nombre')
    objetivos = data.get('objetivos')
    libros_recomendados = data.get('librosRecomendados')
    start_date_str = data.get('startDate')
    end_date_str = data.get('endDate')

    if not all([nombre_carrera, nombre, objetivos, libros_recomendados]):
        return jsonify({'error': 'Missing fields'}), 400

    user_message = f"Carrera: {nombre_carrera}\nMateria: {nombre}\nObjetivos: {objetivos}\nLibros recomendados: {libros_recomendados}"

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        messages = [
            {"role": "system", "content": "Eres una IA creadora de temarios, buscas crear temarios que enseñen desde lo básico hasta lo más avanzado. Los temarios deben de ser de 10 temas. Dados el nombre de la carrera, el nombre de la materia, los objetivos de la materia y los libros recomendados, quiero que generes un temario donde el nombre de cada tema sea descriptivo. El temario se deberá regresar en formato json con un tema por linea."},
            {"role": "user", "content": user_message},
        ]

        if start_date_str and end_date_str:
            user_message_with_dates = (
                f"{user_message}\n"
                f"Las fechas del curso son desde {start_date_str} hasta {end_date_str}.\n"
                "Además del temario, por favor genera 2 quizzes y un examen final"
                "Cada quiz y el examen final deben tener un id y una fecha de realización dentro de este período, llamados idQuiz y fecha dentro del json."
            )
            messages.append({"role": "user", "content": user_message_with_dates})
        else:
            user_message_no_dates = (
                f"{user_message}\n"
                "Además del temario, por favor genera 2 quizzes y un examen final"
                "Cada quiz y el examen final deben tener un id llamados idQuiz y fecha que será un valor nulo dentro del json."
                "Se verán de la siguiente manera: {'idQuiz': 1, 'fecha': None} NO generes preguntas"
            )
            messages.append({"role": "user", "content": user_message_no_dates})

        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.1,
        )

        # Accessing the content from the response
        message = completion.choices[0].message.content.strip()
        # Separate the response into temas and quizzes/final_exam
        # Assuming the response format is something like:
        # {"temas": [{"tema1": "description1"}, ..., {"tema10": "description10"}], "quizzes": [{"id": "quiz1", "date": "date1"}, {"id": "quiz2", "date": "date2"}], "final_exam": {"id": "final_exam", "date": "final_date"}}
        response_data = json.loads(message)
        temas_response = response_data.get('temario', [])
        quizzes_response = response_data.get('quizzes', [])
        final_exam_response = response_data.get('examenFinal', {})

        return jsonify({
            'temario': temas_response,
            'quizzes': quizzes_response,
            'examenFinal': final_exam_response,
        })
    except Exception as e:
        # Log the error
        app.logger.error(f"Error occurred: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/quiz', methods=['POST'])
def quiz():
    if not request.is_json:
        return jsonify({'error': 'Invalid input format, JSON expected'}), 400

    data = request.json
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Create a chat completion using the OpenAI client
        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": '''Eres una IA creadora de quizzes altamente diagnósticos. Generarás quizzes de buena calidad y de bajo riesgo. La audiencia serán alumnos de universidad. 

                Los quizzes se harán en base a un temario de 10 temas. Para cada tema indicará si ya está completado con "completado": "true" y si no está completado con "completado":"false"
                Es IMPORTANTE que el quiz incluya TODOS LOS TEMAS NO COMPLETADOS.

                Deberás hacer 2 preguntas por tema.

                Construirás distintas preguntas de opción múltiple para la audiencia. Las preguntas deben ser altamente relevantes y no simples hechos. Las respuestas alternas de opción múltiple (las que no son las correctas) deberán ser competentes, de manera que estudiantes las vean como posibles respuestas. No deberá haber una opción de "Todas las anteriores"

                Todo esto se debe incluir en un mismo archivo json.

                El formato del quiz deberá ser una string JSON, SIEMPRE como el del siguiente ejemplo:
        	    {"question":"¿Cuál de las siguientes acciones representa una implementación científica o ingenieril adecuada para un problema de optimización de recursos?","options": ["Implementar un algoritmo de búsqueda binaria.","Desarrollar un modelo de simulación para evaluar diferentes escenarios.","Usar hojas de cálculo para almacenar datos sin análisis posterior.","Crear gráficos atractivos sin fundamentos teóricos.",],"correct_answer":"Desarrollar un modelo de simulación para evaluar diferentes escenarios.","topic":"Interacción entre variables en un problema",},{"question":"Para resolver un problema de ingeniería con un alto nivel de incertidumbre, ¿qué enfoque es más adecuado?","options": ["Realizar una serie de pruebas empíricas controladas.","Tomar decisiones basadas en intuición y experiencia personal.","Consultar únicamente fuentes teóricas sin validación práctica.","Evitar tomar decisiones hasta que se elimine toda incertidumbre.",],"correct_answer": "Realizar una serie de pruebas empíricas controladas.","topic":"Patrones Relevantes en un Conjunto de Información",},'
                IMPORTANTE: esta string será parseada después, generarla respetando el formato para que esto sea posible
                 
                 '''},
                {"role": "user", "content": user_message},
            ],
            temperature=0.1,
            #max_tokens=150,

        )

        # Accessing the content from the response
        message = completion.choices[0].message.content.strip()
        return message
    except Exception as e:
        # Log the error
        app.logger.error(f"Error occurred: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/actualizar', methods=['POST'])
def actualizar():
    if not request.is_json:
        return jsonify({'error': 'Invalid input format, JSON expected'}), 400

    data = request.json
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Create a chat completion using the OpenAI client
        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": '''Se te dará un temario y un quiz contestado por un estudiante.
                    Eres un profesor de la carrera que se encuentra en el temario.
                    Tu labor es calificar los quizzes que contestó el estudiante y dar retroalimentación.

                    Leerás el quiz y las respuestas del estudiante. 
                    El quiz tiene dos preguntas por tema. Si el estudiante contestó bien las dos preguntas, marcarás como completado el tema en el temario ("completado" = "true")
                    Regresarás el temario con las modificaciones en formato json.'''
                    },
                {"role": "user", "content": user_message},
            ],
            temperature=0.1,
            #max_tokens=150,

        )

        # Accessing the content from the response
        message = completion.choices[0].message.content.strip()
        return jsonify({'response': message})
    except Exception as e:
        # Log the error
        app.logger.error(f"Error occurred: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/retro', methods=['POST'])
def retro():
    if not request.is_json:
        return jsonify({'error': 'Invalid input format, JSON expected'}), 400

    data = request.json
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Create a chat completion using the OpenAI client
        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": '''Se te dará un quiz contestado por un estudiante.
                    Eres un profesor de la carrera que se encuentra en el temario.
                    Tu labor es calificar los quizzes que contestó el estudiante y dar retroalimentación.

                    Leerás el quiz y las respuestas del estudiante.
                    La retroalimentación se dará por tema.
                    Si obtuvo las 2 respuestas correctas, incluir retroalimentación positiva.
                    Si obtuvo 2 respuestas incorrectas, incluir retroalimentación constructiva y 3 pasos de cómo mejorar en el siguiente intento.
                    Si obtuvo una respuesta correcta y otra incorrecta, incluir retroalimentación positiva de la respuesta correcta, y constructiva de la incorrecta junto con los 3 pasos de cómo seguir mejorando.
                    Regresarás EN FORMATO JSON el título de cada tema que hubo en el quiz, y debajo la retroalimentación como fue especificada anteriormente.'''},
                {"role": "user", "content": user_message},
            ],
            temperature=0.1,
            #max_tokens=150,

        )

        # Accessing the content from the response
        message = completion.choices[0].message.content.strip()
        return jsonify({'response': message})
    except Exception as e:
        # Log the error
        app.logger.error(f"Error occurred: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/proyectos', methods=['POST'])
def proyectos():
    if not request.is_json:
        return jsonify({'error': 'Invalid input format, JSON expected'}), 400

    data = request.json
    nombre_carrera = data.get('nombreCarrera')
    nombre_materia = data.get('nombreMateria')
    objetivos = data.get('objetivos')
    temas = data.get('temas')

    if not all([nombre_carrera, nombre_materia, objetivos, temas]):
        return jsonify({'error': 'Missing fields'}), 400
    
    user_message = f"Carrera: {nombre_carrera}\nMateria: {nombre_materia}\nObjetivos: {objetivos}\nTemas: {temas}"

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Create a chat completion using the OpenAI client
        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": '''Se te dará un temario. Revisarás el nombre de la carrera, nombre de la materia, objetivos de la materia y los temas NO COMPLETADOS del temario.
                    En base a eso, generarás 3 ideas de proyectos que el estudiante pueda utilizar para aprender los temas faltantes en el temario.
                    Los proyectos deberán contener nombre del proyecto, objetivo, descripción, temas aplicados, y paso a paso cómo desarrollar el proyecto.
                    IMPORTANTE: Deberás regresar los proyectos y sus características en formato JSON.
                    '''},
                {"role": "user", "content": user_message},
            ],
            temperature=0.1,
            #max_tokens=150,
        )

        # Accessing the content from the response
        message = completion.choices[0].message.content.strip()
        return jsonify({'response': message})
    except Exception as e:
        # Log the error
        app.logger.error(f"Error occurred: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500
    
@app.route('/retro-proyectos', methods=['POST'])
def proyectos_retro():
    if not request.is_json:
        return jsonify({'error': 'Invalid input format, JSON expected'}), 400

    data = request.json
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Create a chat completion using the OpenAI client
        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": '''Se te dará un temario. Revisarás el nombre de la carrera, nombre de la materia, objetivos de la materia y los temas NO COMPLETADOS del temario.
                    En base a eso, generarás 3 ideas de proyectos que el estudiante pueda utilizar para aprender los temas faltantes en el temario.
                    Los proyectos deberán contener nombre del proyecto, objetivo, descripción, subtemas aplicados, y paso a paso cómo desarrollar el proyecto.
                    IMPORTANTE: Deberás regresar los proyectos y sus características en formato JSON.
                    '''},
                {"role": "user", "content": user_message},
            ],
            temperature=0.1,
            #max_tokens=150,
        )

        # Accessing the content from the response
        message = completion.choices[0].message.content.strip()
        return jsonify({'response': message})
    except Exception as e:
        # Log the error
        app.logger.error(f"Error occurred: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
