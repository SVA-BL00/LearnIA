import { useLoaderData } from "@remix-run/react";
import { loader as indexLoader } from '../services/auth.server';
export { indexLoader as loader };

import TitleWithImages from "../components/TitleWithImages";
import "../styles/Title.css";
import "../styles/Perfil.css";


function perfil() {
  	let userInformation = useLoaderData();
	if (!userInformation || userInformation.error) {
		return (
		<div style={{ marginLeft: "400px" }}>
			<TitleWithImages title="Perfil" />
			Failed to load data.
		</div>);
	}
	

    return (
        <div style={{ marginLeft: "400px" }}>
            <TitleWithImages title="Perfil" />
            <p>{userInformation.displayName}</p>
			<p>{userInformation.email}</p>

			<div className="container-fluid" id="main">
				<h2>Datos Personales</h2>
			</div>

        </div>
    );
}

export default perfil;