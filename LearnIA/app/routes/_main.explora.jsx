// routes/_main.explora.jsx

import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import prisma from "./prisma/prisma.js";
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

	const cursos = await prisma.curso.findMany({
		where: {
			idEstudiante: user.user.estudianteId,
		},
		select: {
			idMateria: true,
		},
	});

	const enrolledMaterias = new Set(cursos.map((curso) => curso.idMateria));

	return json({
		carreras,
		enrolledMaterias: Array.from(enrolledMaterias),
		user,
	});
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
			idMateria: Number.parseInt(idMateria, 10),
			completado: "false", // Adjust as needed, use true/false if it's a boolean in your schema
			plazo: "", // Default value, adjust as needed
			descripcion: "", // Default value, adjust as needed
			proyectosRec: "", // Default value, adjust as needed
		},
	});

	return redirect("/explora");
};

function Explora() {
	const { carreras, enrolledMaterias } = useLoaderData();

	return (
		<div style={{ marginLeft: "400px" }}>
			<TitleWithImages title="Explora" />
			<InfoExplora carreras={carreras} enrolledMaterias={enrolledMaterias} />
		</div>
	);
}

export default Explora;
