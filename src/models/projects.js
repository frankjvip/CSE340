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
      p.project_id,
      p.organization_id,
      p.title,
      p.description,
      p.project_location,
      p.project_date
    FROM project p
    WHERE p.organization_id = $1
    ORDER BY p.project_date ASC;
  `;
  
  const { rows } = await pool.query(query, [organizationId]);
  return rows;
};

/**
 * Creates a new project in the database.
 * @param {string} title - The title of the project.
 * @param {string} description - A description of the project.
 * @param {string} location - The location of the project.
 * @param {string} date - The date of the project.
 * @param {number|string} organizationId - The ID of the associated organization.
 * @returns {number|string} The ID of the newly created project.
 */
const createProject = async (title, description, location, date, organizationId) => {
  const query = `
    INSERT INTO project (title, description, project_location, project_date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;
  const queryParams = [title, description, location, date, organizationId];
  const { rows } = await pool.query(query, queryParams);

  if (rows.length === 0) {
    throw new Error('Failed to create project');
  }

  return rows[0].project_id;
};

/**
 * Updates an existing service project in the database using parameterized queries.
 * @param {number|string} projectId - The ID of the project to update.
 * @param {string} title - The title of the project.
 * @param {string} description - The description of the project.
 * @param {string} location - The location of the project.
 * @param {string} date - The date of the project.
 * @param {number|string} organizationId - The ID of the associated organization.
 * @returns {Object} The updated project record.
 */
const updateProject = async (projectId, title, description, location, date, organizationId) => {
  const query = `
    UPDATE project
    SET title = $1,
        description = $2,
        project_location = $3,
        project_date = $4,
        organization_id = $5
    WHERE project_id = $6
    RETURNING *;
  `;
  const queryParams = [title, description, location, date, organizationId, projectId];
  const { rows } = await pool.query(query, queryParams);

  if (rows.length === 0) {
    throw new Error('Project not found or update failed');
  }

  return rows[0];
};

export { 
  getUpcomingProjects, 
  getProjectDetails, 
  getProjectsByOrganizationId,
  createProject,
  updateProject
};