import axios from 'axios';

export async function fetchDataFromFlask(url, data) {
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// en crear curso vas a generar temas y vas a marcar todos como no completados
// y vas a generar proyectos recomedados (guardas todo en la base de datos)

// después mandas a quiz inicial a partir de los temas generados


/* 
Generar temas:
    url: http://127.0.0.1:5000/temario
    entradas: JSON con nombre de la carrera, nombre de la materia, objetivos de la materia, libros recomendados
    salidas: 10 temas de la materia en un JSON

Generar quiz:
    url: http://127.0.0.1:5000/quiz
    entradas: tema: { nombre:"" , completado: ""} x 10
    salida: 

Actualizar progreso:
    url: http://127.0.0.1:5000/actualizar
    intentar que el quiz sea tal cual el JSON que hace generar quiz
    entradas (depende de qué quiz sea las cantidades): {tema: { nombre:"" , completado: ""} x cantidad de temas, quiz: {pregunta: "", respuesta: ""} x (cantidad de temas * 2)}
    salida: tema: { nombre:"" , completado: ""} x cantidad de temas pero cambiado el completado

Obtener retro quiz: 
    url: http://127.0.0.1:5000/retro
    entradas: recibe quiz en JSON 
    (Tu guarda toda la salida en feedback del quiz)
    salida: JSON con retroalimentación de cada pregunta separada por tema

Generar proyectos recomendados: 
    url: http://127.0.0.1:5000/proyectos
    entradas: JSON con nombre de la carrera, nombre de la materia, objetivos de la materia y temario (que incluya si completado o no)
    salida: JSON con proyectos recomendados con nombre del proyecto, objetivo, descripción, subtemas aplicados, y paso a paso cómo desarrollar el proyecto

*/