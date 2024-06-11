import { createRequestHandler } from "@remix-run/express";
import express from "express";
import prisma from "./prisma/prisma.js";

const viteDevServer =
	process.env.NODE_ENV === "production"
		? null
		: await import("vite").then((vite) =>
				vite.createServer({
					server: { middlewareMode: true },
				}),
			);

const app = express();
app.use(
	viteDevServer ? viteDevServer.middlewares : express.static("build/client"),
);

const build = viteDevServer
	? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
	: await import("./build/server/index.js");

app.all("*", createRequestHandler({ build }));

// Start the server
const server = app.listen(3000, () => {
	console.log("App listening on http://localhost:3000");
});

// Shutdown the server
const gracefulShutdown = async () => {
	console.log("Shutting down gracefully...");
	await prisma.$disconnect(); // Disconnect Prisma Client
	server.close(() => {
		console.log("Closed out remaining connections.");
		process.exit(0);
	});
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
