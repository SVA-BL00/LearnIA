import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { CircularProgressbar } from "react-circular-progressbar";
import "../styles/custom-progress.css";
import Task from "../components/Task";
import "../styles/custom-tabs.css";
import "../styles/dashboard.css";

function CursosDashboard({ courses }) {
    return (
        <Tabs>
            <TabList>
                {courses.map((course, index) => (
                    <Tab key={index}>{course.title}</Tab>
                ))}
            </TabList>

			{courses.map((course, index) => (
				<TabPanel key={index}>
					<div className="panel-box">
						<div className="title-box">
							<h5
								className="Lato fw-bold fst-italic"
								style={{ color: "var(--red-color)" }}
							>
								Tu curso actual:
							</h5>
							<h2 className="Ubuntu fw-bold course-title">{course.title}</h2>
						</div>
						<div className="content-box">
							<div className="progress">
								<div className="progress-box">
									<CircularProgressbar
										value={course.temasCompletados}
										maxValue={course.temasTotales}
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
								<div className="progress-box">
									<CircularProgressbar
										value={course.calificacionFinal}
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
											{course.calificacionFinal}%
										</span>
										<span>calificacion final</span>
									</div>
								</div>
							</div>
							<div className="task-display">
								<Task tasks={course.tasks} dates={course.dates} />
							</div>
							
						</div>
					</div>
				</TabPanel>
			))}
		</Tabs>
	);
}

export default CursosDashboard;

