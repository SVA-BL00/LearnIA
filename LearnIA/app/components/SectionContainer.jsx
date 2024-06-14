import { useState } from "react";

import "../styles/CollapsibleSection.css";

function CollapsibleSection({ title, children }) {
	const [isActive, setIsActive] = useState(true);

	const handleToggle = () => {
		setIsActive(isActive);
	};

	return (
		<div className="collapsible-section">
			<button
				type="button"
				className={`collapsible ${isActive ? "active" : ""}`}
				onClick={handleToggle}
			>
				{title}
			</button>
			<div className={`content ${isActive ? "active" : ""}`}>{children}</div>
		</div>
	);
}

export default CollapsibleSection;
