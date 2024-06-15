import { useEffect, useState } from "react";
import { useLocation, Form, useNavigate } from "@remix-run/react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "../styles/MisCursos.css";
import "../styles/custom-progress.css";
import "../styles/dashboard.css";
import CollapsibleSection from "../components/CollapsibleSection";
import TitleWithImages from "../components/TitleWithImages";

function MisCursos({ cursos }) {
	const location = useLocation();
	const navigate = useNavigate();
	const [activePath, setActivePath] = useState(location.pathname);
	const [selectedCurso, setSelectedCurso] = useState(null);
	const [selectedProyectos, setSelectedProyectos] = useState(null);

	const transformedCourses = cursos.map((curso) => ({
		...curso, // Include all original properties of the curso
		temasTotales: curso.temas.length,
		temasCompletados: curso.temas.filter((tema) => tema.completado === "true").length,
	}));

	useEffect(() => {
		setActivePath(location.pathname);
	}, [location.pathname]);

	const handleVerTemasClick = (curso) => {
		setSelectedCurso(curso);
	};

	const handleVerProyectosClick = (curso) => {
		setSelectedProyectos(curso);
	};

	const handleCloseModal = () => {
		setSelectedCurso(null);
		setSelectedProyectos(null);
	};

	return (
		<div style={{ marginLeft: "400px" }}>
			<TitleWithImages title="Mis Cursos" />
			<div>
				{cursos?.length === 0 ? (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "70vh",
							fontFamily: `"Ubuntu Mono", monospace`,
						}}
					>
						<p>No tienes cursos inscritos.</p>
					</div>
				) : (
					transformedCourses.map((curso) => (
						<CollapsibleSection key={curso.idCurso} title={curso.nombreMateria}>
							<div className="collapsible-content" style={{width:"100%"}}>
								<div className="left-content">
									<p>{curso.descripcionMateria}</p>
									<button
										className="btn orange"
										onClick={() => handleVerTemasClick(curso)}
									>
										Ver temas
									</button>
									<button
										className="btn green"
										onClick={() => handleVerProyectosClick(curso)}
									>
										Ver proyectos recomendados
									</button>
									<button
										className="btn blue"
										onClick={() => navigate(`/quizdashboard/${curso.idCurso}`)}
									>
										Hacer quiz
									</button>
									<button
										className="btn green"
										style={{marginTop:'2em'}}
										onClick={() => navigate(`/historial/${curso.idCurso}`)}
									>
										Ver historial de quizzes
									</button>
									<Form method="post">
										<input type="hidden" name="idCurso" value={curso.idCurso} />
										<button type="submit" className="btn red">
											Abandonar curso
										</button>
									</Form>
								</div>
								<div className="right-content">
									<div className="progress-box">
										<CircularProgressbar
											value={curso.temasCompletados}
											maxValue={curso.temasTotales}
											styles={buildStyles({
												pathColor: "var(--green-color)",
											})}
										/>
										<div
											className="Lato text-center fw-bold label-circle"
											style={{ color: "var(--green-color)" }}
										>
											<span style={{ fontSize: "2em", marginRight: "0.1em" }}>
												{curso.temasCompletados}
											</span>
											<span>de</span>
											<span
												style={{
													fontSize: "2em",
													marginLeft: "0.1em",
													marginRight: "0.1em",
												}}
											>
												{curso.temasTotales}
											</span>
											<span>temas completados</span>
										</div>
									</div>
								</div>
							</div>
						</CollapsibleSection>
					))
				)}
			</div>
			{selectedCurso && (
				<div className="modal">
					<div className="modal-content">
						<h2>Temas de este curso:</h2>
						<ul>
							{selectedCurso.temas.map((tema) => (
								<li key={tema.idTema}>{tema.nombre}</li>
							))}
						</ul>
						<button className="btn close" onClick={handleCloseModal}>
							Cerrar
						</button>
					</div>
				</div>
			)}
			{selectedProyectos && (
				<div className="modal">
					<div className="modal-content">
						<h2>Proyectos recomendados:</h2>
						<p>{selectedProyectos.proyectosRec}</p>
						<button className="btn close" onClick={handleCloseModal}>
							Cerrar
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default MisCursos;
