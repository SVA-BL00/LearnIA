// app/server/auth.server.js

import { Authenticator } from "remix-auth";
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";
import { sessionStorage } from "../services/session.server";
import { config } from "dotenv";
import prisma from './prisma/prisma.js'
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
			// console.log(profile);
			try {
				let estudiante = await prisma.estudiante.findUnique({
					where: {
					  	correo: profile.emails[0].value,
					},
				});

				if (!estudiante) {
					// User does not exist, create a new entry
					estudiante = await prisma.estudiante.create({
						data: {
						nombre: profile.displayName,
						correo: profile.emails[0].value,
						},
					});
				}
				const user = {
					displayName: profile.displayName,
					email: profile.emails[0].value,
					photo: profile.photos[0].value,
					estudianteId: estudiante.idEstudiante,
				};

      			// Return the profile object with estudianteId
      			return { ...profile, user };
			} catch (error) {
				console.error("Error during authentication:", error);
        		throw new Error("Failed to authenticate user");
			} 
		},
	),
);