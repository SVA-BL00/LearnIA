// app/services/APIs/fetchAndInsertMaterias.js
import fetch from 'node-fetch';
import prisma from './prisma/prisma.js';

export async function fetchAndInsertMaterias() {
    try {
        const response = await fetch('http://localhost:5000/get_courses');
        const materias = await response.json();

        for (const materia of materias) {
            await prisma.materia.create({
                data: {
                    idMateria: materia[0],  // Adjust this based on the actual data structure
                    idCarrera: materia[1],
                    nombre: materia[2],
                    semestre: materia[3],
                    idMateriaTec: materia[4],
                    objetivos: materia[5],
                    recursos: materia[6],
                },
            });
        }
        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        await prisma.$disconnect();
    }
}
