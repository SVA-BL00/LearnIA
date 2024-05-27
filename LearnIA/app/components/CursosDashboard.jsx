import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { CircularProgressbar } from "react-circular-progressbar";
import Task from "../components/Task";
import "../styles/custom-tabs.css";
import "../styles/dashboard.css";

function CursosDashboard({ courses }) {
    return (
        <Tabs style={{ height: "100%" }}>
            <TabList>
                {courses.map((course, index) => (
                    <Tab key={index}>{course.title}</Tab>
                ))}
            </TabList>

            {courses.map((course, index) => (
                <TabPanel key={index}>
                    <div className="tab-content">
                        <h5
                            className="Lato fst-italic fw-bold"
                            style={{ color: "var(--red-color)" }}
                        >
                            Tu curso actual:
                        </h5>
                        <h2
                            className="Ubuntu title-course fw-bold text-uppercase"
                            style={{ backgroundColor: "var(--blue-color)", color: "white" }}
                        >
                            {course.title}
                        </h2>
						<div className="container-dash">
                        <div className="progress">
                            <div className="progress-space">
                                <CircularProgressbar
                                    value={course.temasCompletados}
                                    maxValue={course.temasTotales}
                                    styles={{
                                        path: {
                                            stroke: `var(--green-color)`,
                                        },
                                    }}
                                />

                                <div
                                    className="Lato text-center fw-bold"
                                    style={{ color: "var(--green-color)", fontSize: "1em" }}
                                >
                                    <span style={{ fontSize: "2em", marginRight: "0.1em" }}>
                                        {course.temasCompletados}
                                    </span>
                                    <span>de</span>
                                    <span
                                        style={{
                                            fontSize: "2em",
                                            marginLeft: "0.1em",
                                            marginRight: "0.1em",
                                        }}
                                    >
                                        {course.temasTotales}
                                    </span>
                                    <span>temas completados</span>
                                </div>
                            </div>
                            <div className="progress-space">
                                <CircularProgressbar
                                    value={course.calificacionFinal}
                                    styles={{
                                        path: {
                                            stroke: `var(--yellow-color)`,
                                        },
                                    }}
                                />

                                <div
                                    className="Lato text-center fw-bold"
                                    style={{ color: "var(--yellow-color)", fontSize: "1em" }}
                                >
                                    <span style={{ fontSize: "2em", marginRight: "0.1em" }}>
                                        {course.calificacionFinal}%
                                    </span>
                                    <span>calificacion final</span>
                                </div>
                            </div>
                        </div>

                        <div className="task-container-2">
                            <Task tasks={course.tasks} />
                        </div>
                    </div>
					
                    </div>
                </TabPanel>
            ))}
        </Tabs>
    );
}

export default CursosDashboard;

