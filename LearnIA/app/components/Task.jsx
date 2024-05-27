import "../styles/task.css";

function Task({ tasks }) {
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
