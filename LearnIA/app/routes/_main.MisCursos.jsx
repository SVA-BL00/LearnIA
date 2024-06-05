// app/routes/miscursos.jsx or app/routes/miscursos.js
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import { getCursosActivosConDetalles } from "../services/db"; 

// Define the loader function
export const loader = async ({ request }) => {
	const user = await authenticator.isAuthenticated(request);

	console.log("User:", user);

	if (!user) {
		throw new Response("Unauthorized", { status: 401 });
	}
	
	const cursos = await getCursosActivosConDetalles(user.user.estudianteId);

  // Return the data as a JSON response
  return json(cursos);
};

import MisCursos from "../components/InfoMisCursos";

export default function MisCursosRoute() {
  const cursos = useLoaderData();

  return <MisCursos cursos={cursos} />;
}