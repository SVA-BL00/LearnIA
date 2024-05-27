import { useState, useEffect } from "react";
import { useLocation, useLoaderData } from "@remix-run/react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "../styles/MisCursos.css";
import CollapsibleSection from "../components/CollapsibleSection";
import TitleWithImages from "../components/TitleWithImages";

// Get the user's courses
import { json } from "@remix-run/node";
import { requireUser } from "../services/session.server";
import { getCursosInscritos, getCursosByIds, getNombreMateriaByCursoId } from "../services/db";

// Load the user's courses
export let loader = async ({ request }) => {
    const user = await requireUser(request); // Get the user
    const estudianteId = user.estudianteId; // Get the user's ID

    const cursosInscritosIds = await getCursosInscritos(estudianteId); // Get the user's courses
    const cursos = await getCursosByIds(cursosInscritosIds); // Get the course details
    const cursosWithMateria = await Promise.all(cursos.map(async (curso) => {
        const nombreMateria = await getNombreMateriaByCursoId(curso.idCurso);
        const descripcionMateria = await getDescripcionMateriaByCursoId(curso.idCurso);
        return { ...curso, nombreMateria, descripcionMateria };
    }));
    return json(cursosWithMateria); // Return the courses
};

function MisCursos() {
    const cursos = useLoaderData();
    const location = useLocation();
    const [activePath, setActivePath] = useState(location.pathname);

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location.pathname]);

    return (
        <div style={{ marginLeft: '400px' }}>
            <TitleWithImages title="Mis Cursos" />
            <div>
                {cursos.length === 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', fontFamily: `"Ubuntu Mono", monospace`}}> 
                        <p>No tienes cursos inscritos.</p> 
                    </div>
                ) : (
                    cursos.map((curso) => (
                        <CollapsibleSection key={curso.idCurso} title={curso.nombreMateria}>
                            <div className="collapsible-content">
                                <div className="left-content">
                                    <p>{curso.descripcionMateria}</p>
                                    <button className="btn orange">Ver temas</button>
                                    <button className="btn green">Proyectos recomendados</button>
                                    <button className="btn red">Abandonar curso</button>
                                </div>
                                <div className="right-content">
                                    <div style={{ width: 100, height: 100 }}>
                                        <CircularProgressbar 
                                            value={curso.progreso} 
                                            text={`${curso.progreso}%`}
                                            styles={buildStyles({
                                                textColor: "#2b8a74",
                                                pathColor: "#2b8a74",
                                                trailColor: "#d6d6d6"
                                            })}
                                        />
                                    </div>
                                    <div className="progress-text">{curso.progreso}% de progreso</div>
                                </div>
                            </div>
                        </CollapsibleSection>
                    ))
                )}
            </div>
        </div>
    );
}

export default MisCursos;