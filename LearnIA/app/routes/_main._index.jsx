import Countdown from "../components/Countdown";
import CursosDashboard from "../components/CursosDashboard";
import Notification from "../components/Notification";
import "../styles/main.css";
function index() {
	const courses = [
		{
			"title": "Programación Orientada a Objetos II",
			"tasks": [
				"Introducción a la POO",
				"Clases y Objetos",
				"Herencia",
				"Polimorfismo",
				"Encapsulamiento",
				"Abstracción",
			],
			"temasTotales": 10,
			"temasCompletados": 9,
			"calificacionFinal": 80
		},
		{
			"title": "Estructuras de Datos y Algoritmos",
			"tasks": [
				"Introducción a las Estructuras de Datos",
				"Arrays y Listas Enlazadas",
				"Pilas y Colas"
			],
			"temasTotales": 10,
			"temasCompletados": 8,
			"calificacionFinal": 85
		}
	];
	return (
		//<div style={{marginLeft:'400px'}}>
		<div className="dashboard">
			<div className="container-full">
				<div className="wrapper">
					<div className="wrapper-main">
						<div className="title-wrapper">
							<h2 className="title">¿Listo para tu examen?</h2>
						</div>
						<Countdown />
					</div>
					<Notification />
				</div>
				<div className="lower-wrapper">
					<CursosDashboard courses={courses} />
				</div>
			</div>
		</div>
	);
}

export default index;
