from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
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

    if not all([nombre_carrera, nombre, objetivos, libros_recomendados]):
        return jsonify({'error': 'Missing fields'}), 400

    user_message = f"Carrera: {nombre_carrera}\nMateria: {nombre}\nObjetivos: {objetivos}\nLibros recomendados: {libros_recomendados}"

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Create a chat completion using the OpenAI client
        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres una IA creadora de temarios, buscas crear temarios que enseñen desde lo básico hasta lo más avanzado. Los temarios deben de ser de 10 temas. Dados el nombre de la carrera, el nombre de la materia, los objetivos de la materia y los libros recomendados, quiero que generes un temario donde el nombre de cada tema sea descriptivo. El temario se deberá regresar en formato json con un tema por linea."},
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
                Es IMPORTANTE que el quiz incluya TODOS LOS TEMAS NO COMPLETADOS. Indicarás además, de cuál tema es cada pregunta.

                Deberás hacer 2 preguntas por tema.

                Construirás distintas preguntas de opción múltiple para la audiencia. Las preguntas deben ser altamente relevantes y no simples hechos. Las respuestas alternas de opción múltiple (las que no son las correctas) deberán ser competentes, de manera que estudiantes las vean como posibles respuestas. No deberá haber una opción de "Todas las anteriores"

                Al final del quiz regresaras una clave con las respuestas correctas y una explicación de por qué estas fueron correctas. 

                Todo esto se debe incluir en un mismo archivo json.

                El formato del quiz generado debe ser siempre:
                El formato del quiz deberá ser SIEMPRE como el del siguiente ejemplo:
        
                    question:
                        "¿Cuál de las siguientes acciones representa una implementación científica o ingenieril adecuada para un problema de optimización de recursos?",
                    options: [
                        "Implementar un algoritmo de búsqueda binaria.",
                        "Desarrollar un modelo de simulación para evaluar diferentes escenarios.",
                        "Usar hojas de cálculo para almacenar datos sin análisis posterior.",
                        "Crear gráficos atractivos sin fundamentos teóricos.",
                    ],
                    correct_answer:
                        "Desarrollar un modelo de simulación para evaluar diferentes escenarios.",
                },
                {
                    question:
                        "Para resolver un problema de ingeniería con un alto nivel de incertidumbre, ¿qué enfoque es más adecuado?",
                    options: [
                        "Realizar una serie de pruebas empíricas controladas.",
                        "Tomar decisiones basadas en intuición y experiencia personal.",
                        "Consultar únicamente fuentes teóricas sin validación práctica.",
                        "Evitar tomar decisiones hasta que se elimine toda incertidumbre.",
                    ],
                    correct_answer: "Realizar una serie de pruebas empíricas controladas.",
                },
                {
                    question:
                        "En el contexto de la ingeniería y las ciencias, ¿qué significa aplicar los principios de sustentabilidad?",
                    options: [
                        "Reducir costos a corto plazo a expensas del medio ambiente.",
                        "Priorizar soluciones que maximicen el uso de recursos naturales.",
                        "Desarrollar tecnologías que mitiguen el impacto ambiental y promuevan el uso eficiente de recursos.",
                        "Implementar soluciones que aumenten la dependencia de combustibles fósiles.",
                    ],
                    correct_answer:
                        "Desarrollar tecnologías que mitiguen el impacto ambiental y promuevan el uso eficiente de recursos.",
                },
                {
                    question:
                        "¿Cuál de las siguientes estrategias es más adecuada para garantizar el bienestar de las generaciones futuras?",
                    options: [
                        "Incrementar la explotación de recursos naturales sin considerar su regeneración.",
                        "Implementar políticas que promuevan la reducción, reutilización y reciclaje de materiales.",
                        "Fomentar el consumo masivo de productos desechables.",
                        "Desarrollar infraestructuras que no consideren el impacto ambiental.",
                    ],
                    correct_answer:
                        "Implementar políticas que promuevan la reducción, reutilización y reciclaje de materiales.",
                },
                {
                    question:
                        "En la implementación de procesos computacionales, ¿qué factor es crucial para asegurar que la solución sea adecuada?",
                    options: [
                        "La velocidad de desarrollo del código.",
                        "La compatibilidad con las tecnologías más recientes, sin considerar su relevancia.",
                        "La alineación del proceso computacional con los requisitos del problema específico.",
                        "La cantidad de líneas de código escritas.",
                    ],
                    correct_answer:
                        "La alineación del proceso computacional con los requisitos del problema específico.",
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
