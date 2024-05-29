import Countdown from "../components/Countdown";
import CursosDashboard from "../components/CursosDashboard";
import Notification from "../components/Notification";
import "../styles/main.css";

function getClosestExamenFinalDate(courses) {
	const now = new Date();
	let closestDate = null;
	let minDiff = Number.POSITIVE_INFINITY;

	courses.forEach((course) => {
		course.dates.forEach((dateObj) => {
			if (dateObj.quizzes.includes("Examen Final")) {
				const diff = dateObj.date - now;
				if (diff > 0 && diff < minDiff) {
					closestDate = dateObj.date;
					minDiff = diff;
				}
			}
		});
	});

	return closestDate;
}

function index() {
	const courses = [
		{
			title: "Programación Orientada a Objetos II",
			tasks: [
				"Introducción a la POO",
				"Clases y Objetos",
				"Herencia",
				"Polimorfismo",
				"Encapsulamiento",
				"Abstracción",
			],

			temasTotales: 10,
			temasCompletados: 9,
			calificacionFinal: 80,
			dates: [
				{ date: new Date(2024, 4, 28), quizzes: ["Quiz 1"] },
				{ date: new Date(2024, 4, 30), quizzes: ["Quiz 2"] },
				{ date: new Date(2024, 5, 1), quizzes: ["Examen Final"] },
			],
		},
		{
			title: "Estructuras de Datos y Algoritmos",
			tasks: [
				"Introducción a las Estructuras de Datos",
				"Arrays y Listas Enlazadas",
				"Pilas y Colas",
			],
			temasTotales: 10,
			temasCompletados: 8,
			calificacionFinal: 85,
			dates: [
				{ date: new Date(2024, 5, 5), quizzes: ["Quiz 1"] },
				{ date: new Date(2024, 5, 15), quizzes: ["Quiz 2"] },
				{ date: new Date(2024, 5, 23), quizzes: ["Examen Final"] },
			],
		},
	];
	const closestExamenFinalDate = getClosestExamenFinalDate(courses);
	return (
		<div style={{ marginLeft: "400px" }}>
			<div className="dashboard">
				<div className="container-full">
					<div className="wrapper">
						<div className="wrapper-main">
							<div className="title-wrapper">
								<h2 className="title">¿Listo para tu examen?</h2>
							</div>
							<Countdown examenFinalDate={closestExamenFinalDate} />
						</div>
						<Notification />
					</div>
					<div className="lower-wrapper">
						<CursosDashboard courses={courses} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default index;
