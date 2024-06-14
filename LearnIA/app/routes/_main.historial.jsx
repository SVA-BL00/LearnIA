import TitleWithImages from "../components/TitleWithImages";
import SectionContainer from "../components/SectionContainer";
import "../styles/main.css";
import "../styles/historial.css";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useLoaderData, useNavigate } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import { json } from "@remix-run/node";
import React, { useState } from 'react';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);


// Define the loader function
export const loader = async ({ request }) => {
	const user = await authenticator.isAuthenticated(request);

	if (!user) {
		throw new Response("Unauthorized", { status: 401 });
	}

	// Dummy data for quizzes
	const hist = [
        {
            "materia": "Matemáticas",
            "quizzes": [
              {
                "nombre": "Quiz 1",
                "calificacion": 85,
                "fecha": "2021-09-01",
                "retroalimentacion": "Buen trabajo, pero necesitas mejorar en álgebra."
              },
              {
                "nombre": "Quiz 2",
                "calificacion": 90,
                "fecha": "2021-09-15",
                "retroalimentacion": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac purus sit amet nunc. Nullam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac purus sit amet nunc. Nullam."
              }
            ]
          },
	];

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
                                        <p><strong>Retroalimentación:</strong> {quizzes[selectedQuiz].retroalimentacion}</p>
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