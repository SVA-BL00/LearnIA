import { authenticator } from "../services/auth.server";
import SideNav from "../components/SideNav";
import { Outlet } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import "../styles/custom-progress.css";

// Define the loader function
export async function loader({ request }) {
	await authenticator.isAuthenticated(request, {
		failureRedirect: "/login",
	});

	const user = await authenticator.isAuthenticated(request);
    if (!user) {
        throw new Response("Unauthorized", { status: 401 });
    }

    return user;
}

export default function Index() {
	const user = useLoaderData();
	return (
		<>
			<SideNav user={user.user} />
			<div className="main-content flex-grow-1">
				<Outlet />
			</div>
		</>
	);
}