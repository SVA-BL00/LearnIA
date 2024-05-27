import "../styles/task.css";

function Task({ tasks }) {
	return (
		<div
			className="task-container"
			style={{
				border: "2px solid var(--red-color)",
				overflowY: "scroll",
			}}
		>
			<div
				className="task-title Roboto sticky-top"
				style={{ backgroundColor: "var(--red-color)" }}
			>
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
			<div className="tasks" style={{ color: "var(--red-color)" }}>
				{tasks?.map((task, index) => (
					<div className="task Lato" key={index}>
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
