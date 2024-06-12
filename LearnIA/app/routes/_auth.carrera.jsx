import { useState, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";

export default function Login() {
	const location = useLocation();
	const [activePath, setActivePath] = useState(location.pathname);

	useEffect(() => {
		setActivePath(location.pathname);
	}, [location.pathname]);

	return (
		<>
			<div id="learnia-logo">Elige una carrera y semestre</div>
			<li className="nav-item">
					<Link
						to="/explora"
						className={`nav-link d-block text-white ${
							activePath === "/explora" ? "active" : ""
						}`}
						onClick={() => setActivePath("/explora")}
					>
						Done
					</Link>
			</li>
		</>
	);
}
