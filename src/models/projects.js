import pool from './db.js';

// Obtener todos los proyectos junto con el nombre de su organización
export async function getAllProjects() {
  const query = `
    SELECT p.project_id,
           p.title,
           p.description,
           p.date,
           p.location,
           o.organization_id,
           o.name AS organization_name
    FROM projects p
    JOIN organizations o
      ON p.organization_id = o.organization_id
    ORDER BY p.date ASC;
  `;
  const { rows } = await pool.query(query);
  return rows;
}
