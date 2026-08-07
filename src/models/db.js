import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

// La URL Externa (.render.com) REQUIERE SSL.
// La URL Interna (dpg-xxx sin dominio) FALLA si se envía SSL.
const requiresSSL = connectionString && connectionString.includes('render.com');

const pool = new Pool({
    connectionString: connectionString,
    ssl: requiresSSL ? { rejectUnauthorized: false } : false
});

let db = pool;

// Test connection
const testConnection = async () => {
    try {
        const result = await db.query('SELECT NOW() as current_time');
        console.log('Database connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

export { db as default, testConnection };