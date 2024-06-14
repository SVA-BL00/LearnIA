// routes/_main.explora.jsx

import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import prisma from "./prisma/prisma.js";
import TitleWithImages from "../components/TitleWithImages";
import InfoExplora from "../components/InfoExplora";
import "../styles/Explora.css";

export const loader = async ({ request }) => {
	const user = await authenticator.isAuthenticated(request);
  
	if (!user) {
	  throw new Response("Unauthorized", { status: 401 });
	}
   
	// Step 1: Retrieve idCarrera using estudianteId
	const estudiante = await prisma.estudiante.findUnique({
	  where: {
		idEstudiante: user.user.estudianteId,
	  },
	  select: {
		idCarrera: true,
	  },
	});
  
	const idCarrera = estudiante?.idCarrera;
	if (!idCarrera) {
	  throw new Error("Carrera not found for the user");
	}
  
	// Step 2: Fetch nombreCarrera using idCarrera
	const carrera = await prisma.carrera.findUnique({
	  where: {
		idCarrera: idCarrera,
	  },
	  select: {
		siglasCarrera: true,
	  },
	});

	const nombreCarrera = carrera?.siglasCarrera || "Unknown Carrera";
  
	const materias = await prisma.materia.findMany({
	  where: {
		idCarrera: idCarrera,
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
	  materias,
	  enrolledMaterias: Array.from(enrolledMaterias),
	  user,
	  nombreCarrera,
	});
};
  

export const action = async ({ request }) => {
	const user = await authenticator.isAuthenticated(request);

  	if (!user) {
    	throw new Response("Unauthorized", { status: 401 });
  	}

  	const formData = await request.formData();
  	const idMateria = formData.get("idMateria");
	const temas = JSON.parse(formData.get("temario"));
	const quizzes = JSON.parse(formData.get("quizzes"));
	const finalExam = JSON.parse(formData.get("examenFinal"));
	const proyectos = "Proyecto 1: Desarrolla una simulación en MATLAB para estudiar y optimizar el tiro parabólico en un campo de deportes, como el lanzamiento de una pelota de fútbol. El objetivo es determinar las mejores condiciones para maximizar la distancia y precisión del tiro. Proyecto 2: Desarrolla un proyecto en MATLAB que modele y analice el tiro parabólico aplicado en proyectos de ingeniería civil, como el lanzamiento de materiales en la construcción de puentes o edificios.";
  	
	if (!idMateria || !temas || !quizzes || !finalExam) {
		throw new Response("Bad Request", { status: 400 });
	}

  	const curso = await prisma.curso.create({
    	data: {
      		idEstudiante: user.user.estudianteId,
      		idMateria: Number.parseInt(idMateria, 10),
      		completado: "false", // Adjust as needed, use true/false if it's a boolean in your schema
      		plazo: "", // Default value, adjust as needed
      		descripcion: "", // Default value, adjust as needed
      		proyectosRec: proyectos, // Default value, adjust as needed
   		},
  	});
      console.log("FormData before sending aaaaa:", formData.get("temas"));
      console.log("Funcionapleasetelosuplico", temas);
	  console.log("idcurso", curso.idCurso);
	
	try{
		const temasCreados = await prisma.tema.createMany({
			data: temas.map((tema) => ({
				idCurso: curso.idCurso,
				nombre: tema,
				completado: "false",
			})),
		});

		console.log("Temas creados:", temasCreados);
		console.log(quizzes);

		const quizzesCreados = await prisma.quiz.createMany({
			data: quizzes.map((quiz) => ({
				idCurso: curso.idCurso,
				fecha: new Date(quiz.fecha + "T00:00:00Z").toISOString(),
				tipo: "quiz",
				feedback: "",
				preguntas: "",
				respuestas: null,
				calificacion: 0,
			})),
		});
		console.log("Quizzes creados:", quizzesCreados);

		const finalExamCreado = await prisma.quiz.create({
			data: {
				idCurso: curso.idCurso,
				fecha: new Date(finalExam.fecha + "T00:00:00Z").toISOString(),
				tipo: "final_exam",
				feedback: "",
				preguntas: "",
				respuestas: null,
				calificacion: 0,
			},
		});

		console.log("Final exam creado:", finalExamCreado);

	} catch (error) {
		console.error("Error in action function:", error);
		throw new Response("Internal Server Error", { status: 500 });
	}
	return json({ success: true });
  	return redirect("/explora");
};

function Explora() {
  	const { materias, enrolledMaterias, nombreCarrera } = useLoaderData();

  	return (
    	<div style={{ marginLeft: "400px" }}>
      		<TitleWithImages title="Explora" />
      		<InfoExplora materias={materias} enrolledMaterias={enrolledMaterias} nombreCarrera={nombreCarrera}/>
    	</div>
  	);
}

export default Explora;