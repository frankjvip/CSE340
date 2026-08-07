import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

// Habilita SSL en entorno de producción o cuando la URL apunta a Render
const pool = new Pool({
    connectionString: connectionString,
    ssl: connectionString && connectionString.includes('render.com') 
        ? { rejectUnauthorized: false } 
        : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false)
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