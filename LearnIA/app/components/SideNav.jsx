import { useState, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";

import "../styles/SideNav.css";
import GorroImage from "../assets/img/gorro-de-graduacion.svg";

function SideNav({ user }) {
	const location = useLocation();
	const [activePath, setActivePath] = useState(location.pathname);

	useEffect(() => {
		setActivePath(location.pathname);
	}, [location.pathname, user.photo]);

	return (
		<div className="d-flex flex-column text-white" id="sidebar-container">
			<a
				href="/"
				className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
			>
				<span className="fs-3 p-3" id="learnia-logo">
					Learn-IA
				</span>
			</a>

			<div className="full-width-container">
				<Link
					to="/perfil"
					className={`nav-link d-block text-white ${
						activePath === "/perfil" ? "active" : ""
					}`}
					onClick={() => setActivePath("/perfil")}
				>
					<div className="row py-2 ps-2">
						<div className="col-12 col-md-3 ps-3 d-flex align-items-center justify-content-center">
							<img
								src={user.photo}
								className="rounded-circle"
								id="profile-image"
								alt="Profile avatar"
							/>
						</div>
						<div className="col-12 col-md-9">
							<div className="container p-1 pt-3" id="profile-info">
								<h5>{user.displayName}</h5>
								<h6>ITC — 4° semestre</h6>
							</div>
						</div>
					</div>
				</Link>
			</div>

			<ul className="nav flex-column mb-auto">
				<li className="nav-item">
					<Link
						to="/"
						className={`nav-link d-block text-white ${
							activePath === "/" ? "active" : ""
						}`}
						onClick={() => setActivePath("/")}
					>
						<i className="bi bi-laptop ps-2" />
						Dashboard
					</Link>
				</li>
				<li>
					<Link
						to="/MisCursos"
						className={`nav-link d-block text-white ${
							activePath === "/MisCursos" ? "active" : ""
						}`}
						onClick={() => setActivePath("/MisCursos")}
					>
						<i className="bi bi-mortarboard ps-2" />
						Mis cursos
					</Link>
				</li>
				<li>
					<Link
						to="/explora"
						className={`nav-link d-block text-white ${
							activePath === "/explora" ? "active" : ""
						}`}
						onClick={() => setActivePath("/explora")}
					>
						<i className="bi bi-search ps-2" />
						Explora
					</Link>
				</li>
			</ul>

			<div className="container-fluid">
				<ul className="nav flex-column mb-auto">
					<li className="nav-item">
						<Link
							to="/ayuda"
							className={`nav-link d-block text-white ${
								activePath === "/ayuda" ? "active" : ""
							}`}
							onClick={() => setActivePath("/ayuda")}
						>
							<i className="bi bi-info-circle-fill" />
							Ayuda
						</Link>
					</li>
					<li>
						<a href="/logout" className="nav-link text-white">
							<i
								className="bi bi-box-arrow-in-right"
								style={{ marginLeft: "-4px" }}
							/>
							Cerrar sesión
						</a>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default SideNav;