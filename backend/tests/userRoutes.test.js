const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('User API endpoints', () => {
    describe('POST /api/users/register', () => {
        it('should register a new user succesfully', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.name).toBe('Test User');
            expect(res.body.email).toBe('test@example.com');

            const userInDb = await User.findOne({email: 'test@example.com'});
            expect(userInDb).not.toBeNull();
            expect(userInDb.name).toBe('Test User');
        });

        it('should return 400 if user already exists', async () => {
            await request(app)
                .post('/api/users/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            const res = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('User already exists');
        });

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'Test User Only Name',
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('errors');
            expect(Array.isArray(res.body.errors)).toBe(true);
        });
    });

    describe('POST /api/users/login', () => {
        const userData = {
            name: 'Login User',
            email: 'login@example.com',
            password: 'password123',
        };

        it('should login an existing user successfully', async () => {
            await request(app).post('/api/users/register').send(userData);

            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: userData.email,
                    password: userData.password,
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.email).toBe(userData.email);
            expect(res.body.name).toBe(userData.name);
            expect(res.body.message).toBe('User login successfull');
        });

        it('should return 401 for invalid email', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'wrong@example.com',
                    password: userData.password,
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toBe('Invalid email or password');
        });

        it('should return 401 for invalid password', async () => {
            await request(app).post('/api/users/register').send(userData).catch(() => {
            });

            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: userData.email,
                    password: 'wrongpassword',
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toBe('Invalid email or password');
        });

        it('should return 400 if email or password are not provided', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: '',
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('errors');
            expect(Array.isArray(res.body.errors)).toBe(true);

            const emailError = res.body.errors.find(err => err.path === 'email');
            expect(emailError).toBeDefined();
            expect(emailError.msg).toBe('The email is mandatory');

            const passwordError = res.body.errors.find(err => err.path === 'password');
            expect(passwordError).toBeDefined();
            expect(passwordError.msg).toBe('The password is mandatory');
        });
    });
})

