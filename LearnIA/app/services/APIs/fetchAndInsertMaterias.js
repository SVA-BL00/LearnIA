import fs from "fs";
import path from "path";
import prisma from "./prisma/prisma.js";

export async function fetchAndInsertMaterias() {
  try {
    const __dirname = path.dirname(new URL(import.meta.url).pathname); // Fix for ES module
    const filePath = path.join(__dirname, "materias.json");
    const data = fs.readFileSync(filePath, "utf8");

    // Split the data into entries, then parse each entry
    const entries = data.split("], [").map(entry => entry.replace(/^\[|\]$/g, ''));
    
    for (const entry of entries) {
      if (entry.trim()) { // Skip empty entries
        // Remove surrounding quotes and split by comma, accounting for potential escape sequences
        const [semestre, idMateriaTec, nombre, objetivos, recursos] = entry.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(val => val.replace(/(^"|"$)/g, '').trim());
        
        await prisma.materia.create({
          data: {
            semestre,
            idMateriaTec,
            nombre,
            objetivos,
            recursos,
          },
        });
      }
    }

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error; // Rethrow to be caught by the loader
  } finally {
    await prisma.$disconnect();
  }
}

