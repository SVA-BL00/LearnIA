import "../styles/countdown.css";

function Countdown() {

    return (
        <div className="mainClock">
            <div className="box">
                <div className="value"><span>30</span></div>
                <span className="label">Days</span>
            </div>
            <div className="box">
                <div className="value"><span>30</span></div>
                <span className="label">Hours</span>
            </div>
            <div className="box">
                <div className="value"><span>30</span></div>
                <span className="label">Minutes</span>
            </div>
            <div className="box">
                <div className="value"><span>30</span></div>
                <span className="label">Seconds</span>
            </div>
        </div>
    );
}

export default Countdown;

