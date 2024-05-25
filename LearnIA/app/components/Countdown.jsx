import "../styles/countdown.css";
import { useState, useEffect } from "react";

const COUNTDOWN_TARGET = new Date("2024-06-05T23:59:59");

const getTimeLeft = () => {
    const totalTimeLeft = COUNTDOWN_TARGET - new Date();
    const days = Math.floor(totalTimeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((totalTimeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((totalTimeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((totalTimeLeft / 1000) % 60);
  
    // Add leading zeros to single-digit numbers
    const formattedDays = days.toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
  
    return { días: formattedDays, horas: formattedHours, minutos: formattedMinutes, segundos: formattedSeconds };
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
                    <div className="color-box"><div className="value"><span>{value}</span></div></div>
					
					<span className="label">{label}</span>
				</div>
			))}
		</div>
	);
}

export default Countdown;