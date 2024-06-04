// db.js

import prisma from './prisma/prisma.js';

// Cursos activos con todos los detalles necesarios
export async function getCursosActivosConDetalles(estudianteId) {
  const cursosActivos = await prisma.curso.findMany({
    where: { idEstudiante: estudianteId, completado: 'false' },
    select: {
      id: true,
      materia: {
        select: {
          nombre: true,
        },
      },
      descripcion: true,
    },
  });

  return await Promise.all(
    cursosActivos.map(async (curso) => {
      const temasCompletados = await prisma.tema.findMany({
        where: {
          idCurso: curso.id,
          completado: 'true',
        },
        select: { id: true },
      });

      const temasNoCompletados = await prisma.tema.findMany({
        where: {
          idCurso: curso.id,
          OR: [
            { completado: null },
            { completado: 'false' },
          ],
        },
        select: { id: true },
      });

      const totalTemas = temasCompletados.length + temasNoCompletados.length;
      const progreso = totalTemas > 0 ? Math.round((temasCompletados.length / totalTemas) * 100) : 0;

      return {
        idCurso: curso.id,
        nombreMateria: curso.materia.nombre,
        descripcionMateria: curso.descripcion,
        progreso,
      };
    })
  );
}
