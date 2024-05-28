import mysql from 'mysql2/promise';
import { config } from "dotenv";

config();

export async function getConnection() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
    maxIdle: 10, // max idle pools, the default value is the same as `poolLimit`
    idleTimeout: 60000, // idle pools timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
  return pool;
}

export async function getCursosInscritos(estudianteId) {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT idCurso FROM Curso WHERE idEstudiante = ?', [estudianteId]);
    if (!rows || rows.length === 0) {
        return [];
    }
    return rows.map(row => row.idCurso);
}

export async function getCursosByIds(cursoIds) {
    if (cursoIds.length === 0) {
        return [];
    }
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT * FROM Curso WHERE idCurso IN (?)', [cursoIds]);
    return rows;
}

export async function getCursoById(cursoId) {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT * FROM Curso WHERE idCurso = ?', [cursoId]);
    return rows[0];
}

export async function getNombreMateriaByCursoId(cursoId) {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT nombre FROM Materia WHERE idMateria = (SELECT idMateria FROM Curso WHERE idCurso = ?)', [cursoId]);
    return rows[0].nombre;
}

export async function getDescripcionMateriaByCursoId(cursoId) {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT descripcion FROM Materia WHERE idMateria = (SELECT idMateria FROM Curso WHERE idCurso = ?)', [cursoId]);
    return rows[0].descripcion;
}
