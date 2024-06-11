import { useState } from "react";

import "../styles/ExploraCollapsibleSection.css";

function ExploraCollapsibleMateria({ title, children }) {
	const [isActive, setIsActive] = useState(false);

	const handleToggle = () => {
		setIsActive(!isActive);
	};

	return (
		<div className="collapsible3-section">
			<button
				type="button"
				className={`collapsible3 ${isActive ? "active" : ""}`}
				onClick={handleToggle}
			>
				{title}
				<div className="symbol-wrapper">
					<span className="symbol3">&#x2329;</span>
				</div>
			</button>
			<div className={`content3 ${isActive ? "active" : ""}`}>{children}</div>
		</div>
	);
}

export default ExploraCollapsibleMateria;
