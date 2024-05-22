import SideNav from "../components/SideNav";
import { Outlet } from "@remix-run/react";
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
