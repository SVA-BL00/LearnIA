// db.js

import prisma from './prisma/prisma.js';

// Cursos activos con todos los detalles necesarios
export async function getCursosActivosConDetalles(estudianteId) {
  const cursosActivos = await prisma.curso.findMany({
    where: { idEstudiante: estudianteId, completado: 'false' },
    select: {
      idCurso: true, // aqui tal vez no sea id curso, tal vez sea otro
      materia: {
        select: {
          nombre: true,
        },
      },
      descripcion: true,
      proyectosRec: true,
      plazo: true,
    },
  });

  return await Promise.all(
    cursosActivos.map(async (curso) => {
      const temasCompletados = await prisma.tema.findMany({
        where: {
          idCurso: curso.idCurso,
          completado: 'true',
        },
        select: { idTema: true },
      });

      const temasNoCompletados = await prisma.tema.findMany({
        where: {
          idCurso: curso.idCurso,
          OR: [
            { completado: null },
            { completado: 'false' },
          ],
        },
        select: { idTema: true },
      });

      const totalTemas = temasCompletados.length + temasNoCompletados.length;
      const progreso = totalTemas > 0 ? Math.round((temasCompletados.length / totalTemas) * 100) : 0;

      return {
        idCurso: curso.idCurso,
        nombreMateria: curso.materia.nombre,
        descripcionMateria: curso.descripcion,
        progreso,
        plazo: curso.plazo,
        proyectosRec: curso.proyectosRec,
      };
    })
  );
}


