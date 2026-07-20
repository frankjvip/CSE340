import pool from './db.js';

// Obtener los próximos proyectos (limitados por número)
const getUpcomingProjects = async (number_of_projects) => {
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
    WHERE p.project_date >= CURRENT_DATE
    ORDER BY p.project_date ASC
    LIMIT $1;
  `;
  const { rows } = await pool.query(query, [number_of_projects]);
  return rows;
};

// Obtener detalles de un proyecto específico
const getProjectDetails = async (id) => {
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
    WHERE p.project_id = $1;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows.length > 0 ? rows[0] : null;
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
  
  const { rows } = await pool.query(query, [organizationId]);
  return rows;
};

// Exportar todas las funciones necesarias
export { getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId };
