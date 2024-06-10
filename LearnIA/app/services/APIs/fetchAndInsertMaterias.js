// app/services/APIs/fetchAndInsertMaterias.js

import fs from "fs";
import path from "path";
import prisma from "./prisma/prisma.js";

export async function fetchAndInsertMaterias() {
    try {
        const filePath = path.join(__dirname, "materias.json");
        const data = fs.readFileSync(filePath, 'utf8');
        const materias = JSON.parse(data);

        for (const materia of materias) {
            await prisma.materia.create({
                data: {
                    idMateria: materia.idMateria,
                    idCarrera: materia.idCarrera,
                    nombre: materia.nombre,
                    semestre: materia.semestre,
                    idMateriaTec: materia.idMateriaTec,
                    objetivos: materia.objetivos,
                    recursos: materia.recursos,
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
