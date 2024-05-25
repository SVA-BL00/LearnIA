import Countdown from "../components/Countdown";
import Notification from "../components/Notification";
import "../styles/main.css"
function index() {
	return (
		//<div style={{marginLeft:'400px'}}>
		<div className="dashboard">
			<div className="container-fluid">
			
				<div className="wrapper">
					<div className="wrapper-main">
					<div className="title-wrapper">
					<h2 className="title">¿Listo para tu examen?</h2>
					</div>
					
				<Countdown />
					</div>
					
				<Notification/>
				</div>
			</div>
		</div>
	);
}

export default index;
