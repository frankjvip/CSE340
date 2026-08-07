import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || '';

// En Render:
// - URL Externa (contiene '.render.com'): Requiere SSL.
// - URL Interna ('dpg-xxx') o Local: NO soporta SSL (falla si se envía SSL).
const isExternalHost = connectionString.includes('render.com');

const pool = new Pool({
    connectionString: connectionString,
    ssl: isExternalHost ? { rejectUnauthorized: false } : false
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