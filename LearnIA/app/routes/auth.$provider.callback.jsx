// Define the callback loader function to handle the callback and redirect based on the result
import { authenticator } from "../services/auth.server";

export const loader = ({ request, params }) => {
	return authenticator.authenticate(params.provider, request, {
		successRedirect: "/",
		failureRedirect: "/login",
	});
};
