import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { authenticator } from "../services/auth.server";
import TitleWithImages from "../components/TitleWithImages";
import CollapsibleSection from "../components/CollapsibleSection";
import "../styles/main.css";
import { fetchDataFromFlask } from "../services/APIs/aiRequest.js";

const prisma = new PrismaClient();

// Define the loader function
export const loader = async ({ request, params }) => {
	const user = await authenticator.isAuthenticated(request);

	if (!user) {
		throw new Response("Unauthorized", { status: 401 });
	}

	const _idCurso = await (params.idCurso);
	const numidCurso = parseInt(_idCurso);

	const curso = await prisma.curso.findUnique({
		where: {
		  idCurso: numidCurso,
		},
		include: {
		  materia: true,
		  tema: true,
		}
	});

	function mapTipoToCustomString(tipo) {
		switch (tipo) {
			case 'final_exam':
				return `Examen Final | ${curso.materia.nombre}`;
			case 'quiz':
				return `Quiz | ${curso.materia.nombre}`;
			default:
				return tipo;
		}
	  }
	

	const quizzesNoFormat = await prisma.quiz.findMany({
		where: {
		  idCurso: numidCurso,
		  calificacion: null,
		},
		select: {
		  idQuiz: true,
		  preguntas: true,
		  fecha: true,
		  tipo: true,
		},
	  });

	  const quizzes = quizzesNoFormat.map(quiz => ({
		idQuiz: quiz.idQuiz,
		preguntas: quiz.preguntas,
		fecha: quiz.fecha ? quiz.fecha.toISOString().slice(0, 10) : null,
		tipo: mapTipoToCustomString(quiz.tipo) 
	  }));

	  console.log(quizzes);
	return json({ curso, quizzes });
};

export const action = async ({ request }) => {
	const formData = await request.formData();
	const user = await authenticator.isAuthenticated(request);
	if (!user) {
	throw new Response("Unauthorized", { status: 401 });
	}

	const preguntas = formData.get("preguntas");
	const quizId = formData.get("quizId");
	console.log("Lalalalala", "Hola");

		/*
	model Curso {
		idCurso      Int        @id @unique(map: "idCurso_UNIQUE") @default(autoincrement())
		idEstudiante Int
		idMateria    Int
		plazo        String?    @db.VarChar(45)
		descripcion  String?    @db.MediumText
		completado   String?    @db.VarChar(45)
		proyectosRec String?    @db.MediumText
		estudiante   Estudiante @relation(fields: [idEstudiante], references: [idEstudiante], onDelete: NoAction, onUpdate: NoAction, map: "fk_Curso_Estudiante")
		materia      Materia    @relation(fields: [idMateria], references: [idMateria], onDelete: NoAction, onUpdate: NoAction, map: "fk_Curso_Materia")
		quizzes      Quiz[]     @relation("CursoQuizzes")
		tema         Tema[]
	  
		@@index([idEstudiante], map: "fk_Curso_Estudiante")
		@@index([idMateria], map: "idMateria_idx")
	  }

	  model Quiz {
		idQuiz       Int       @id @unique(map: "idQuiz_UNIQUE") @default(autoincrement())
		feedback     String    @db.MediumText
		preguntas    String    @db.MediumText
		fecha        DateTime? @db.DateTime(0)
		tipo         String    @db.VarChar(45)
		respuestas   String?   @db.MediumText
		calificacion Int?
		idCurso      Int?
		curso        Curso?    @relation("CursoQuizzes", fields: [idCurso], references: [idCurso], onDelete: Cascade, map: "fk_Quiz_Curso")
	  
		@@index([idCurso], map: "idCurso_idx")
	  }

			
		model Tema {
		idTema     Int     @id @default(autoincrement())
		idCurso    Int?
		completado String? @db.VarChar(45)
		nombre     String? @db.MediumText
		curso      Curso?  @relation(fields: [idCurso], references: [idCurso], onDelete: Cascade, map: "idCurso")

		@@index([idCurso], map: "idCurso_idx")
		}

	*/
/*
	const formData = await request.formData();
	const idMateria = formData.get("idMateria");
	const temas = JSON.parse(formData.get("temario"));
	const quizzes = JSON.parse(formData.get("quizzes"));
	const finalExam = JSON.parse(formData.get("examenFinal"));
	const proyectosRec = formData.get("proyectosRec");

	if (!idMateria || !temas || !quizzes || !finalExam || !proyectosRec) {
		throw new Response("Bad Request", { status: 400 });
	}

	const curso = await prisma.curso.create({
		data: {
			idEstudiante: user.user.estudianteId,
			idMateria: Number.parseInt(idMateria, 10),
			completado: "false",
			plazo: "", 
			descripcion: "",
			proyectosRec: proyectosRec,
		},
	});
	console.log("FormData before sending aaaaa:", formData.get("temas"));
	console.log("Funcionapleasetelosuplico", temas);
	console.log("idcurso", curso.idCurso);

	try{
		const temasCreados = await prisma.tema.createMany({
			data: temas.map((tema) => ({
				idCurso: curso.idCurso,
				nombre: tema,
				completado: "false",
			})),
		});

		console.log("Temas creados:", temasCreados);
		console.log(quizzes);

		const quizzesCreados = await prisma.quiz.createMany({
			data: quizzes.map((quiz) => ({
				idCurso: curso.idCurso,
				fecha: quiz.fecha ? new Date(quiz.fecha + "T00:00:00Z").toISOString() : null,
				tipo: "quiz",
				feedback: "",
				preguntas: "",
				respuestas: null,
				calificacion: null,
			})),
		});
		console.log("Quizzes creados:", quizzesCreados);

		const finalExamCreado = await prisma.quiz.create({
			data: {
				idCurso: curso.idCurso,
				fecha: finalExam.fecha ? new Date(finalExam.fecha + "T00:00:00Z").toISOString() : null,
				tipo: "final_exam",
				feedback: "",
				preguntas: "",
				respuestas: null,
				calificacion: null,
			},
		});

		console.log("Final exam creado:", finalExamCreado);

	} catch (error) {
		console.error("Error in action function:", error);
		throw new Response("Internal Server Error", { status: 500 });
	}
	return json({ success: true });
	return redirect("/explora");
	*/
};


function categorizeAndSortQuizzes(quizzes) {
	const now = new Date();
	const thisWeek = [];
	const thisMonth = [];
	const later = [];

	quizzes.sort((a, b) => {
		if (a.fecha === null) return 1;
		if (b.fecha === null) return -1;
		return new Date(a.fecha) - new Date(b.fecha);
	});

	quizzes.forEach((quiz) => {
		if (quiz.fecha === null) {
			later.push(quiz);
			return;
		}

		const quizDate = new Date(quiz.fecha);
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


const handleQuizCreation = async (quizId, curso) => {
	if (!quizId || !curso) return;
	const formData = new FormData();
	console.log(curso);
	const temas = curso.tema;
	console.log(temas)
	formData.append('quizID', quizId);

	if (!temas || temas.length === 0) {
	  console.error("No temas found in curso.");
	  return;
	}

	let quizData;
	try {
		quizData = await fetchDataFromFlask("http://127.0.0.1:5000/quiz", { message: JSON.stringify(temas) } );
		console.log(quizData);
	} catch (error) {
		console.error("Error fetching questions for tema:", temas, error);
		throw new Response("Failed to fetch questions", { status: 500 });
	}

	try {
		formData.append('preguntas', JSON.stringify(quizData));
		
	} catch (error) {
		console.error('Error enrolling:', error);
	}
	console.log("idCurso:", curso.idCurso);

	const quiz = await prisma.quiz.create({
		data: {
			preguntas: preguntas,
			idCurso: curso.idCurso,
		},
	});



	/*	model Curso {
		idCurso      Int        @id @unique(map: "idCurso_UNIQUE") @default(autoincrement())
		idEstudiante Int
		idMateria    Int
		plazo        String?    @db.VarChar(45)
		descripcion  String?    @db.MediumText
		completado   String?    @db.VarChar(45)
		proyectosRec String?    @db.MediumText
		estudiante   Estudiante @relation(fields: [idEstudiante], references: [idEstudiante], onDelete: NoAction, onUpdate: NoAction, map: "fk_Curso_Estudiante")
		materia      Materia    @relation(fields: [idMateria], references: [idMateria], onDelete: NoAction, onUpdate: NoAction, map: "fk_Curso_Materia")
		quizzes      Quiz[]     @relation("CursoQuizzes")
		tema         Tema[]
	  
		@@index([idEstudiante], map: "fk_Curso_Estudiante")
		@@index([idMateria], map: "idMateria_idx")
	  }

	  model Quiz {
		idQuiz       Int       @id @unique(map: "idQuiz_UNIQUE") @default(autoincrement())
		feedback     String    @db.MediumText
		preguntas    String    @db.MediumText
		fecha        DateTime? @db.DateTime(0)
		tipo         String    @db.VarChar(45)
		respuestas   String?   @db.MediumText
		calificacion Int?
		idCurso      Int?
		curso        Curso?    @relation("CursoQuizzes", fields: [idCurso], references: [idCurso], onDelete: Cascade, map: "fk_Quiz_Curso")
	  
		@@index([idCurso], map: "idCurso_idx")
	  }

			
		model Tema {
		idTema     Int     @id @default(autoincrement())
		idCurso    Int?
		completado String? @db.VarChar(45)
		nombre     String? @db.MediumText
		curso      Curso?  @relation(fields: [idCurso], references: [idCurso], onDelete: Cascade, map: "idCurso")

		@@index([idCurso], map: "idCurso_idx")
		}*/
/*
		const response = await fetch(`/quizdashboard/${curso.idCurso}`, {
			method: 'POST',
			body: formData,
		});
	
		if (response.ok) {
			// Update the enrolledSet state to include the newly enrolled materia
			setEnrolledSet((prevSet) => new Set(prevSet).add(materia.idMateria));
		} else {
			console.error("Failed to enroll:", await response.text());
		}*/
	/*
	const materia = selectedMateria;
	setComponentVisible(false);
	setIsLoading(true);

	// Fetch data Temario
	try {
	const formData = new FormData();
	formData.append('idMateria', materia.idMateria);
	
	const dataTemario = { 
		nombreCarrera, 
		nombre: materia.nombre, 
		objetivos: materia.objetivos, 
		librosRecomendados: materia.recursos 
	};
	

	if (startDate && endDate) {
		dataTemario.startDate = startDate.toISOString().split('T')[0];
		dataTemario.endDate = endDate.toISOString().split('T')[0];
	}

	let temasData;
	try {
		temasData = await fetchDataFromFlask('http://127.0.0.1:5000/temario', dataTemario);
		
		console.log(temasData);
		const temario = temasData.temario;
		const quizzes = temasData.quizzes;
		const examenFinal = temasData.examenFinal;

		console.log('Parsed temario:', temario);
		console.log('Parsed quizzes:', quizzes);
		console.log('Parsed final exam:', examenFinal);

		formData.append('temario', JSON.stringify(temario));
		formData.append('quizzes', JSON.stringify(quizzes));
		formData.append('examenFinal', JSON.stringify(examenFinal));

	} catch (error) {
		console.error('Error fetching data from Flask:', error);
		return; // Early return if there's an error
	}

	console.log("FormData before sending:", formData.get("idMateria"));
	console.log("FormData before sending:", formData.get("temario"));
	console.log("FormData before sending:", formData.get("quizzes"));
	console.log("FormData before sending:", formData.get("examenFinal"));
	const dataProyectosRec = { 
		nombreCarrera, 
		nombreMateria: materia.nombre, 
		objetivos: materia.objetivos, 
		temas: JSON.parse(formData.get("temario"))
	};

	//Fetch data Proyectos
			let proyectosRec = null;
			try {
				const proyectosData = await fetchDataFromFlask('http://127.0.0.1:5000/proyectos', dataProyectosRec);
			
				const parsedResponse = JSON.parse(proyectosData.response);

				proyectosRec = parsedResponse.proyectos;
				console.log(JSON.stringify(proyectosRec));

				formData.append("proyectosRec", JSON.stringify(proyectosRec));

			} catch (error) {
				console.error("Error fetching data from Flask:", error);
				return;
			}
			console.log("dataProyectosRec", JSON.stringify(proyectosRec));
	const response = await fetch('/explora', {
		method: 'POST',
		body: formData,
	});

	if (response.ok) {
		// Update the enrolledSet state to include the newly enrolled materia
		setEnrolledSet((prevSet) => new Set(prevSet).add(materia.idMateria));
	} else {
		console.error("Failed to enroll:", await response.text());
	}

	} catch (error) {
	console.error('Error enrolling:', error);
	} finally {
	setIsLoading(false);
	}
	*/
};

export default function QuizCurso() {
	const { curso, quizzes } = useLoaderData();
	const navigate = useNavigate();
	const { thisWeek, thisMonth, later } = categorizeAndSortQuizzes(quizzes);
	
	function handleCombined(quizId, curso) {
		handleQuizCreation(quizId, curso);
		navigate(`/quiz/${quizId}`);
	}
	
	const renderQuizzes = (quizzes, title) => (
		<>
			{quizzes.length > 0 && (
				<div className="px-4 py-3">
					<p style={{ color: "#48605B", fontSize: "1.3em" }} className="Roboto">
						{title}
					</p>
					<hr className="border-2" />
				</div>
			)}
			{quizzes.map((quiz, index) => (
				<CollapsibleSection key={index} title={quiz.tipo}>
					<div style={{ flexDirection: "column", width: "100%" }}>
						<p
							style={{ color: "#E33838", fontSize: "1.3em" }}
							className="fw-bold fst-italic"
						>
							{quiz.fecha
								? `La fecha límite para completar este quiz es el ${quiz.fecha}`
								: "La fecha para este quiz es indefinida"}
						</p>

						<button
							className="btn"
							style={{ backgroundColor: "#48605B", color: "white"}}
							onClick={() => handleCombined(quiz.idQuiz, curso)}
						>
							Hacer quiz
						</button>
					</div>
				</CollapsibleSection>
			))}
		</>
	);

	return (
		<div style={{ marginLeft: "400px" }}>
			<TitleWithImages title="Quizzes y Examenes" />
			{quizzes.length === 0 ? (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "70vh",
						fontFamily: `"Ubuntu Mono", monospace`,
					}}
				>
					<p>No tienes quizzes de este curso.</p>
				</div>
			) : (
				<>
					{renderQuizzes(thisWeek, "Próximos 7 días")}
					{renderQuizzes(thisMonth, "Este mes")}
					{renderQuizzes(later, "Más adelante")}
				</>
			)}
		</div>
	);
}