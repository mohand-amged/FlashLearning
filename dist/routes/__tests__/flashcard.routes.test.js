"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../../app"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let mongoServer;
let token;
let userId;
beforeAll(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose_1.default.connect(mongoUri);
    // Create a test user
    const user = await user_model_1.default.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
    });
    userId = user._id.toString();
    // Generate a token
    token = jsonwebtoken_1.default.sign({ userId: userId, username: user.username }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '1h',
    });
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
describe('Flashcard API', () => {
    let flashcardId;
    it('should create a new flashcard for the authenticated user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/flashcards')
            .set('Authorization', `Bearer ${token}`)
            .send({
            front: 'What is the capital of France?',
            back: 'Paris',
            subject: 'Geography'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('front', 'What is the capital of France?');
        flashcardId = res.body._id;
    });
    it('should not create a flashcard with invalid data', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/flashcards')
            .set('Authorization', `Bearer ${token}`)
            .send({
            front: '', // Invalid
            back: 'Paris',
            subject: 'Geography'
        });
        expect(res.statusCode).toEqual(400);
    });
    it('should get all flashcards for the authenticated user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/flashcards')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
    });
    it('should get a specific flashcard by ID', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get(`/api/flashcards/${flashcardId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', flashcardId);
    });
    it('should update a flashcard', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/flashcards/${flashcardId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
            front: 'Updated Question',
            back: 'Updated Answer',
            subject: 'Updated Subject'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('front', 'Updated Question');
    });
    it('should delete a flashcard', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/flashcards/${flashcardId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Flashcard deleted successfully');
    });
    it('should not find a deleted flashcard', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get(`/api/flashcards/${flashcardId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(404);
    });
});
