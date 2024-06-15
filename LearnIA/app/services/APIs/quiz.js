import { json, redirect } from "remix";
import { useState } from "react";
import { useLoaderData } from "remix";
import "../styles/main.css";
import "../styles/quiz.css";

export const loader = async ({ request }) => {
  const url = "http://localhost:5000/quiz"; // Your Flask API endpoint
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: "Generate a quiz" }), // Adjust the payload as necessary
  });

  if (!response.ok) {
    throw new Response("Failed to fetch quiz", {
      status: response.status,
    });
  }

  const quiz = await response.json();
  return json(quiz);
};

export default function Quiz() {
  const { quiz } = useLoaderData();

  return (
    <div>
      <h1>Generated Quiz</h1>
      <p>{quiz}</p>
    </div>
  );
}
