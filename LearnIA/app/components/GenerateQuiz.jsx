

import { fetchDataFromFlask } from "../services/APIs/aiRequest.js";

async function GenerateQuiz({ tema }) {
    const quizData = await fetchDataFromFlask("http://127.0.0.1:5000/quiz", { tema });
    return quizData;
}

export default GenerateQuiz;

