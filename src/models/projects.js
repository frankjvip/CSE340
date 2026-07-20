import pool from './db.js';

// Obtener todos los proyectos junto con el nombre de su organización
const getAllProjects = async () => {
  const query = `
    SELECT p.project_id,
           p.title,
           p.description,
           p.project_date,
           p.project_location,
           o.organization_id,
           o.name AS organization_name
    FROM project p
    JOIN organization o
      ON p.organization_id = o.organization_id
    ORDER BY p.project_date ASC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

// Obtener proyectos asociados a una organización específica
const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      project_id,
      organization_id,
      title,
      description,
      project_location,
      project_date
    FROM project
    WHERE organization_id = $1
    ORDER BY project_date;
  `;
  
  const queryParams = [organizationId];
  const { rows } = await pool.query(query, queryParams);

  return rows;
};

// Exportar las funciones del modelo
export { getAllProjects, getProjectsByOrganizationId };
