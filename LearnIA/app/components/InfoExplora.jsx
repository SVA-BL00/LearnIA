import { Form } from "@remix-run/react";
import ExploraCollapsibleCarrera from "../components/ExploraCollapsibleCarrera";
import ExploraCollapsibleSemestre from "../components/ExploraCollapsibleSemestre";
import ExploraCollapsibleMateria from "../components/ExploraCollapsibleMateria";
import "../styles/Explora.css";

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
                        <Form method="post">
                          <input type="hidden" name="idMateria" value={materia.idMateria} />
                          <button type="submit" className="btn green">
                            Inscribirse
                          </button>
                        </Form>
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