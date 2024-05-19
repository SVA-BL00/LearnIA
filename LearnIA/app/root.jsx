import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import SideNav from './components/SideNav';


export const meta = () => [
	{
		charset: "utf-8",
		title: "New Remix App",
		viewport: "width=device-width,initial-scale=1",
	},
];

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<div className="d-flex">
					<SideNav />
					<div className="main-content flex-grow-1">
						<Outlet />
					</div>
				</div>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}