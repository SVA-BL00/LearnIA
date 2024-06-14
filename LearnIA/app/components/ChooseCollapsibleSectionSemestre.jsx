import { useState } from "react";
import "../styles/ChooseCollapsibleSection.css";

function ChooseCollapsibleSectionSemestre({ title, options, onOptionSelect}) {
	const [selectedOption, setSelectedOption] = useState(null);
	const [isActive, setIsActive] = useState(false);

	const handleToggle = () => {
		setIsActive(!isActive);
	};

	const handleOptionSelect = (option) => {
		setSelectedOption(option);
		setIsActive(false);
		onOptionSelect(option);
	};

	return (
		<div className="collapsible-semester-section">
			<button
				type="button"
				className={`collapsible-semester ${isActive ? "active" : ""}`}
				onClick={handleToggle}
			>
				{selectedOption || title}
				<div className="symbol-wrapper">
					<span className="symbol">&#x2329;</span>
				</div>
			</button>
			<div className={`content ${isActive ? "active" : ""}`}>
				<div className="options-container" style={{ maxHeight: options.length > 4 ? "200px" : "auto" }}>
					{options.map((option) => (
						<p
							key={option}
							className="option"
							onClick={() => handleOptionSelect(option)}
						>
							{option}
						</p>
					))}
				</div>
			</div>
		</div>
	);
}

export default ChooseCollapsibleSectionSemestre;