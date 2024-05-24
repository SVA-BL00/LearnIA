import { useState, useEffect } from "react";
import { useLocation } from "@remix-run/react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "../styles/MisCursos.css";
import CollapsibleSection from "../components/CollapsibleSection";
import TitleWithImages from "../components/TitleWithImages";

function MisCursos() {
    const location = useLocation();
    const [activePath, setActivePath] = useState(location.pathname);

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location.pathname]);

    return (
        <div>
            <div className="MisCursos">
                <div className="container-fluid mt-5 mb-4">
                    <h1>Mis Cursos</h1>
                </div>
            </div>


	return (
		<div>
			<TitleWithImages title="Mis Cursos" />
            <div>
                <CollapsibleSection title="PROGRAMACIÓN ORIENTADA A OBJETOS II">
                    <div className="collapsible-content">
                        <div className="left-content">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum faucibus mollis. Mauris vel lacinia libero. Proin luctus semper sem, ac posuere velit.</p>
                            <button className="btn orange">Ver temas</button>
                            <button className="btn green">Proyectos recomendados</button>
                            <button className="btn red">Abandonar curso</button>
                        </div>
                        <div className="right-content">
                            <div style={{ width: 100, height: 100 }}>
                                <CircularProgressbar 
                                    value={63} 
                                    text={`${63}%`}
                                    styles={buildStyles({
                                        textColor: "#2b8a74",
                                        pathColor: "#2b8a74",
                                        trailColor: "#d6d6d6"
                                    })}
                                />
                            </div>
                            <div className="progress-text">63% de progreso</div>
                        </div>
                    </div>
                </CollapsibleSection>


                <CollapsibleSection title="BIOLOGÍA COMPUTACIONAL">
                    <div className="collapsible-content">
                        <div className="left-content">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum faucibus mollis. Mauris vel lacinia libero. Proin luctus semper sem, ac posuere velit.</p>
                            <button className="btn orange">Ver temas</button>
                            <button className="btn green">Proyectos recomendados</button>
                            <button className="btn red">Abandonar curso</button>
                        </div>
                        <div className="right-content">
                            <div style={{ width: 100, height: 100 }}>
                                <CircularProgressbar 
                                    value={63} 
                                    text={`${63}%`}
                                    styles={buildStyles({
                                        textColor: "#2b8a74",
                                        pathColor: "#2b8a74",
                                        trailColor: "#d6d6d6"
                                    })}
                                />
                            </div>
                            <div className="progress-text">63% de progreso</div>
                        </div>
                    </div>
                </CollapsibleSection>
            </div>
        </div>
    );
}

export default MisCursos;
