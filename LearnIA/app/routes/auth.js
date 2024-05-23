import { authenticator } from "../services/auth.server";

export async function action({ request }) {
	return await authenticator.authenticate("user-pass", request, {
		successRedirect: "/",
		failureRedirect: "/login",
	});
}

export async function loader({ request }) {
	return await authenticator.isAuthenticated(request, {
		successRedirect: "/",
	});
}
