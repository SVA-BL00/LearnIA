import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import styles from "bootstrap/dist/css/bootstrap.min.css?url";
import styleFunct from "bootstrap/dist/js/bootstrap.bundle.min?url";
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
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

export function links() {
	return [
		{ rel: "stylesheet", href: styles },
		{ rel: "script", href: styleFunct },
	];
}
