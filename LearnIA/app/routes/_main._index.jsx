import Countdown from "../components/Countdown";
import CursosDashboard from "../components/CursosDashboard";
import Notification from "../components/Notification";
import "../styles/main.css";
function index() {
	const courses = [
		{
			title: "Programación orientada a objetos II",
			content: "lorem impusm asdaskdasdasdas",
			tasks: ["Introduction to OOP", "Classes and Objects", "Inheritance"],
		},
		{ title: "Title 2", content: "Any content 2" },
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
