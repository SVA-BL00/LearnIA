import fs from "fs";
import path from "path";
import prisma from "./prisma/prisma.js";

export async function fetchAndInsertMaterias() {
  try {
    const __dirname = path.dirname(new URL(import.meta.url).pathname); // Fix for ES module
    const filePath = path.join(__dirname, "materias.txt");
    const data = fs.readFileSync(filePath, "utf8");

    // Split the data into lines
    const lines = data.split('\n');
    
    // Initialize an empty array to hold entries
    let entries = [];
    let currentEntry = [];

    // Process each line
    for (const line of lines) {
      if (/^\d/.test(line) && currentEntry.length > 0) { // Check if the line starts with a number
        entries.push(currentEntry.join('\n')); // Add the current entry to entries array
        currentEntry = []; // Reset the current entry
      }
      currentEntry.push(line); // Add the line to the current entry
    }

    // Add the last entry
    if (currentEntry.length > 0) {
      entries.push(currentEntry.join('\n'));
    }

    // Process each entry
    for (const entry of entries) {
      if (entry.trim()) { // Skip empty entries
        // Split entry into lines
        const lines = entry.split('\n');
        
        // Extract the first line containing semestre, idMateriaTec, and nombre
        const [semestre, idMateriaTec, ...nameParts] = lines[0].split(' ');
        const nombre = nameParts.join(' ');

        // Extract objetivos (assuming they are separated by newlines and prefixed with "- ")
        const objetivosStartIndex = lines.findIndex(line => line.startsWith("Al terminar la unidad de formación el alumno:"));
        const recursosStartIndex = lines.findIndex(line => line.startsWith("LIBROS DE TEXTO:"));

        const objetivos = lines.slice(objetivosStartIndex + 1, recursosStartIndex).join('\n').trim();

        // Extract recursos (assuming they are prefixed with "* ")
        const recursos = lines.slice(recursosStartIndex + 1).join('\n').trim();

        // Insert into the database
        await prisma.materia.create({
          data: {
            semestre: parseInt(semestre, 10),
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



