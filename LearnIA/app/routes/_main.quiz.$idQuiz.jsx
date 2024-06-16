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
		},
		select: {
		  idQuiz: true,
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

	
try{
	const preguntas = JSON.parse(quizzesNoFormat[0].preguntas);
	console.log(preguntas);

} catch {
	console.log("Incorrect format.");
}

	const nombreMateria = curso.materia.nombre.toString();
	return json({ quizzesNoFormat, nombreMateria: nombreMateria });
};

export const action = async ({ request, params }) => {

	const user = await authenticator.isAuthenticated(request);
	if (!user) {
	throw new Response("Unauthorized", { status: 401 });
	}

	const formData = await request.formData();
	const calificacion =  parseInt(formData.get("calificacion"));
    const quizId = params.idQuiz;
	const idQuiz = parseInt(quizId);
	const retro = formData.get("retro");
	const completedTopicsJSON = formData.get("completedTopics");

	// Check if quizId is a valid integer
	if (isNaN(idQuiz)) {
		throw new Response("Bad Request: Invalid quizId", { status: 400 });
	}
	
	//Grade and feedback
	const updatedQuiz = await prisma.quiz.update({
		where: {
			idQuiz: idQuiz,
		},
		data: {
			calificacion: calificacion,
			feedback: retro,
		},
	});

	const completedTopics = JSON.parse(completedTopicsJSON);
	const updatedTopics = await prisma.tema.updateMany({
		where: {
			nombre: {
				in: completedTopics,
			},
			idCurso: updatedQuiz.idCurso,
		},
		data: {
			completado: "true",
		},
	});

	//Para visualizar
	const updatedTopicsCheck = await prisma.tema.findMany({
		where: {
			idCurso: updatedQuiz.idCurso,
			completado: "true",
		},
	});

	console.log(updatedTopicsCheck[0]);
	console.log(updatedQuiz.calificacion);
	console.log(updatedQuiz.feedback);

	return json({ success: true });
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

	const handleSubmitClick = async  () => {
		const correctAnswer = questions[currentQuestion].correct_answer;
		if (selectedOption === correctAnswer) {
			setScore(score + 1);
		}
		const updatedUserAnswers = [...userAnswers, selectedOption];
		const correctAnswersCount = score + (selectedOption === correctAnswer ? 1 : 0);
        const finalScore = (correctAnswersCount * 100) / questions.length;
	
		const formData = new FormData();
		formData.append("idQuiz", quizzesNoFormat[0].idQuiz);
		formData.append("calificacion", finalScore);
		const routeQuiz = quizzesNoFormat[0].idQuiz.toString();
		console.log(routeQuiz);

		const quizResults = questions.map((question, index) => ({
			question: question.question,
			userAnswer: updatedUserAnswers[index],
			correctAnswer: question.correct_answer
		}));
		const quizResultsString = JSON.stringify(quizResults);
		formData.append("retro", quizResultsString);

			// Cuantas respuestas correctas por tema
			const topicScores = {};
			questions.forEach((question, index) => {
				const topic = question.topic;
				if (!topicScores[topic]) {
					topicScores[topic] = { total: 0, correct: 0 };
				}
				topicScores[topic].total++;
				if (updatedUserAnswers[index] === question.correct_answer) {
					topicScores[topic].correct++;
				}
			});
		
			// Cuantos temas completamente bien
			const newCompletedTopics = Object.keys(topicScores).filter(
				(topic) => topicScores[topic].total === topicScores[topic].correct
			);
	
			const completedTopicsJSON = JSON.stringify(newCompletedTopics);
			formData.append("completedTopics", completedTopicsJSON);

		const response = await fetch(`/quiz/${routeQuiz}`, {
			method: "POST",
			body: formData,
		});
	
		if (response.ok) {
			console.log("Score updated successfully.");
		} else {
			console.log("Failed to update score.");
		}
		setShowScore(true);
		setUserAnswers(updatedUserAnswers);
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
