import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Task from "../components/Task";
import "../styles/custom-tabs.css";

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
					<div className="container">
						<div className="row">
							<div className="col-8">
								<div className="row">
									<div className="col-6">
										<div className="child-1">Child 1</div>
									</div>
									<div className="col-6">
										<div className="child-2">Child 2</div>
									</div>
								</div>
							</div>
							<div className="col-4">
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
