import React, { useState } from "react";

import "../styles/ExploraCollapsibleSection.css";

function ExploraCollapsibleSemestre({ title, children }) {
    const [isActive, setIsActive] = useState(false);

    const handleToggle = () => {
        setIsActive(!isActive);
    };

    return (
        <div className="collapsible2-section">
            <button
                type="button"
                className={`collapsible2 ${isActive ? "active" : ""}`}
                onClick={handleToggle}
            >
                {title}
                <div className="symbol-wrapper">
                    <span className="symbol2">&#x2329;</span>
                </div>
            </button>
            <div className={`content2 ${isActive ? "active" : ""}`}>{children}</div>
        </div>
    );
}

export default ExploraCollapsibleSemestre;
