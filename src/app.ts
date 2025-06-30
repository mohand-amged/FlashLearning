import express, { Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.route';
import flashcardRoutes from './routes/flashcard.routes';
import subjectRoutes from './routes/subject.routes';
import { errorHandler } from './Middlewares/errorMiddleware';

const app = express();
app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'FlashLearn API',
      version: '1.0.0',
      description: 'API for a flashcard learning application',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      schemas: {
        Flashcard: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the flashcard',
              example: '60c72b2f9b1d8c001f8e4c8b'
            },
            front: {
              type: 'string',
              description: 'The front content of the flashcard',
              example: 'What is the capital of France?'
            },
            back: {
              type: 'string',
              description: 'The back content of the flashcard',
              example: 'Paris'
            },
            subject: {
              type: 'string',
              description: 'The subject of the flashcard',
              example: 'Geography'
            },
            owner: {
              type: 'string',
              description: 'The user ID of the flashcard owner',
              example: '60c72b2f9b1d8c001f8e4c8a'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the flashcard was created',
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Auth Routes 
app.use('/api/auth', authRoutes);

// Subject Routes
app.use('/api/subjects', subjectRoutes);

// Flashcard Routes
app.use('/api/flashcards', flashcardRoutes)

// Error handling middleware (global)
app.use(errorHandler)

export default app;