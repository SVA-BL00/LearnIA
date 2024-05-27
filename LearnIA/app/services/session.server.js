import { createCookieSessionStorage } from "@remix-run/node";
import { authenticator } from "./auth.server";

// Create sessionStorage object
const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: "_session",
		sameSite: "lax",
		path: "/",
		httpOnly: true, // for security reasons, make this cookie http only
		secrets: ["s3cr3t"], // replace this with an actual secret
		/* secure: process.env.NODE_ENV === "production", */ // enable this in prod only
	},
});

// Individual session methods
const { getSession, commitSession, destroySession } = sessionStorage;

// Export the objects
export { sessionStorage, getSession, commitSession, destroySession };

// Export the authenticator
export async function requireUser(request) {
	const user = await authenticator.isAuthenticated(request, {
	  failureRedirect: "/login", // Redirige al login si no está autenticado
	});
	return user;
}