import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../api';
import User from '../../models/user.model';
import jwt from 'jsonwebtoken';

let mongoServer: MongoMemoryServer;
let token: string;
let userId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create a test user
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  });
  userId = (user as any)._id.toString();

  // Generate a token
  token = jwt.sign({ userId: userId, username: user.username }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '1h',
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Flashcard API', () => {
    let flashcardId: string;

    it('should create a new flashcard for the authenticated user', async () => {
        const res = await request(app)
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
        const res = await request(app)
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
        const res = await request(app)
            .get('/api/flashcards')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
    });

    it('should get a specific flashcard by ID', async () => {
        const res = await request(app)
            .get(`/api/flashcards/${flashcardId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', flashcardId);
    });

    it('should update a flashcard', async () => {
        const res = await request(app)
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
        const res = await request(app)
            .delete(`/api/flashcards/${flashcardId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Flashcard deleted successfully');
    });

    it('should not find a deleted flashcard', async () => {
        const res = await request(app)
            .get(`/api/flashcards/${flashcardId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(404);
    });
}); 