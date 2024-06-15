import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { authenticator } from "../services/auth.server";
import TitleWithImages from "../components/TitleWithImages";
import CollapsibleSection from "../components/CollapsibleSection";
import "../styles/main.css";

const prisma = new PrismaClient();

/* function mapTipoToCustomString(tipo) {
	switch (tipo) {
		case 'final_exam':
			return `Examen Final (${curso.nombreMateria})`;
		case 'quiz':
			return `Quiz (${curso.nombreMateria})`;
		default:
			return tipo;
	}
  }
 */
// Define the loader function
export const loader = async ({ request, params }) => {
	const user = await authenticator.isAuthenticated(request);

	if (!user) {
		throw new Response("Unauthorized", { status: 401 });
	}

	const _idCurso = await (params.idCurso);
	const numidCurso = parseInt(_idCurso);



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
	  console.log(quizzesNoFormat);

	  const quizzes = quizzesNoFormat.map(quiz => ({
		idQuiz: quiz.idQuiz,
		preguntas: quiz.preguntas,
		fecha: quiz.fecha.toISOString().slice(0, 10),
		tipo: quiz.tipo, /* mapTipoToCustomString(quiz.tipo)  */
	  }));

	return json(quizzes);
};

function categorizeAndSortQuizzes(quizzes) {
	const now = new Date();
	const thisWeek = [];
	const thisMonth = [];
	const later = [];

	quizzes.sort((a, b) => new Date(a.date) - new Date(b.date));

	quizzes.forEach((quiz) => {
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

export default function QuizCurso() {
	const quizzes = useLoaderData();
	const navigate = useNavigate();
	const { thisWeek, thisMonth, later } = categorizeAndSortQuizzes(quizzes);

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
				<CollapsibleSection key={index} title={quiz.name}>
					<div style={{ flexDirection: "column", width: "100%" }}>
						<p
							style={{ color: "#E33838", fontSize: "1.3em" }}
							className="fw-bold fst-italic"
						>
							La fecha límite para completar este quiz es el {quiz.fecha}
						</p>

						<button
							className="btn"
							style={{ backgroundColor: "#48605B", color: "white" }}
							onClick={() => navigate(`/quiz/${quiz.idQuiz}`)}
						>
							Hacer quiz
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
					{renderQuizzes(thisWeek, "Esta semana")}
					{renderQuizzes(thisMonth, "Este mes")}
					{renderQuizzes(later, "Más adelante")}
				</>
			)}
		</div>
	);
}
