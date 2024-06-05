import TitleWithImages from "../components/TitleWithImages";
import ExploraCollapsibleCarrera from "../components/ExploraCollapsibleCarrera";
import ExploraCollapsibleSemestre from "../components/ExploraCollapsibleSemestre";
import ExploraCollapsibleMateria from "../components/ExploraCollapsibleMateria";
import "../styles/Explora.css";

function groupMateriasBySemester(materias) {
    const semesters = {};
  
    materias.forEach((materia) => {
      const semester = materia.semestre || 'Unknown Semester';
      if (!semesters[semester]) {
        semesters[semester] = [];
      }
      semesters[semester].push(materia);
    });
  
    return semesters;
}
  
function Explora({ carreras }) {
    return (
      <div style={{ marginLeft: "400px" }}>
        <TitleWithImages title="Explora" />
        {carreras.map((carrera) => {
          const materiasBySemester = groupMateriasBySemester(carrera.materia);
  
          return (
            <ExploraCollapsibleCarrera key={carrera.idCarrera} title={carrera.nombre}>
              <div className="collapsible1-content">
                {Object.entries(materiasBySemester).map(([semester, materias]) => (
                  <ExploraCollapsibleSemestre key={semester} title={`Semestre ${semester}`}>
                    <div className="collapsible2-content">
                      {materias.map((materia) => (
                        <ExploraCollapsibleMateria key={materia.idMateria} title={materia.nombre}>
                          <div className="collapsible3-content">
                            <p>{materia.objetivos}</p>
                            <button className="btn green">Inscribirse</button>
                          </div>
                        </ExploraCollapsibleMateria>
                      ))}
                    </div>
                  </ExploraCollapsibleSemestre>
                ))}
              </div>
            </ExploraCollapsibleCarrera>
          );
        })}
      </div>
    );
  }
  
export default Explora;
