import { authenticator } from "../services/auth.server";
import SideNav from "../components/SideNav";
import { Outlet } from "@remix-run/react";

// Define the loader function
export async function loader({ request }) {
	await authenticator.isAuthenticated(request, {
		failureRedirect: "/login",
	});
	return null;
}

export default function Index() {
	return (
		<>
			<SideNav />
			<div className="main-content flex-grow-1">
				<Outlet />
			</div>
		</>
	);
}
