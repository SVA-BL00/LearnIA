import "../styles/countdown.css";
import { useState, useEffect } from "react";

// FUNCTION TO GET TIME LEFT //
const getTimeLeft = (targetDate) => {
	const totalTimeLeft = targetDate - new Date();
	const days = Math.floor(totalTimeLeft / (1000 * 60 * 60 * 24));
	const hours = Math.floor((totalTimeLeft / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((totalTimeLeft / (1000 * 60)) % 60);
	const seconds = Math.floor((totalTimeLeft / 1000) % 60);

	const formattedDays = days.toString().padStart(2, "0");
	const formattedHours = hours.toString().padStart(2, "0");
	const formattedMinutes = minutes.toString().padStart(2, "0");
	const formattedSeconds = seconds.toString().padStart(2, "0");

	return {
		días: formattedDays,
		horas: formattedHours,
		minutos: formattedMinutes,
		segundos: formattedSeconds,
	};
};

function Countdown({ examenFinalDate }) {
	// GETS THE DATE AND CHANGES THE CLOCK //
	const [timeLeft, setTimeLeft] = useState(getTimeLeft(examenFinalDate));

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(getTimeLeft(examenFinalDate));
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, [examenFinalDate]);

	// MAPS EVERY VALUE INSIDE THE FRONT END //
	return (
		<div className="mainClock">
			{Object.entries(timeLeft).map(([label, value]) => (
				<div className="box" key={label}>
					<div className="color-box">
						<div className="value">
							<span>{value}</span>
						</div>
					</div>
					<span className="label">{label}</span>
				</div>
			))}
		</div>
	);
}

export default Countdown;