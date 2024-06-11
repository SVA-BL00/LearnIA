// app/services/loaders.js

import { json, redirect } from "@remix-run/node";
import { authenticator } from "./auth.server";

export async function userLoader({ request }) {
<<<<<<< HEAD
  try {
    const user = await authenticator.isAuthenticated(request);
    
    if (!user) {
      return redirect('/login'); // Redirect to login if the user is not authenticated
    }
    
    return json(user);

  } catch (error) {
    console.error("Error in loader:", error);
    return json({ message: "Failed to load data", error: true });
  }
}
=======
	try {
		const user = await authenticator.isAuthenticated(request);
		if (!user) {
			return redirect("/login"); // Redirect to login if the user is not authenticated
		}
		return json(user);
	} catch (error) {
		console.error("Error in loader:", error);
		return json({ message: "Failed to load data", error: true });
	}
}
>>>>>>> 3bbde00 (Checkpoint for format)
