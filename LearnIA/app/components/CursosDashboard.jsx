import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { CircularProgressbar } from "react-circular-progressbar";
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
							<h5 className= "Lato fw-bold fst-italic"style={{color:"var(--red-color)"}}>Tu curso actual:</h5>
							<h2 className="Ubuntu fw-bold course-title">{course.title}</h2>
						</div>
						<div className="content-box">
							<div className="progress">
								<div className="progress-box">
								<VisibilitySensor>
									{({ isVisible }) => {
									return (
										<CircularProgressbar
										value={course.temasCompletados}
										maxValue={course.temasTotales}
										/>
									);
									}}
								</VisibilitySensor>
								</div>
								<div className="progress-box"></div>
							</div>
						</div>
					</div>
                </TabPanel>
            ))}
        </Tabs>
    );
}

export default CursosDashboard;

