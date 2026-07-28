import db from './db.js';

// Get all categories
export async function getAllCategories() {
  const query = 'SELECT category_id, name FROM categories ORDER BY name';
  const result = await db.query(query);
  return result.rows;
}

// Get a single category by ID
export async function getCategoryById(id) {
  const query = 'SELECT category_id, name FROM categories WHERE category_id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
}

// Get all categories for a given project
export async function getCategoriesByProjectId(projectId) {
  const query = `
    SELECT c.category_id, c.name
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name
  `;
  const result = await db.query(query, [projectId]);
  return result.rows;
}

// Get all projects for a given category
export async function getProjectsByCategoryId(categoryId) {
  const query = `
    SELECT p.project_id, p.title
    FROM project p
    JOIN project_categories pc ON p.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY p.title
  `;
  const result = await db.query(query, [categoryId]);
  return result.rows;
}
