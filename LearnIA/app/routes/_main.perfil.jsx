import { useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import { Link } from "@remix-run/react"; 
import prisma from "./prisma/prisma.js";

import TitleWithImages from "../components/TitleWithImages";
import "../styles/Title.css";
import "../styles/Perfil.css";

export const loader = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const estudiante = await prisma.estudiante.findUnique({
    where: {
      idEstudiante: user.user.estudianteId,
    },
    select: {
      idCarrera: true,
    },
  });

  const idCarrera = estudiante ? estudiante.idCarrera : null;

  return { user, idCarrera };
};

async function getIdCarrera(user) {
  const estudiante = await prisma.estudiante.findUnique({
    where: {
      idEstudiante: user.user.estudianteId,
    },
    select: {
      idCarrera: true,
    },
  });

  return estudiante ? estudiante.idCarrera : null;
}

function perfil() {
  const { user, idCarrera } = useLoaderData();
  console.log("idCarrera", idCarrera);

  console.log("perfil: ", user);
  console.log("idCarrera", idCarrera);

  return (
    <div style={{ marginLeft: "400px" }}>
      <TitleWithImages title="Perfil" />
      <div className="container" id="main">
        <div className="container-fluid p-4">
          <h2>Datos Personales</h2>
        </div>
        <div className="container-fluid p-4" id="data-contaner">
          {!user || user.error ? (
            <p>Error: Unable to load user information.</p>
          ) : (
            <div className="row">
              <div className="col-12 col-md-4 d-flex align-items-center justify-content-center p-3">
                <img
                  src={user.user.photo}
                  className="rounded-circle img-fluid"
                  id="perfil-image"
                  alt="Profile avatar"
                />
              </div>
              <div className="col-12 col-md-8 p-3" id="information">
                <h4>Nombre:</h4>
                <p>{user.user.displayName}</p>
                <h4>Email: </h4>
                <p>{user.user.email}</p>
                {!idCarrera && (
                  <div style={{ marginTop: "20px" }}>
                    <Link to="/carrera">
                      <button className="button-primary">Registrar carrera</button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default perfil;
