import express from 'express';
import session from 'express-session';
import flash from './src/middleware/flash.js';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import router from './src/routes.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;
// Si process.env.SESSION_SECRET es undefined, usará la clave por defecto
const SESSION_SECRET = process.env.SESSION_SECRET || 'secret_key_fallback_12345';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * SESSION MANAGEMENT
 */
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour of inactivity
}));

/**
 * FLASH MESSAGES MIDDLEWARE
 */
app.use(flash);

/**
 * MAKE FLASH & GLOBALS ACCESSIBLE IN ALL EJS TEMPLATES
 */
app.use((req, res, next) => {
    res.locals.flash = req.flash ? req.flash.bind(req) : () => ({});
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

/**
 * BODY PARSER MIDDLEWARE
 * Allows Express to receive and process form data (POST) and JSON.
 * Must be added before static files and routes.
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * STATIC FILES
 * If your public folder is inside /src/public, use that path.
 * If your public folder is next to server.js, use /public.
 */
app.use(express.static(path.join(__dirname, 'src/public')));

/**
 * VIEW ENGINE
 * Render needs absolute paths. This fixes the “Failed to lookup view” error.
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * LOGGING MIDDLEWARE
 */
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

/**
 * ROUTES
 */
app.use(router);

/**
 * 404 HANDLER
 */
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

/**
 * GLOBAL ERROR HANDLER
 */
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    res.status(status).render(`errors/${template}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack,
        NODE_ENV: NODE_ENV
    });
});

/**
 * START SERVER
 */
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});