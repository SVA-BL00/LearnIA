// db.js

import prisma from './prisma/prisma.js';

// Function to get the courses a student is enrolled in
//export async function getCursosInscritos(estudianteId) {
//  const cursosInscritos = await prisma.cursoInscrito.findMany({
//    where: { estudianteId },
//    select: { cursoId: true },
//  });
//  return cursosInscritos.map(ci => ci.cursoId);
//}

// Function to get course details by IDs
//export async function getCursosByIds(cursoIds) {
//  return prisma.curso.findMany({
//    where: {
//      idCurso: { in: cursoIds },
//    },
//  });
//}

// Function to get the name of the course subject by course ID
//export async function getNombreMateriaByCursoId(cursoId) {
//  const curso = await prisma.curso.findUnique({
//    where: { idCurso: cursoId },
//    select: { nombreMateria: true },
//  });
//  return curso ? curso.nombreMateria : null;
//}

// Function to get the description of the course subject by course ID
//export async function getDescripcionMateriaByCursoId(cursoId) {
//  const curso = await prisma.curso.findUnique({
//    where: { idCurso: cursoId },
//    select: { descripcionMateria: true },
//  });
//  return curso ? curso.descripcionMateria : null;
//}
