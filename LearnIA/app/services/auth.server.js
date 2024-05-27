// app/server/auth.server.js
import { Authenticator } from "remix-auth";
import {
	GoogleStrategy,
	MicrosoftStrategy,
	SocialsProvider,
} from "remix-auth-socials";
import { sessionStorage } from "../services/session.server";
import { config } from "dotenv";
import { getConnection } from "../services/db";

config();

// Create an instance of the authenticator
export const authenticator = new Authenticator(sessionStorage, {
	sessionKey: "_session",
});

const getCallback = (provider) => {
	return `http://localhost:3000/auth/${provider}/callback`;
};

authenticator.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID_GOOGLE,
			clientSecret: process.env.CLIENT_SECRET_GOOGLE,
			callbackURL: getCallback(SocialsProvider.GOOGLE),
		},
		async ({ profile }) => {
			try {
				const connection = await getConnection();
      
      			// Check if the user already exists
      			const [rows] = await connection.query('SELECT idEstudiante FROM Estudiante WHERE correo = ?', [profile.emails[0].value]);
      
      			let estudianteId;
      			if (rows.length > 0) {
        			// User exists
        			estudianteId = rows[0].idEstudiante;
     			} else {
        			// User does not exist, create a new entry
        			const [result] = await connection.query(
          				'INSERT INTO Estudiante (nombre, correo) VALUES (?, ?)', 
          				[profile.displayName, profile.emails[0].value]
        			);
        			estudianteId = result.insertId;
      			}

      			// Return the profile object with estudianteId
      			return { ...profile, estudianteId };
			} catch (error) {
				console.error("Error during authentication:", error);
        		throw new Error("Failed to authenticate user");
			}
		},
	)
);
