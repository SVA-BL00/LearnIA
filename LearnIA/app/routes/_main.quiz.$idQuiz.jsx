import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { PrismaClient } from "@prisma/client";
import { authenticator } from "../services/auth.server";
import "../styles/main.css";
import "../styles/quiz.css";

const prisma = new PrismaClient();

// Define the loader function
// PARAMS OBTIENE LOS PARAMETROS DEL URL
export const loader = async ({ request, params }) => {
	// AUTORIZACION
	const user = await authenticator.isAuthenticated(request);

	if (!user) {
		throw new Response("Unauthorized", { status: 401 });
	}

	// SE OBTIENE EL ID DEL QUIZ DEL URL
	const _idQuiz = await (params.idQuiz);
	const numidQuiz = parseInt(_idQuiz);



	const quizzesNoFormat = await prisma.quiz.findMany({
		where: {
		  idQuiz: numidQuiz,
		  calificacion: null,
		},
		select: {
		  preguntas: true,
		  fecha: true,
		  tipo: true,
		  idCurso: true,
		},
	  });


	  const numidCurso = quizzesNoFormat[0].idCurso;
	  const curso = await prisma.curso.findUnique({
		where: {
		  idCurso: numidCurso,
		},
		include: {
		  materia: true
		}
	});

	const nombreMateria = curso.materia.nombre.toString();
	return json({ quizzesNoFormat, nombreMateria: nombreMateria });
};

export default function Quiz() {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [score, setScore] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [userAnswers, setUserAnswers] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);
	const {quizzesNoFormat, nombreMateria } = useLoaderData();
	const questions = JSON.parse(quizzesNoFormat[0].preguntas);
	const handleAnswerOptionChange = (event) => {
		setSelectedOption(event.target.value);
	};

	const handleNextClick = () => {
		const correctAnswer = questions[currentQuestion].correct_answer;
		if (selectedOption === correctAnswer) {
			setScore(score + 1);
		}
		setUserAnswers([...userAnswers, selectedOption]);
		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
			setSelectedOption(null);
		} else {
			setShowScore(true);
		}
	};

	const handlePrevClick = () => {
		const prevQuestion = currentQuestion - 1;
		if (prevQuestion >= 0) {
			setCurrentQuestion(prevQuestion);
			setSelectedOption(userAnswers[prevQuestion]);
		}
	};

	const handleSubmitClick = () => {
		const correctAnswer = questions[currentQuestion].correct_answer;
		if (selectedOption === correctAnswer) {
			setScore(score + 1);
		}
		setUserAnswers([...userAnswers, selectedOption]);
		setShowScore(true);
	};

	return (
		<div style={{ marginLeft: "400px" }}>
			<div className="wrapper-quiz">
				<div
					className="quiz-title Ubuntu"
					style={{ backgroundColor: "var(--green-color)" }}
				>
					{nombreMateria}
				</div>{" "}
				{/* cambiar a que se envíe el titulo desde la base de datos */}
				{showScore ? (
					<div className="score-section">
						<h1 style={{ color: "var(--green-color)" }} className="Roboto">
							Resultado
						</h1>
						<p className="fw-bold" style={{ color: "var(--green-color)" }}>
							Has obtenido {score} de {questions.length} correctas.
						</p>

						{/* LA SIGUIENTE SECCIÓN se puede cambiar por la parte de 'feedback' que se va a crear con openai */}
						<div className="Lato">
							<p>Respuestas:</p>
							<ul>
								{questions.map((question, index) => (
									<li key={index}>
										{question.question} - Tu respuesta: {userAnswers[index]} -
										Correcta: {question.correct_answer}
									</li>
								))}
							</ul>
						</div>
					</div>
				) : (
					<div className="quiz-body Lato">
						<div className="quiz-header">
							<div
								style={{ color: "var(--green-color)" }}
								className="fw-bold fst-italic"
							>
								<i
									className="bi bi-pencil-square"
									style={{ fontSize: "1.5em" }}
								/>
								<span>Pregunta {currentQuestion + 1}</span>/{questions.length}
							</div>
						</div>
						<div className="question-text">
							{questions[currentQuestion].question}
						</div>
						<div className="answer-section">
							{questions[currentQuestion].options.map((option) => (
								<div key={option} className="custom-radio">
									<label>
										<input
											type="radio"
											name="answer"
											value={option}
											checked={selectedOption === option}
											onChange={handleAnswerOptionChange}
										/>
										<span className="custom-radio-button"></span>
										{option}
									</label>
								</div>
							))}
						</div>
						<div className="navigation-buttons">
							<button
								onClick={handlePrevClick}
								disabled={currentQuestion === 0}
							>
								&lt; Anterior
							</button>
							{currentQuestion < questions.length - 1 ? (
								<button
									onClick={handleNextClick}
									disabled={selectedOption === null}
								>
									Siguiente &gt;
								</button>
							) : (
								<button
									onClick={handleSubmitClick}
									disabled={selectedOption === null}
									style={{ backgroundColor: "var(--red-color)" }}
								>
									Enviar
								</button>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
