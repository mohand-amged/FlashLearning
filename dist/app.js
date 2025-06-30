"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const flashcard_routes_1 = __importDefault(require("./routes/flashcard.routes"));
const subject_routes_1 = __importDefault(require("./routes/subject.routes"));
const errorMiddleware_1 = require("./Middlewares/errorMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Serve Swagger API documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Hello World Route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to FlashLearn API' });
});
// Auth Routes 
app.use('/api/auth', auth_route_1.default);
// Subject Routes
app.use('/api/subjects', subject_routes_1.default);
// Flashcard Routes
app.use('/api/flashcards', flashcard_routes_1.default);
// Error handling middleware (global)
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
