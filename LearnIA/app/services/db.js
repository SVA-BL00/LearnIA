import mysql from 'mysql2/promise';

let connection;

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });
  }
  return connection;
}

export async function closeConnection() {
  if (connection) {
    await connection.end();
    connection = null;
  }
}

export async function getCursosInscritos(estudianteId) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT idCurso FROM Curso WHERE idEstudiante = ?', [estudianteId]);
    if (!rows || rows.length === 0) {
        return [];
    }
    return rows.map(row => row.idCurso);
}

export async function getCursosByIds(cursoIds) {
    if (cursoIds.length === 0) {
        return [];
    }
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM Curso WHERE idCurso IN (?)', [cursoIds]);
    return rows;
}

export async function getCursoById(cursoId) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM Curso WHERE idCurso = ?', [cursoId]);
    return rows[0];
}

export async function getNombreMateriaByCursoId(cursoId) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT nombre FROM Materia WHERE idMateria = (SELECT idMateria FROM Curso WHERE idCurso = ?)', [cursoId]);
    return rows[0].nombre;
}

export async function getDescripcionMateriaByCursoId(cursoId) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT descripcion FROM Materia WHERE idMateria = (SELECT idMateria FROM Curso WHERE idCurso = ?)', [cursoId]);
    return rows[0].descripcion;
}
