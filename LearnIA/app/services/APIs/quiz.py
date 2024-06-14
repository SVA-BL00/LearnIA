from flask import jsonify

data = '''[
	{ "message" : {"temario": {
        "temas": [
            {
                "titulo": "Introducción a la programación orientada a objetos",
                "completado": true,
                "subtemas": [
                    "Conceptos básicos de programación orientada a objetos",
                    "Ventajas de la programación orientada a objetos",
                    "Principios de la programación orientada a objetos"
                ]
            },
            {
                "titulo": "Clases y objetos",
                "completado": true,
                "subtemas": [
                    "Definición de clases",
                    "Creación y destrucción de objetos",
                    "Métodos y atributos de clase"
                ]
            },
            {
                "titulo": "Herencia",
                "completado": true,
                "subtemas": [
                    "Concepto de herencia",
                    "Tipos de herencia",
                    "Constructores y destructores en herencia"
                ]
            },
            {
                "titulo": "Polimorfismo",
                "completado": false,
                "subtemas": [
                    "Concepto de polimorfismo",
                    "Polimorfismo en C++",
                    "Funciones virtuales y puras"
                ]
            },
            {
                "titulo": "Encapsulamiento",
                "completado": false,
                "subtemas": [
                    "Concepto de encapsulamiento",
                    "Modificadores de acceso",
                    "Beneficios del encapsulamiento"
                ]
            },
            {
                "titulo": "Ejemplos y ejercicios prácticos",
                "completado": false,
                "subtemas": [
                    "Desarrollo de programas utilizando programación orientada a objetos",
                    "Resolución de problemas utilizando los conceptos aprendidos"
                ]
            },
            {
                "titulo": "Manejo de excepciones",
                "completado": false,
                "subtemas": [
                    "Concepto de excepción",
                    "Tipos de excepciones",
                    "Manejo de excepciones en C++"
                ]
            },
            {
                "titulo": "Programación genérica",
                "completado": false,
                "subtemas": [
                    "Concepto de programación genérica",
                    "Plantillas en C++",
                    "Ventajas de la programación genérica"
                ]
            },
            {
                "titulo": "Bibliotecas estándar de C++",
                "completado": false,
                "subtemas": [
                    "STL (Standard Template Library)",
                    "Uso de contenedores",
                    "Algoritmos de la STL"
                ]
            },
            {
                "titulo": "Desarrollo de proyectos",
                "completado": false,
                "subtemas": [
                    "Metodología de desarrollo de proyectos en programación orientada a objetos",
                    "Desarrollo de un proyecto completo utilizando los conceptos aprendidos"
                ]
            }
        	]
    	}
	}
}
]''';


def get_quiz(data):
    return jsonify(data)