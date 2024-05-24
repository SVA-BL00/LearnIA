import "../styles/countdown.css";
import { useState, useEffect } from "react";

const COUNTDOWN_TARGET = new Date("2024-06-01T23:59:59");

const getTimeLeft = () => {
	const totalTimeLeft = COUNTDOWN_TARGET - new Date();
	const days = Math.floor(totalTimeLeft / (1000 * 60 * 60 * 24));
	const hours = Math.floor((totalTimeLeft / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((totalTimeLeft / (1000 * 60)) % 60);
	const seconds = Math.floor((totalTimeLeft / 1000) % 60);
	return { days, hours, minutes, seconds };
};

function Countdown() {
	const [timeLeft, setTimeLeft] = useState(getTimeLeft);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(getTimeLeft());
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<div className="mainClock">
			{Object.entries(timeLeft).map(([label, value]) => (
				<div className="box" key={label}>
					<div className="value"><span>{value}</span></div>
					<span className="label">{label}</span>
				</div>
			))}
		</div>
	);
}

export default Countdown;
