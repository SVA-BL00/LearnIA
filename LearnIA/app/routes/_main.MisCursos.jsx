// app/routes/miscursos.jsx or app/routes/miscursos.js
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import prisma from './prisma/prisma.js'; 

// Define the loader function
export const loader = async () => {
  // Fetch the data from the database
  const cursos = await prisma.curso.findMany({
    include: {
      materia: true, // Adjust the relations as per your schema
    },
  });

  // Return the data as a JSON response
  return json(cursos);
};

// Your MisCursos component
import MisCursos from "../components/InfoMisCursos";

export default function MisCursosRoute() {
  const cursos = useLoaderData();

  return <MisCursos cursos={cursos} />;
}