import { Form } from "@remix-run/react";
import ExploraCollapsibleCarrera from "../components/ExploraCollapsibleCarrera";
import ExploraCollapsibleSemestre from "../components/ExploraCollapsibleSemestre";
import ExploraCollapsibleMateria from "../components/ExploraCollapsibleMateria";
import "../styles/Explora.css";
import { fetchDataFromFlask } from "../services/APIs/aiRequest.js";
 
// Function to group materias by semester
function groupMateriasBySemester(materias) {
  const semesters = {};

  materias.forEach((materia) => {
    const semester = materia.semestre || "Unknown Semester";

    if (!semesters[semester]) {
      semesters[semester] = [];
    }

    semesters[semester].push(materia);
  });

  return semesters;
}

function InfoExplora({ materias, enrolledMaterias, nombreCarrera }) {
  const enrolledSet = new Set(enrolledMaterias);
  const materiasBySemester = groupMateriasBySemester(materias);

  const handleInscribirse = async (materia) => {
    // Fetch data for Temario and Proyectos
    try {
      const dataTemario = { nombreCarrera, nombre: materia.nombre, objetivos: materia.objetivos, librosRecomendados: materia.recursos};
      console.log('dataTemario:', dataTemario);
      const temasData = await fetchDataFromFlask('http://127.0.0.1:5000/temario', dataTemario);
      console.log('temasData:', temasData);

      const parsedResponse = JSON.parse(temasData.response);
      const temas = parsedResponse.Temario;
      console.log('temas:', temas);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <ExploraCollapsibleCarrera title={`${nombreCarrera}`}>
        <div className="collapsible1-content">
          {Object.entries(materiasBySemester).map(([semester, materias]) => (
            <ExploraCollapsibleSemestre key={semester} title={`Semestre ${semester}`}>
              <div className="collapsible2-content">
                {materias.map((materia) => (
                  <ExploraCollapsibleMateria key={materia.idMateria} title={materia.nombre}>
                    <div className="collapsible3-content">
                      <p>{materia.objetivos}</p>
                      {enrolledSet.has(materia.idMateria) ? (
                        <p className="enrolled-message">Ya tienes este curso inscrito</p>
                      ) : (
                        <button
                          type="button"
                          className="btn green"
                          onClick={() => handleInscribirse(materia)}
                        >
                          Inscribirse
                        </button>
                      )}
                    </div>
                  </ExploraCollapsibleMateria>
                ))}
              </div>
            </ExploraCollapsibleSemestre>
          ))}
        </div>
      </ExploraCollapsibleCarrera>
    </div>
  );
}

export default InfoExplora;