import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import TitleWithImages from "../components/TitleWithImages";
import CollapsibleSection from "../components/CollapsibleSection";
import "../styles/main.css";

// Define the loader function
export const loader = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request);

    if (!user) {
        throw new Response("Unauthorized", { status: 401 });
    }

    // Dummy data for quizzes
    const quizzes = [
        {
            name: "Quiz 1",
            idQuiz: 1,
            date: "2024-06-10",
            temas: [
              "Introducción a las Estructuras de Datos",
              "Arrays y Listas Enlazadas",
              "Pilas y Colas",
            ]
        },
        {
          name: "Quiz 2",
          idQuiz: 2,
          date: "2024-06-09",
          temas: [
              "Tema 1",
              "Tema 2",
          ]
        },
        {
          name: "Quiz 3",
          idQuiz: 3,
          date: "2024-06-25",
          temas: [
              "Tema 1",
              "Tema 2",
          ]
        }
    ];

    return json(quizzes);
};

function categorizeAndSortQuizzes(quizzes) {
    const now = new Date();
    const thisWeek = [];
    const thisMonth = [];
    const later = [];

    quizzes.sort((a, b) => new Date(a.date) - new Date(b.date));

    quizzes.forEach((quiz) => {
        const quizDate = new Date(quiz.date);
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
                    <p style={{ color: "#48605B", fontSize: "1.3em" }} className="Roboto">{title}</p>
                    <hr className="border-2" />
                </div>
            )}
            {quizzes.map((quiz, index) => (
                <CollapsibleSection key={index} title={quiz.name}>
                    <div style={{ flexDirection: "column", width: "100%" }}>
                        <p style={{ color: "#E33838", fontSize: "1.3em" }} className="fw-bold fst-italic">
                            La fecha límite para completar este quiz es el {quiz.date}
                        </p>
                        <p style={{ color: "#FF7F11", fontSize: "1.1em" }} className="fw-bold fst-italic">
                            Temas a evaluar:
                        </p>
                        <ul>
                            {quiz.temas.map((tema, index) => (
                                <li key={index}>{tema}</li>
                            ))}
                        </ul>
                        <button
                            className="btn"
                            style={{ backgroundColor: "#48605B", color: "white" }}
                            onClick={() => navigate(`/${quiz.idQuiz}`)}
                        >
                            Hacer quiz
                        </button>
                    </div>
                </CollapsibleSection>
            ))}
        </>
    );

    return (
        <div style={{ marginLeft: '400px' }}>
            <TitleWithImages title="Quizzes y Examenes" />
            {quizzes.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', fontFamily: `"Ubuntu Mono", monospace` }}>
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

/* export async function loader({params,}: LoaderFunctionArgs) {
    return fakeDb.getAllConcertsForCity(params.city);
  }
   */