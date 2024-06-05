import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import prisma from "./prisma/prisma.js";
import { authenticator } from "../services/auth.server";
import TitleWithImages from "../components/TitleWithImages";
import InfoExplora from "../components/InfoExplora";
import "../styles/Explora.css";

export const loader = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const carreras = await prisma.carrera.findMany({
    include: {
      materia: true,
    },
  });

  return json({ carreras, user });
};

export const action = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const idMateria = formData.get("idMateria");

  if (!idMateria) {
    throw new Response("Bad Request", { status: 400 });
  }

  await prisma.curso.create({
    data: {
		idEstudiante: user.user.estudianteId,
		idMateria: parseInt(idMateria, 10),
		completado: "false",  // Adjust as needed, use true/false if it's a boolean in your schema
		plazo: "",  // Default value, adjust as needed
		descripcion: "",  // Default value, adjust as needed
		proyectosRec: "",  // Default value, adjust as needed
	}
  });
  return redirect("/explora");
};

function Explora() {
  const { carreras } = useLoaderData();

  return (
    <div style={{ marginLeft: "400px" }}>
      <TitleWithImages title="Explora" />
      <InfoExplora carreras={carreras} />
    </div>
  );
}

export default Explora;
