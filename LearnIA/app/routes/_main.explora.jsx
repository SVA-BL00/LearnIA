import TitleWithImages from "../components/TitleWithImages";
import "../styles/Explora.css";
import { useState, useEffect } from "react";
import { useLocation } from "@remix-run/react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import ExploraCollapsibleCarrera from "../components/ExploraCollapsibleCarrera";
import ExploraCollapsibleSemestre from "../components/ExploraCollapsibleSemestre";
import ExploraCollapsibleMateria from "../components/ExploraCollapsibleMateria";

function explora() {
const courses = [
	{
		"semesters": [
		  {
			"name": "Semestre 2",
			"subjects": ["Programación Orientada a Objetos", "Modelación de sistemas electromagnéticos", "Biología computacional"]
		  },
		  {
			"name": "Semestre 3",
			"subjects": ["Algoritmos fundamentales", "Internet de las cosas"]
		  }
		]
	  }
	];

    //Estado de inscripción
    const [enrollmentStatus, setEnrollmentStatus] = useState({});

    //Cambiar al estado anterior cada vez que se presiona el botón (Inscrito / No inscrito)
    const handleEnrollmentClick = (subject) => {
      setEnrollmentStatus((prevStatus) => ({
        ...prevStatus,
        [subject]: !prevStatus[subject]
      }));
    };

  return (
    <div style={{ marginLeft: "400px" }}>
      <TitleWithImages title="Explora" />
      <ExploraCollapsibleCarrera title="ITC">
        <div className="collapsible1-content">
          {courses[0].semesters.map((semester, index) => (
            <ExploraCollapsibleSemestre key={index} title={semester.name}>
              <div className="collapsible2-content">
                {semester.subjects.map((subject, subIndex) => (
                  <ExploraCollapsibleMateria key={subIndex} title={subject}>
                    <div className="collapsible3-content">
                      <p>{subject}</p>
                      <button
                        //Dependiendo del status de inscripción el botón es verde o rojo y se cambia el texto
                        className={`btn ${enrollmentStatus[subject] ? "red" : "green"}`}
                        onClick={() => handleEnrollmentClick(subject)}
                      >
                        {enrollmentStatus[subject] ? "Dar de baja" : "Inscribirse"}
                      </button>
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

export default explora;
