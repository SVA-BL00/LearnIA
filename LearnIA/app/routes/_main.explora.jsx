import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import prisma from "./prisma/prisma.js"; 

// Define the loader function
export const loader = async () => {
  const carreras = await prisma.carrera.findMany({
    include: {
      materia: {
        include: {
          curso: true,
        },
      },
    },
  });

  return json({ carreras });
};

import Explora from "../components/InfoExplora.jsx";

export default function ExploraRoute() {
  const data = useLoaderData();

  return <Explora carreras={data.carreras} />;
}

