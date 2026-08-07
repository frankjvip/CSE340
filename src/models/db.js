import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

// Render requiere SSL ÚNICAMENTE si te conectas mediante la URL Externa (.render.com).
// Las conexiones por URL Interna dentro de la red privada de Render NO usan SSL.
const useSSL = connectionString && connectionString.includes('render.com');

const pool = new Pool({
    connectionString: connectionString,
    ssl: useSSL ? { rejectUnauthorized: false } : false
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