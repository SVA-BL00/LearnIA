import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { authenticator } from "../services/auth.server";
import TitleWithImages from "../components/TitleWithImages";
import CollapsibleSection from "../components/CollapsibleSection";
import "../styles/main.css";
import { fetchDataFromFlask } from "../services/APIs/aiRequest.js";
import React, { useState } from "react";

const prisma = new PrismaClient();

// Define the loader function
export const loader = async ({ request, params }) => {
	const user = await authenticator.isAuthenticated(request);

	if (!user) {
		throw new Response("Unauthorized", { status: 401 });
	}

	const _idCurso = await (params.idCurso);
	const numidCurso = parseInt(_idCurso);

	const curso = await prisma.curso.findUnique({
		where: {
		  idCurso: numidCurso,
		},
		include: {
		  materia: true,
		  tema: true,
		}
	});

	function mapTipoToCustomString(tipo) {
		switch (tipo) {
			case 'final_exam':
				return `Examen Final | ${curso.materia.nombre}`;
			case 'quiz':
				return `Quiz | ${curso.materia.nombre}`;
			default:
				return tipo;
		}
	  }
	

	const quizzesNoFormat = await prisma.quiz.findMany({
		where: {
		  idCurso: numidCurso,
		  calificacion: null,
		},
		select: {
		  idQuiz: true,
		  preguntas: true,
		  fecha: true,
		  tipo: true,
		},
	  });

	  const quizzes = quizzesNoFormat.map(quiz => ({
		idQuiz: quiz.idQuiz,
		preguntas: quiz.preguntas,
		fecha: quiz.fecha ? quiz.fecha.toISOString().slice(0, 10) : null,
		tipo: mapTipoToCustomString(quiz.tipo) 
	  }));

	  console.log(quizzes);
	return json({ curso, quizzes });
};

export const action = async ({ request }) => {
	
	const formData = await request.formData();
	const user = await authenticator.isAuthenticated(request);
	if (!user) {
	throw new Response("Unauthorized", { status: 401 });
	}

	const preguntas = formData.get("preguntas");
	const quizId = parseInt(formData.get("quizId"), 10);
	const numidCurso = parseInt(formData.get("cursoId"), 10);
	// Check if quizId is a valid integer
	if (isNaN(quizId)) {
		throw new Response("Bad Request: Invalid quizId", { status: 400 });
	}
	
	const updatedQuiz = await prisma.quiz.update({
		where: {
			idQuiz: quizId,
		},
		data: {
			preguntas: preguntas,
		},
	});

	return json({ success: true });
};


function categorizeAndSortQuizzes(quizzes) {
	const now = new Date();
	const thisWeek = [];
	const thisMonth = [];
	const later = [];

	quizzes.sort((a, b) => {
		if (a.fecha === null) return 1;
		if (b.fecha === null) return -1;
		return new Date(a.fecha) - new Date(b.fecha);
	});

	quizzes.forEach((quiz) => {
		if (quiz.fecha === null) {
			later.push(quiz);
			return;
		}

		const quizDate = new Date(quiz.fecha);
		const diffInDays = (quizDate - now) / (1000 * 60 * 60 * 24);

		if (diffInDays <= 7) {
			thisWeek.push(quiz);
		} else if (diffInDays <= 30) {
			thisMonth.push(quiz);
		} else {
			later.push(quiz);
		}
	});

	return { thisWeek, thisMonth, later };
}


const handleQuizCreation = async (quizId, curso) => {
	if (!quizId || !curso) return;
	const formData = new FormData();
	console.log(curso);
	const temas = curso.tema;
	console.log(temas)

	if (!temas || temas.length === 0) {
	  console.error("No temas found in curso.");
	  return;
	}

	let quizData;
	try {
		quizData = await fetchDataFromFlask("http://127.0.0.1:5000/quiz", { message: JSON.stringify(temas) } );
		console.log(quizData);
	} catch (error) {
		console.error("Error fetching questions for tema:", temas, error);
		throw new Response("Failed to fetch questions", { status: 500 });
	}
	try {
		formData.append('quizId', quizId);
		formData.append('preguntas', JSON.stringify(quizData));
		formData.append('cursoId', JSON.stringify(curso.idCurso));
		
	} catch (error) {
		console.error('Error enrolling:', error);
	}
	console.log("idCurso:", curso.idCurso);
	
	const response = await fetch(`/quizdashboard/${curso.idCurso.toString()}`, {
		method: 'POST',
		body: formData,
	});

	if (response.ok) {
		console.log("Todo funciona correctamente");
	} else {
		console.error("Failed to enroll:", await response.text());
	}
};

export default function QuizCurso() {
	const { curso, quizzes } = useLoaderData();
	const [creatingQuiz, setCreatingQuiz] = useState(false);
	const navigate = useNavigate();
	const { thisWeek, thisMonth, later } = categorizeAndSortQuizzes(quizzes);
	
	async function handleCombined(quizId, curso) {
		setCreatingQuiz(true);
		await handleQuizCreation(quizId, curso);
		setCreatingQuiz(false);
		navigate(`/quiz/${quizId}`);
	}
	
	const renderQuizzes = (quizzes, title) => (
		<>
			{quizzes.length > 0 && (
				<div className="px-4 py-3">
					<p style={{ color: "#48605B", fontSize: "1.3em" }} className="Roboto">
						{title}
					</p>
					<hr className="border-2" />
				</div>
			)}
			{quizzes.map((quiz, index) => (
				<CollapsibleSection key={index} title={quiz.tipo}>
					<div style={{ flexDirection: "column", width: "100%" }}>
						<p
							style={{ color: "#E33838", fontSize: "1.3em" }}
							className="fw-bold fst-italic"
						>
							{quiz.fecha
								? `La fecha límite para completar este quiz es el ${quiz.fecha}`
								: "La fecha para este quiz es indefinida"}
						</p>

						<button
							className="btn"
							style={{ backgroundColor: "#48605B", color: "white" }}
							onClick={() => handleCombined(quiz.idQuiz, curso)}
							>
							{creatingQuiz ? "Creando quiz..." : "Hacer quiz"}
						</button>
					</div>
				</CollapsibleSection>
			))}
		</>
	);

	return (
		<div style={{ marginLeft: "400px" }}>
			<TitleWithImages title="Quizzes y Examenes" />
			{quizzes.length === 0 ? (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "70vh",
						fontFamily: `"Ubuntu Mono", monospace`,
					}}
				>
					<p>No tienes quizzes de este curso.</p>
				</div>
			) : (
				<>
					{renderQuizzes(thisWeek, "Próximos 7 días")}
					{renderQuizzes(thisMonth, "Este mes")}
					{renderQuizzes(later, "Más adelante")}
				</>
			)}
		</div>
	);
}