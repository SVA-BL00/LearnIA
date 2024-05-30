import TitleWithImages from "../components/TitleWithImages";
import "../styles/Explora.css";
import { useState, useEffect } from "react";
import { useLocation } from "@remix-run/react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import ExploraCollapsibleCarrera from "../components/ExploraCollapsibleCarrera";
import ExploraCollapsibleSemestre from "../components/ExploraCollapsibleSemestre";
import ExploraCollapsibleMateria from "../components/ExploraCollapsibleMateria";

function explora() {

	return (
		<div style={{ marginLeft: "400px" }}>
			<TitleWithImages title="Explora" />
				<ExploraCollapsibleCarrera title="ITC">
					<div className="collapsible1-content">

						<ExploraCollapsibleSemestre title="Semestre">
							<div className="collapsible2-content">

								<ExploraCollapsibleMateria title="Materia">
									<div className="collapsible3-content">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
											elementum faucibus mollis. Mauris vel lacinia libero. Proin
											luctus semper sem, ac posuere velit.
										</p>
										<button className="btn green">Inscribirse</button>
									</div>
								</ExploraCollapsibleMateria>
							</div>
						</ExploraCollapsibleSemestre>
					</div>
				</ExploraCollapsibleCarrera>
		</div>
	);
}

export default explora;
