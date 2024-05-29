// app/server/auth.server.js
import { Authenticator } from "remix-auth";
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";
import { sessionStorage } from "../services/session.server";
import { config } from "dotenv";
config();

import { json } from "@remix-run/node";

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
			console.log(profile);
			const user = {
				displayName: profile.displayName,
				email: profile.emails[0].value,
				photo: profile.photos[0].value,
			};
			return user;
		},
	),
);

export const loader = async ({ request }) => {
	try {
	  const user = await authenticator.isAuthenticated(request);
	  if (!user) {
		return redirect('/login'); // Redirect to login if the user is not authenticated
	  }
	  return json(user);
	} catch (error) {
	  console.error("Error in loader:", error);
	  return json({ message: "Failed to load data", error: true });
	}
};