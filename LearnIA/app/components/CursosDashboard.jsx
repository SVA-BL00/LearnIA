// components/CursosDashboard.jsx

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { CircularProgressbar } from "react-circular-progressbar";
import "../styles/custom-progress.css";
import Task from "../components/Task";
import "../styles/custom-tabs.css";
import "../styles/dashboard.css";

function CursosDashboard({ cursos }) {

  if (!cursos || !Array.isArray(cursos) || cursos.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', fontFamily: `"Ubuntu Mono", monospace` }}>
        <p>No tienes cursos inscritos.</p>
      </div>
    );
  }

  return (
    <Tabs>
      <TabList>
        {cursos.map((curso, index) => (
          <Tab key={index}>{curso.title}</Tab>
        ))}
      </TabList>

      {cursos.map((curso, index) => (
        <TabPanel key={index}>
          <div className="panel-box">
            <div className="title-box">
              <h5
                className="Lato fw-bold fst-italic"
                style={{ color: "var(--red-color)" }}
              >
                Tu curso actual:
              </h5>
              <h2 className="Ubuntu fw-bold course-title">{curso.title}</h2>
            </div>
            <div className="content-box">
              <div className="progress">
                <div className="progress-box">
                  <CircularProgressbar
                    value={curso.temasCompletados}
                    maxValue={curso.temasTotales}
                    styles={{
                      path: {
                        stroke: "var(--green-color)",
                      },
                    }}
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
                <div className="progress-box">
                  <CircularProgressbar
                    value={curso.calificacionFinal}
                    styles={{
                      path: {
                        stroke: "var(--yellow-color)",
                      },
                    }}
                  />
                  <div
                    className="Lato text-center fw-bold label-circle"
                    style={{ color: "var(--yellow-color)" }}
                  >
                    <span style={{ fontSize: "2em", marginRight: "0.1em" }}>
                      {curso.calificacionFinal}%
                    </span>
                    <span>calificacion final</span>
                  </div>
                </div>
              </div>
              <div className="task-display">
                <Task tasks={curso.tasks} dates={curso.dates} />
              </div>
            </div>
          </div>
        </TabPanel>
      ))}
    </Tabs>
  );
}

export default CursosDashboard;