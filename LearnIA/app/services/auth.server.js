// app/server/auth.server.js
import { Authenticator } from "remix-auth";
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";
import { sessionStorage } from "../services/session.server";
import { config } from "dotenv";
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
		async ({ profile }, req, res) => {
			req.session.userProfile = profile; // Store user profile in session
			console.log(profile);
			return profile;
		},
	),
);
