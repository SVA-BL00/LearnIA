// routes/_main._index.jsx

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { authenticator } from "../services/auth.server";
import Countdown from "../components/Countdown";
import CursosDashboard from "../components/CursosDashboard";
import Notification from "../components/Notification";
import "../styles/main.css";

const prisma = new PrismaClient();

export const loader = async ({ request }) => {
	const user = await authenticator.isAuthenticated(request);
	const cursos = await prisma.curso.findMany({
		include: {
			materia: true,
			tema: true,
			quizzes: true,
		},
		where: {
			idEstudiante: user.user.estudianteId,
			completado: "false",
		},
	});
	return json({ cursos });
};

function getClosestExamenFinalDate(cursos) {
	const now = new Date();
	let closestDate = null;
	let minDiff = Number.POSITIVE_INFINITY;

	cursos.forEach((curso) => {
		if (curso.quizzes && Array.isArray(curso.quizzes)) {
			curso.quizzes.forEach((quiz) => {
				if (quiz.tipo === "Examen Final") {
					const diff = new Date(quiz.fecha) - now;
					if (diff > 0 && diff < minDiff) {
						closestDate = new Date(quiz.fecha);
						minDiff = diff;
					}
				}
			});
		}
	});

	return closestDate;
}

function getCalificacionFinal(cursos) {
	return cursos.map((curso) => {
		const totalCalificacion = curso.quizzes.reduce(
			(acc, quiz) => acc + quiz.calificacion,
			0,
		);
		const calificacionFinal = totalCalificacion / curso.quizzes.length;
		return { ...curso, calificacionFinal };
	});
}

function getDateNameQuizzes(cursos) {
	return cursos.map((curso) => {
		// Group quizzes by date
		const dates = curso.quizzes.reduce((acc, quiz) => {
			const dateStr = quiz.fecha.split(" ")[0]; // Convierte fecha a YYYY-MM-DD
			if (!acc[dateStr]) {
				acc[dateStr] = {
					date: new Date(quiz.fecha),
					quizzes: [],
				};
			}
			acc[dateStr].quizzes.push(quiz.tipo);
			return acc;
		}, {});

		// Convert the dates object to an array
		const dateArray = Object.values(dates);

		return { ...curso, dates: dateArray };
	});
}

function index() {
	const { cursos } = useLoaderData();

	const cursosWithCF = getCalificacionFinal(cursos);
	const cursosWithDates = getDateNameQuizzes(cursosWithCF);

	const transformedCourses = cursosWithDates.map((curso) => ({
		title: curso.materia.nombre,
		tasks: curso.tema.map((tema) => tema.nombre),
		temasTotales: curso.tema.length,
		temasCompletados: curso.tema.filter((tema) => tema.completado).length,
		calificacionFinal: curso.calificacionFinal,
		dates: curso.dates,
		quizzes: curso.quizzes.map((quiz) => quiz.tipo),
	}));

	const closestExamenFinalDate = getClosestExamenFinalDate(transformedCourses);

	return (
		<div style={{ marginLeft: "400px" }}>
			<div className="dashboard">
				<div className="container-full">
					<div className="wrapper">
						<div className="wrapper-main">
							<div className="title-wrapper">
								<h2 className="title">¿Listo para tu examen?</h2>
							</div>
							{closestExamenFinalDate ? (
								<Countdown examenFinalDate={closestExamenFinalDate} />
							) : (
								<div
									style={{
										display: "flex",
										fontFamily: `"Ubuntu Mono", monospace`,
									}}
								>
									<p>
										No tienes fechas establecidas para exámenes futuros.
										¡Practica hasta que estés listo!
									</p>
								</div>
							)}
						</div>
						<Notification />
					</div>
					<div className="lower-wrapper">
						<CursosDashboard cursos={transformedCourses} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default index;
