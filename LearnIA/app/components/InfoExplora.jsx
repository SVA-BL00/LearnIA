import React, { useState } from "react";
import { Form } from "@remix-run/react";
import ExploraCollapsibleCarrera from "../components/ExploraCollapsibleCarrera";
import ExploraCollapsibleSemestre from "../components/ExploraCollapsibleSemestre";
import ExploraCollapsibleMateria from "../components/ExploraCollapsibleMateria";
import "../styles/Explora.css";
import { fetchDataFromFlask } from "../services/APIs/aiRequest.js";
import Modal from "./Modal";

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
  const [enrolledSet, setEnrolledSet] = useState(new Set(enrolledMaterias));
  const [isComponentVisible, setComponentVisible] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState(null);

  const materiasBySemester = groupMateriasBySemester(materias);

  const handleIconClick = () => {
    setComponentVisible(!isComponentVisible);
  };

  const handleCloseModal = () => {
    setComponentVisible(false);
  };

  const handleInscribirse = (materia) => {
    setSelectedMateria(materia);
    setComponentVisible(true);
  };

  const proceedWithInscription = async ({ startDate, endDate }) => {
    if (!selectedMateria) return;

    const materia = selectedMateria;
    setComponentVisible(false);

    // Fetch data for Temario and Proyectos
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

      <Modal
        show={isComponentVisible}
        onClose={handleCloseModal}
        onSubmit={proceedWithInscription}
      />
    </div>
  );
}

export default InfoExplora;