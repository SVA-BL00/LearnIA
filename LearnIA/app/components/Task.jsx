import "../styles/task.css";
function Task({ tasks }) {
	return (
		<div
			className="task-container"
			style={{ border: "2px solid var(--red-color)" }}
		>
			<div
				className="task-title"
				style={{ backgroundColor: "var(--red-color)" }}
			>
				Esta semana
				<i className="bi bi-box-arrow-in-right" style={{ paddingRight: "0" }} />
			</div>
			<div className="tasks">
				{tasks?.map((task, index) => (
					<div className="task" key={index}>
						{task}
					</div>
				))}
			</div>
		</div>
	);
}

export default Task;
