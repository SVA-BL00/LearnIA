import Countdown from "../components/Countdown";
function index() {
	return (
		<div className="dashboard">
			<div className="container-fluid">
				<Countdown />
				<h1>Dashboard</h1>
			</div>
		</div>
	);
}

export default index;
