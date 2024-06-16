import TitleWithImages from "../components/TitleWithImages";
import SectionContainer from "../components/SectionContainer";
import "../styles/main.css";
import "../styles/historial.css";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useLoaderData, useNavigate } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import { json } from "@remix-run/node";
import { useState } from 'react';
import { PrismaClient } from '@prisma/client';
import { useParams } from "react-router-dom";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const prisma = new PrismaClient();

export const loader = async ({ request, params  }) => {
	const user = await authenticator.isAuthenticated(request);

	if (!user) {
		throw new Response("Unauthorized", { status: 401 });
	}

    const _idCurso = await (params.id);
    const numIdCurso = parseInt(_idCurso);
    
    if (isNaN(numIdCurso)) {
        throw new Error('Invalid idCurso');
    }

    //Materia
    const curso = await prisma.curso.findUnique({
        where: {
            idCurso: numIdCurso
        },
        include: {
            materia: true
        }
    });

    if (!curso) {
        throw new Error('Curso not found');
    }

    const materia = curso.materia.nombre;

   //Quizzes
    const quizzesNoFormat = await prisma.quiz.findMany({
		where: {
          
          idCurso: numIdCurso,
          calificacion: {
            not: null
            }
		},
		select: {
		  idQuiz: true,
		  fecha: true,
		  tipo: true,
          feedback: true,
          calificacion: true,
		},
	  });
    
    const hist = [{
        materia: materia,
        quizzes: quizzesNoFormat.map(quiz => ({
            nombre: quiz.tipo,
            calificacion: quiz.calificacion,
            fecha: quiz.fecha,
            retroalimentacion: quiz.feedback
        }))
    }];
	return json(hist);
};

function Historial() {
    const hist = useLoaderData();
    const navigate = useNavigate();

    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const handlePointClick = (event, chartElement) => {
        if (chartElement.length > 0) {
            const quizIndex = chartElement[0].index;
            setSelectedQuiz(quizIndex);
        }
    };

    const renderHistorial = (materia, quizzes) => {
        // Prepare data for the chart
        const labels = quizzes.map(quiz => quiz.nombre);
        const data = {
            labels,
            datasets: [
                {
                    label: 'Calificaciones',
                    data: quizzes.map(quiz => quiz.calificacion),
                    borderColor: '#E33838',
                    backgroundColor: '#E33838',
                    fill: false,
                }
            ]
        };
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            onClick: (event, elements) => handlePointClick(event, elements),
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                },
                x: {
                    display: false
                }
            }
        };
        const parseFeedback = (feedback) => {
            try {
                const parsedFeedback = JSON.parse(feedback);
                return parsedFeedback.map((quiz, index) => (
                    `${index + 1}. Pregunta: ${quiz.question}\n   Respuesta del usuario: ${quiz.userAnswer}\n   Respuesta correcta: ${quiz.correctAnswer}\n`
                )).join('\n\n');
            } catch (error) {
                console.error('Error parsing feedback:', error);
                return 'Error parsing feedback';
            }
        };
    
        return (
            <div key={materia} style={{ width: '100%'}}>
                <Line data={data} options={options} />
                <div className="container">
                    <div className="quiz-details" style={{textAlign: 'left'}}>
                        {selectedQuiz !== null ? (
                                <div className="quiz-info">
                                    <div className="box">
                                        <h4>{quizzes[selectedQuiz].nombre}</h4>
                                    </div>
                                    <div className="content-historial">
                                        <p><strong>Calificación:</strong> {quizzes[selectedQuiz].calificacion}</p>
                                        <p><strong>Fecha:</strong> {quizzes[selectedQuiz].fecha}</p>
                                        <p><strong>Retroalimentación:</strong> {parseFeedback(quizzes[selectedQuiz].retroalimentacion)}</p>
                                    </div>
                                </div>
                            ) : (
                                <p>Dale click a un quiz para ver detalles.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ marginLeft: "400px"}}>
            <TitleWithImages title="Historial" />

            {hist.map((subject, index) => (
                <SectionContainer key={index} title={subject.materia} style={{ textAlign: 'left'}}>
                    {renderHistorial(subject.materia, subject.quizzes)}
                </SectionContainer>
            ))}
        </div>
    );
}

export default Historial;