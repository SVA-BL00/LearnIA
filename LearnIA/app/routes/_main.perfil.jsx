import { useLoaderData } from "@remix-run/react";
import { userLoader } from '../services/loaders';
export { userLoader as loader };


import TitleWithImages from "../components/TitleWithImages";
import "../styles/Title.css";
import "../styles/Perfil.css";

function perfil() {
  	let userInformation = useLoaderData();
	
    return (
        <div style={{ marginLeft: "400px" }}>
            <TitleWithImages title="Perfil" />
			<div className="container" id="main">
				<div className="container-fluid p-4">
					<h2>Datos Personales</h2>
				</div>
				<div className="container-fluid p-4" id="data-contaner">
					{(!userInformation || userInformation.error) ? 
						(<p>Error: Unable to load user information.</p>)
						: (
							<div className="row">
								<div className="col-12 col-md-4 d-flex align-items-center justify-content-center p-3">
									<img
										src={userInformation.photo}
										className="rounded-circle img-fluid"
										id="perfil-image"
										alt="Profile avatar"
									/>
								</div>
								<div className="col-12 col-md-8 p-3" id="information">
									<h4>Nombre:</h4>
									<p>{userInformation.displayName}</p>
									<h4>Email: </h4>
									<p>{userInformation.email}</p>
								</div>
							</div>
						)
					}
				</div>
				
			</div>
        </div>
    );
}

export default perfil;