// Import the necessary modules and methods
import { redirect } from "@remix-run/node";
import { authenticator } from "../services/auth.server";

// Define the loader function to redirect to /login
export const loader = () => redirect("/login");

// Define the action function to authenticate using the provider
export const action = ({ request, params }) => {
	return authenticator.authenticate(params.provider, request);
};
