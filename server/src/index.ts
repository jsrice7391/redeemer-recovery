import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import groupRoutes from './routes/groups';
import facilitatorRoutes from './routes/facilitators';
import { setupSwagger } from './config/swagger';
import morganMiddleware from './middleware/morganMiddleware';
import logger from './config/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

// Swagger Documentation
setupSwagger(app);

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Welcome endpoint
 *     description: Get a welcome message from the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Welcome to Redeemer Recovery API'
 */
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Redeemer Recovery API' });
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running and healthy
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User routes
app.use('/api/users', userRoutes);

// Group routes
app.use('/api/groups', groupRoutes);

// Facilitator routes
app.use('/api/facilitators', facilitatorRoutes);

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
