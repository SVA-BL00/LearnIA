// app/components/InfoMisCursos.jsx 

import { useEffect, useState } from "react";
import { useLocation, Form } from "@remix-run/react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "../styles/MisCursos.css";
import CollapsibleSection from "../components/CollapsibleSection";
import TitleWithImages from "../components/TitleWithImages";

function MisCursos({ cursos }) {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [selectedCurso, setSelectedCurso] = useState(null);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleVerTemasClick = (curso) => {
    setSelectedCurso(curso);
  };

  const handleCloseModal = () => {
    setSelectedCurso(null);
  };

  console.log('Cursos data:', cursos);

  return (
    <div style={{ marginLeft: '400px' }}>
      <TitleWithImages title="Mis Cursos" />
      <div>
        {cursos?.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', fontFamily: `"Ubuntu Mono", monospace` }}>
            <p>No tienes cursos inscritos.</p>
          </div>
        ) : (
          cursos?.map((curso) => (
            <CollapsibleSection key={curso.idCurso} title={curso.nombreMateria}>
              <div className="collapsible-content">
                <div className="left-content">
                  <p>{curso.descripcionMateria}</p>
                  <button className="btn orange" onClick={() => handleVerTemasClick(curso)}>Ver temas</button>
                  <button className="btn green">Proyectos recomendados</button>
                  <button className="btn blue">Hacer quiz</button>
                  <Form method="post">
                    <input type="hidden" name="idCurso" value={curso.idCurso} />
                    <button type="submit" className="btn red">Abandonar curso</button>
                  </Form>
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
      {selectedCurso && (
        <div className="modal">
          <div className="modal-content">
            <h2>Temas de este curso:</h2>
            <ul>
              {selectedCurso.temas.map((tema) => (
                <li key={tema.idTema}>{tema.nombre}</li>
              ))}
            </ul>
            <button className="btn close" onClick={handleCloseModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MisCursos;
