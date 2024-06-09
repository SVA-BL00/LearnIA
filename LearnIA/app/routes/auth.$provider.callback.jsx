import { authenticator } from "../services/auth.server";
import { redirect } from "@remix-run/node";

export const loader = async ({ request, params }) => {
	const result = await authenticator.authenticate(params.provider, request);

	// Check if the user is new and redirect accordingly
	if (result.isNewUser) {
		return redirect("/welcome"); // Replace "/welcome" with your desired route for new users
	}

	return redirect("/"); // Redirect to the home page for existing users
};
