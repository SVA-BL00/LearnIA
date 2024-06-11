import { useState } from "react";

import "../styles/ExploraCollapsibleSection.css";

function ExploraCollapsibleCarrera({ title, children }) {
	const [isActive, setIsActive] = useState(false);

	const handleToggle = () => {
		setIsActive(!isActive);
	};

	return (
		<div className="collapsible1-section">
			<button
				type="button"
				className={`collapsible1 ${isActive ? "active" : ""}`}
				onClick={handleToggle}
			>
				{title}
				<div className="symbol-wrapper">
					<span className="symbol1">&#x2329;</span>
				</div>
			</button>
			<div className={`content1 ${isActive ? "active" : ""}`}>{children}</div>
		</div>
	);
}

export default ExploraCollapsibleCarrera;
