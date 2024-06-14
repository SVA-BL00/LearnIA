import { useState } from "react";
import { Form } from "@remix-run/react";
import "../styles/main.css";
import "../styles/quiz.css";
import { fetchDataFromFlask } from "../services/APIs/aiRequest";

export default function CrearQuizzes({temario}) {
    const [temas, setTemas] = useState(new Set(temario));

    const handlePreguntas = async (temas) => {
        try{
            console.log(1);
            const formData = new FormData();
            formData.append("temario", temas);

            const message_quizzes = {temario: materia.temas};

            try{
                console.log(2);
                const jsonData = await fetchDataFromFlask("http://localhost:5000/quiz", message_quizzes);
                console.log(jsonData);
                const parsedData = JSON.parse(jsonData.response);

                const questions = parsedData.preguntas.map(question => ({
                    question: question.question,
                    options: question.options,
                    correct_answer: question.correct_answer
                }))                                         ;
                formData.append("questions", questions);
                formData.append("options", parsedData.options);
                formData.append("correct_answers", parsedData.correct_answers);

                console.log(questions);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return;
            }
        console.log("FormData before sending:", formData.get("temas"));
        console.log("Pruebaaa");
        const response = await fetch('/', {
        method: 'POST',
        body: formData,
      });
        } catch (error) {
          console.error('Error parsing JSON:', error);
          // Handle the error appropriately
        }
    }

}
