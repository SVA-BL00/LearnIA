import fs from 'fs';
import path from 'path';
import prisma from "./prisma/prisma.js";

export async function fetchData(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
  
      // Parse the JSON data
      const materias = JSON.parse(data);
  
      // Process each materia
      for (const materia of materias) {
        if (materia) { // Check if materia is not empty or undefined
          // Insert into the database
          await prisma.materia.create({
            data: {
              semestre: parseInt(materia.semestre, 10),
              idMateriaTec: materia.idMateriaTec,
              nombre: materia.nombre,
              objetivos: materia.objetivos,
              recursos: materia.recursos,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error fetching and inserting materias:", error);
    }
  }