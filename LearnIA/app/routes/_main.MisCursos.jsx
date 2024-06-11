// app/routes/miscursos.jsx or app/routes/miscursos.js

import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import { getCursosActivosConDetalles } from "../services/db";
import prisma from "./prisma/prisma.js";

// Define the loader function
export const loader = async ({ request }) => {
	const user = await authenticator.isAuthenticated(request);

	if (!user) {
		throw new Response("Unauthorized", { status: 401 });
	}

	// Get the cursos for the user
	const cursos = await getCursosActivosConDetalles(user.user.estudianteId);

	// Get the temas and proyectosRec for each curso
	for (const curso of cursos) {
		curso.temas = await prisma.tema.findMany({
			where: { idCurso: curso.idCurso },
		});
	}

	return json(cursos);
};

export const action = async ({ request }) => {
	const user = await authenticator.isAuthenticated(request);

	if (!user) {
		throw new Response("Unauthorized", { status: 401 });
	}

	const formData = await request.formData();
	const idCurso = formData.get("idCurso");

	if (!idCurso) {
		throw new Response("Bad Request", { status: 400 });
	}

	// Delete the curso from the database
	await prisma.curso.delete({
		where: {
			idCurso: Number.parseInt(idCurso, 10),
		},
	});

	return redirect("/miscursos");
};

import MisCursos from "../components/InfoMisCursos";

export default function MisCursosRoute() {
	const cursos = useLoaderData();

	return <MisCursos cursos={cursos} />;
}
