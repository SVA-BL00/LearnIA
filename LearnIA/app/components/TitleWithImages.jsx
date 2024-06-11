import Ellipse2 from "../assets/img/Ellipse2.svg";
import Ellipse3 from "../assets/img/Ellipse3.svg";
import Ellipse4 from "../assets/img/Ellipse4.svg";
import Ellipse5 from "../assets/img/Ellipse5.svg";
import Ellipse6 from "../assets/img/Ellipse6.svg";
import GorroGraduacion from "../assets/img/gorro-de-graduacion.svg";

const TitleWithImages = ({ title }) => {
	return (
		<div>
			<div className="main">
				<div className="container-fluid mt-5 mb-4">
					<div className="row">
						<div className="col-5 col-md-5 pt-4">
							<h1>{title}</h1>
						</div>
						<div className="col-7 col-md-7 text-end pe-5">
							<img src={Ellipse2} alt="" className="p-1 mt-5" />
							<img src={Ellipse3} alt="" className="p-1 mb-4" />
							<img src={GorroGraduacion} alt="" className="mt-4" />
							<img src={Ellipse4} alt="" className="p-1 mb-5" />
							<img src={Ellipse5} alt="" className="p-1 mt-2" />
							<img src={Ellipse6} alt="" className="p-3 mb-3" />
						</div>
					</div>
				</div>
			</div>

			<div>
				<hr className="solid" />
			</div>
		</div>
	);
};

export default TitleWithImages;
