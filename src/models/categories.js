import db from './db.js';

export async function getAllCategories() {
  const query = 'SELECT * FROM categories ORDER BY name';
  const result = await db.query(query);
  return result.rows;
}

