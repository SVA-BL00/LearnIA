import { useState } from "react";

import "../styles/CollapsibleSection.css";

function CollapsibleSection({ title, children }) {
	const [isActive, setIsActive] = useState(false);

	const handleToggle = () => {
		setIsActive(!isActive);
	};

	return (
		<div className="collapsible-section">
			<button
				type="button"
				className={`collapsible ${isActive ? "active" : ""}`}
				onClick={handleToggle}
			>
				{title}
				<div className="symbol-wrapper">
					<span className="symbol">&#x2329;</span>
				</div>
			</button>
			<div className={`content ${isActive ? "active" : ""}`}>{children}</div>
		</div>
	);
}

export default CollapsibleSection;
