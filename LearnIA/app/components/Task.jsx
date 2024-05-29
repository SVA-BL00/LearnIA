import { useState } from "react";
import "../styles/task.css";
import CalendarModal from "./CalendarModal";

function Task({ tasks, dates }) {
	const [isComponentVisible, setComponentVisible] = useState(false);

	const handleIconClick = () => {
		setComponentVisible(!isComponentVisible);
	};

	const handleCloseModal = () => {
		setComponentVisible(false);
		setQuizzesText("");
	};

	return (
		<div className="task-container">
			<div className="task-title Roboto sticky-top">
				Esta semana
				<i
					className="bi bi-arrows-angle-expand"
					style={{
						paddingRight: "0",
						fontSize: "1.5em",
						cursor: "pointer",
						pointerEvents: "auto",
					}}
					onClick={handleIconClick}
				/>
				<CalendarModal
					show={isComponentVisible}
					onClose={handleCloseModal}
					dates={dates}
				/>
			</div>
			<div className="tasks">
				{tasks?.map((task, index) => (
					<div
						className="task Lato"
						key={index}
						style={{ color: "var(--red-color)" }}
					>
						<i
							className="bi bi-pencil"
							style={{ paddingRight: "0.5em", fontSize: "1.5em" }}
						/>
						{task}
					</div>
				))}
			</div>
		</div>
	);
}

export default Task;
