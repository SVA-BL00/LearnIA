import { json, redirect } from "@remix-run/node";
import { authenticator } from "../services/auth.server";

export const loader = async ({ request }) => {
    try {
    const user = await authenticator.isAuthenticated(request);
    if (!user) {
        return json(null);
    }
    return json(user);
    } catch (error) {
    return json({ message: "Failed to load user data", error: true });
    }
}