import { useState, useEffect } from "react";
import { useLocation } from "@remix-run/react";
import "../styles/MisCursos.css";

function MisCursos() {
	const location = useLocation();
	const [_activePath, setActivePath] = useState(location.pathname);
	const [isCollapsibleActive, setIsCollapsibleActive] = useState(false);

	useEffect(() => {
		setActivePath(location.pathname);
	}, [location.pathname]);

	const handleCollapsibleClick = () => {
		setIsCollapsibleActive(!isCollapsibleActive);
	};

	return (
		<div>
			<div className="MisCursos">
				<div className="container-fluid mt-5 mb-4">
					<h1>Mis Cursos</h1>
				</div>
			</div>

			<div>
				<hr className="solid" />
			</div>

			<button
				type="button"
				className={`collapsible ${isCollapsibleActive ? "active" : ""}`}
				onClick={handleCollapsibleClick}
			>
				PROGRAMACIÓN ORIENTADA A OBJETOS
				<div className="symbol-wrapper">
					<span className="symbol">&#x2329;</span>
				</div>
			</button>
			<div
				className={`content ${isCollapsibleActive ? "active" : ""}`}
				style={{ display: isCollapsibleActive ? "block" : "none" }}
			>
				<p>Lorem ipsum...</p>
			</div>
		</div>
	);
}

export default MisCursos;
