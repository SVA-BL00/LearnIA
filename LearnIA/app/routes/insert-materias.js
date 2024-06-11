// app/routes/insert-materias.js

import { json } from "@remix-run/node"; // or "@remix-run/server-runtime"
import { fetchAndInsertMaterias } from "../services/APIs/fetchAndInsertMaterias";

export async function loader() {
    try {
        await fetchAndInsertMaterias();
        return json({ message: "Data inserted successfully" }, { status: 200 });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}