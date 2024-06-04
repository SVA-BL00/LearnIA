import { useState } from "react";
import Calendar from "react-calendar";
import "../styles/calendar-modal.css";
import "react-calendar/dist/Calendar.css";
import "../styles/custom-calendar.css";

function CalendarModal({ show, onClose, dates }) {
	const [value, setValue] = useState(new Date());
	const [quizzesText, setQuizzesText] = useState("");

	const datesToAddContentTo = dates;

	const isSameDay = (a, b) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	const tileClassName = ({ date, view }) => {
		if (view === "month") {
			if (datesToAddContentTo.find((dDate) => isSameDay(dDate.date, date))) {
				return "highlight";
			}
		}
		return null;
	};

	const onClickDay = (date, event) => {
		const clickedDate = datesToAddContentTo.find((dDate) =>
			isSameDay(dDate.date, date),
		);
		if (clickedDate) {
			setQuizzesText(clickedDate.quizzes.join(", "));
		}
	};

	if (!show) {
		return null;
	}

	return (
		<div className="modal" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<div
					className="modal-close"
					onClick={onClose}
					style={{ cursor: "pointer" }}
				>
					<i className="bi bi-x-lg" />
				</div>
				<div className="modal-calendar">
					<Calendar
						onClickDay={onClickDay}
						value={value}
						tileClassName={tileClassName}
					/>
					<span id="quizzes-text">{quizzesText}</span>
				</div>
			</div>
		</div>
	);
}

export default CalendarModal;
