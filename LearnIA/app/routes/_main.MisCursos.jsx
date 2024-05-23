import { useState, useEffect } from 'react';
import { useLocation } from '@remix-run/react';
import '../styles/MisCursos.css';
import CollapsibleSection from '../components/CollapsibleSection';

function MisCursos() {
	const location = useLocation();
	const [_activePath, setActivePath] = useState(location.pathname);
	const [isCollapsibleActive, setIsCollapsibleActive] = useState(false);

	useEffect(() => {
		setActivePath(location.pathname);
	}, [location.pathname]);

	const handleCollapsibleClick = () => {
		setIsCollapsibleActive(!isCollapsibleActive);
	};

	return (
		<div>
			<div className="MisCursos">
				<div className="container-fluid mt-5 mb-4">
					<h1>Mis Cursos</h1>
				</div>
			</div>

			<div>
				<hr className="solid" />
			</div>

            <CollapsibleSection title="PROGRAMACIÓN ORIENTADA A OBJETOS">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin imperdiet lacus sit amet.</p>
            </CollapsibleSection>
            
            <CollapsibleSection title="DISEÑO DE SISTEMAS">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin imperdiet lacus sit amet.</p>
            </CollapsibleSection>
        </div>
    );
}

export default MisCursos;
