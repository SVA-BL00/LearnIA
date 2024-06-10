import json

data = [
    {
        "idMateria": 1,
        "idCarrera": 101,
        "nombre": "Mathematics",
        "semestre": 1,
        "idMateriaTec": "MATH101",
        "objetivos": "Understand basic math concepts.",
        "recursos": "Books, Online resources."
    },
    # Add more entries as needed
]

with open('materias.json', 'w') as json_file:
    json.dump(data, json_file)
