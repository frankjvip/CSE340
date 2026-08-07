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

// Assign a single category to a project
async function assignCategoryToProject(projectId, categoryId) {
  const query = `
    INSERT INTO project_categories (project_id, category_id)
    VALUES ($1, $2)
  `;
  await db.query(query, [projectId, categoryId]);
}

// Update all category assignments for a project
export async function updateCategoryAssignments(projectId, categoryIds = []) {
  // 1. Delete all existing category assignments for the project
  const deleteQuery = `
    DELETE FROM project_categories
    WHERE project_id = $1
  `;
  await db.query(deleteQuery, [projectId]);

  // 2. Ensure categoryIds is an array (handles single selection or empty input)
  const idsArray = Array.isArray(categoryIds)
    ? categoryIds
    : [categoryIds].filter(Boolean);

  // 3. Insert each selected category assignment
  for (const categoryId of idsArray) {
    await assignCategoryToProject(projectId, categoryId);
  }
}