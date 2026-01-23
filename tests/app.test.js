import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/User.js';
import Todo from '../models/Todo.js';

// Set the environment to test to prevent the server from starting its own DB connection in server.js

process.env.NODE_ENV = 'test';

describe('Todo MVC Integration Tests', () => {
    
    // Setup: Connect to a dedicated test database
    beforeAll(async () => {
        const url = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/todo_test';
        // Use clear options to avoid connection warnings
        await mongoose.connect(url);
        // CRITICAL: Clear the users so 'testuser' is fresh
        await User.deleteMany({});
        await Todo.deleteMany({});
    });

    // Cleanup: Clear database after all tests are done
    afterAll(async () => {
        // 1. Delete all data created during tests
        await User.deleteMany({});
        await Todo.deleteMany({});
        
        // 2. Close the Mongoose connection
        await mongoose.connection.close();
        
        // 3. Explicitly stop the app's server if it's listening
        // Note: This helps if 'supertest' keeps a server instance open
        if (app.close) {
            await app.close();
        }
    });

    describe('Security & Authorization', () => {
        test('Should redirect unauthenticated user to login', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe('/login');
        });

        test('Should prevent access to API without session', async () => {
            const res = await request(app).get('/api/todos');
            expect(res.statusCode).toBe(302);
        });
    });

    describe('Authentication Flow', () => {
        const testUser = { username: 'testuser', password: 'password123' };

        test('Should register a new user successfully', async () => {
            const res = await request(app)
                .post('/register')
                .send(testUser);
            
            // Check for redirect to home
            expect(res.statusCode).toBe(302); 
            expect(res.headers.location).toBe('/');
        });

        test('Should hash the password in the database', async () => {
            const user = await User.findOne({ username: 'testuser' });
            expect(user).not.toBeNull();
            expect(user.password).not.toBe('password123');
            expect(user.password.length).toBeGreaterThan(30); 
        });
    });

    describe('Todo Logic', () => {
        let agent; // Maintaining session state across requests

        beforeAll(async () => {
            agent = request.agent(app);
            // Log in the user created in the previous test block
            await agent
                .post('/login')
                .send({ username: 'testuser', password: 'password123' });
        });

        test('Should create a new todo for the logged-in user', async () => {
            const res = await agent
                .post('/api/todos')
                .send({ text: 'Test My App' });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.text).toBe('Test My App');
            expect(res.body.status).toBe('pending');
        });

        test('Should fetch only the user\'s todos', async () => {
            const res = await agent.get('/api/todos');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].text).toBe('Test My App');
        });
    });
});