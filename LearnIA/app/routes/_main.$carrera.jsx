import { useState, useEffect } from "react";
import { useLocation, useNavigate, useLoaderData, Form } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import { json, redirect } from "@remix-run/node";
import { PrismaClient } from '@prisma/client';
import ChooseCollapsibleSectionCarrera from "../components/ChooseCollapsibleSectionCarrera";
import ChooseCollapsibleSectionSemestre from "../components/ChooseCollapsibleSectionSemestre";

const prisma = new PrismaClient();

export const loader = async ({ request }) => {
	const user = await authenticator.isAuthenticated(request);

	if (!user) {
		throw new Response("Unauthorized", { status: 401 });
	}

	const carreras = await prisma.carrera.findMany();

	// Fetch the Estudiante record to get the idCarrera
	const estudiante = await prisma.estudiante.findUnique({
		where: {
			idEstudiante: user.user.estudianteId,
		},
		select: {
		  idCarrera: true,
		},
	});
	
	// Check if estudiante record is found and retrieve idCarrera
	const idCarrera = estudiante ? estudiante.idCarrera : null;
	
	console.log(idCarrera);

	return json({
		carreras,
		idCarrera,
	});
};

export const action = async ({ request }) => {
	const user = await authenticator.isAuthenticated(request);

	if (!user) {
		throw new Response("Unauthorized", { status: 401 });
	}

	const formData = await request.formData();
	const carrera = formData.get("carrera");

	if (!carrera) {
		throw new Response("Bad Request", { status: 400 });
	}

	const carreraData = await prisma.carrera.findUnique({
		where: { nombre: carrera },
	});

	if (!carreraData) {
		throw new Response("Carrera not found", { status: 404 });
	}
	
	await prisma.estudiante.update({
		where: { idEstudiante: user.user.estudianteId },
		data: {
			idCarrera: carreraData.idCarrera,
		},
	});

	return redirect("/perfil");
};

export default function Login() {
	const location = useLocation();
	const navigate = useNavigate();
	const { carreras, idCarrera } = useLoaderData();
	const [activePath, setActivePath] = useState(location.pathname);
	const [selectedCarrera, setSelectedCarrera] = useState(null);
	const [selectedSemestre, setSelectedSemestre] = useState(null);

	useEffect(() => {
		setActivePath(location.pathname);
	}, [location.pathname]);

	const semestres = [
        '1°',
		'2°',
		'3°',
		'4°',
		'5°',
		'6°',
		'7°',
		'8°',
		'9°',
		'10°',
		'11°',
		'12°',
    ];

	const isButtonEnabled = selectedCarrera && selectedSemestre;
	
	return (
		<>
			<div id="learnia-logo">Elige una carrera y semestre</div>
			<Form method="post" action="/carrera">
				<div style={{ width: "100%"}}>
					<ChooseCollapsibleSectionCarrera title="Carrera" options={carreras.map(carrera => carrera.nombre)} onOptionSelect={setSelectedCarrera}/>
					<ChooseCollapsibleSectionSemestre title="Semestre" options={semestres} onOptionSelect={setSelectedSemestre}/>
				</div>
				<input type="hidden" name="carrera" value={selectedCarrera || ''} />
				<input type="hidden" name="semestre" value={selectedSemestre || ''} />
				<li style={{textAlign: "center", fontSize: "24px", listStyle: "none", marginTop: "20px" }}>
							<button
								type="submit"
								disabled={!isButtonEnabled}
								style={{ pointerEvents: isButtonEnabled ? "auto" : "none", 
										 opacity: isButtonEnabled ? 1 : 0.5,
										 background: "none",
										 color: "white",
										 border: "none",
										 padding: "0",
										 margin: "0",
										 fontSize: "inherit",
										 fontFamily: "inherit",
										 cursor: isButtonEnabled ? "pointer" : "default",
										}}
							>
							Listo
						</button>
				</li>
			</Form>
		</>
	);
}
