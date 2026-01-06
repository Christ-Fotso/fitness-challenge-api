import { config } from 'dotenv';
config();

import express, { type Request, type Response, type NextFunction } from 'express';
import { registerRoutes } from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;

    res.on('finish', () => {
        const duration = Date.now() - start;
        if (path.startsWith('/api')) {
            console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
        }
    });

    next();
});

registerRoutes(app);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
    console.error(err);
});

const port = parseInt(process.env.PORT || '5000', 10);

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📍 API available at http://localhost:${port}/api`);
});
