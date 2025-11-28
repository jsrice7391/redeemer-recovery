import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Redeemer Recovery API',
      version: '1.0.0',
      description: 'A comprehensive REST API for user management with full CRUD operations',
      contact: {
        name: 'API Support',
        email: 'support@redeemerrecovery.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'http://localhost:3001',
        description: 'Docker development server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated user ID',
              example: 1,
            },
            name: {
              type: 'string',
              description: "User's full name",
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: "User's email address",
              example: 'john.doe@example.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the user was created',
              example: '2025-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the user was last updated',
              example: '2025-01-01T12:30:00.000Z',
            },
          },
        },
        CreateUserDto: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: {
              type: 'string',
              description: "User's full name",
              example: 'Jane Smith',
            },
            email: {
              type: 'string',
              format: 'email',
              description: "User's email address (must be unique)",
              example: 'jane.smith@example.com',
            },
          },
        },
        UpdateUserDto: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: "User's full name (optional)",
              example: 'Jane Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: "User's email address (optional, must be unique)",
              example: 'jane.doe@example.com',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'User not found',
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-01T12:00:00.000Z',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/index.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Redeemer Recovery API Docs',
  }));

  // OpenAPI JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
