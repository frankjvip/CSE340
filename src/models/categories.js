const db = require('./db'); // conection to the database

async function getAllCategories() {
  const query = 'SELECT * FROM categories ORDER BY name';
  const result = await db.query(query);
  return result.rows;
}

module.exports = { getAllCategories };
