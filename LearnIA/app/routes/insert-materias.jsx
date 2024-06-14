// insert-materias.jsx

import { json } from "@remix-run/node";
import { fetchAndInsertMaterias } from "../services/APIs/fetchAndInsertMaterias";

export const loader = async () => {
  try {
    await fetchAndInsertMaterias();
    return json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error('Error inserting data:', error);
    return json({ message: "Error inserting data", error }, { status: 500 });
  }
};

export default function InsertMaterias() {
  return (
    <div>
      <h1>Insert Materias</h1>
      <p>Data insertion triggered. Check the server logs for more details.</p>
    </div>
  );
}