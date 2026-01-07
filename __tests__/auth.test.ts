import request from 'supertest';
import express from 'express';
import { AuthController } from '../src/controllers/auth.controller';
import { AuthService } from '../src/services/auth.service';

const app = express();
app.use(express.json());

const authService = new AuthService();
const authController = new AuthController(authService);
app.use('/api/auth', authController.buildRouter());

describe('Auth Routes', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new super admin', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: `admin-${Date.now()}@test.com`,
                    password: 'Admin123!',
                    firstName: 'Super',
                    lastName: 'Admin',
                    role: 'super_admin'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.role).toBe('super_admin');
            expect(response.body.user).not.toHaveProperty('password');
        });

        it('should register a new gym owner', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: `owner-${Date.now()}@test.com`,
                    password: 'Owner123!',
                    firstName: 'John',
                    lastName: 'Owner',
                    role: 'gym_owner'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body.user.role).toBe('gym_owner');
        });

        it('should fail with invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'Test123!',
                    firstName: 'Test',
                    lastName: 'User',
                    role: 'client'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with short password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: `test-${Date.now()}@test.com`,
                    password: '123',
                    firstName: 'Test',
                    lastName: 'User',
                    role: 'client'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /api/auth/login', () => {
        const testUser = {
            email: `login-test-${Date.now()}@test.com`,
            password: 'Test123!',
            firstName: 'Login',
            lastName: 'Test',
            role: 'super_admin' as const
        };

        beforeAll(async () => {
            await request(app)
                .post('/api/auth/register')
                .send(testUser);
        });

        it('should login with correct credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.email).toBe(testUser.email);
        });

        it('should fail with wrong password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'WrongPassword123!'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with non-existent email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@test.com',
                    password: 'Test123!'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });
    });
});
