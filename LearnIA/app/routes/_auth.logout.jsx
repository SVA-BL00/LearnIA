import { redirect } from "@remix-run/node";
import { authenticator } from "../services/auth.server";

export async function loader({ request }) {
	await authenticator.logout(request, { redirectTo: "/" });
	return redirect("/");
}
