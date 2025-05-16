const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

describe('Task API Endpoints', () => {
    let token;
    let userId;

    const testUserCredentials = {
        name: 'Task Test User',
        email: 'tasktest@example.com',
        password: 'password123',
    };

    beforeEach(async () => {
        const registerRes = await request(app)
            .post('/api/users/register')
            .send(testUserCredentials);
        userId = registerRes.body._id;

        const loginRes = await request(app)
            .post('/api/users/login')
            .send({email: testUserCredentials.email, password: testUserCredentials.password});
        token = loginRes.body.token;
    });

    describe('POST /api/tasks', () => {
        it('should create a new task for an authenticated user', async () => {
            const taskData = {
                title: 'Test Task Title',
                description: 'Test task description',
            };

            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send(taskData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.title).toBe(taskData.title);
            expect(res.body.user).toBe(userId);
            expect(res.body.status).toBe('pending');
        });

        it('should return 400 if title is missing', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({description: 'Task without title'});

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Title for task is mandatory');
        });

        it('should return 401 if no token is provided', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .send({title: 'A task title'});

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toBe('No authorization, token not found or invalid format');
        });
    });

    describe('GET /api/tasks', () => {
        it('should get all tasks for an authenticated user', async () => {
            await request(app)
                .post('/api/tasks').set('Authorization', `Bearer ${token}`)
                .send({title: 'Task 1 for GET', user: userId});
            await request(app)
                .post('/api/tasks').set('Authorization', `Bearer ${token}`)
                .send({title: 'Task 2 for GET', user: userId});

            const res = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
            res.body.forEach(task => {
                expect(task.user).toBe(userId);
            });
        });
    });

    describe('Operations on a specific task (/api/tasks/:id)', () => {
        let existingTask;

        beforeEach(async () => {
            const taskCreationResponse = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({title: 'Task for single operations', description: 'Initial Description', user: userId});
            existingTask = taskCreationResponse.body;
        });

        it('GET /:id - should get a specific task by ID', async () => {
            const res = await request(app)
                .get(`/api/tasks/${existingTask._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body._id).toBe(existingTask._id);
            expect(res.body.title).toBe(existingTask.title);
        });

        it('GET /:id - should return 404 if task not found', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toHexString();
            const res = await request(app)
                .get(`/api/tasks/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toBe('Task not found');
        });

        it('GET /:id - should return 400 if ID is invalid', async () => {
            const invalidId = '123';
            const res = await request(app)
                .get(`/api/tasks/${invalidId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Invalid ID');
        });

        it('PUT /:id - should update a task successfully', async () => {
            const updatedData = {
                title: 'Updated Task Title by PUT',
                status: 'completed',
            };
            const res = await request(app)
                .put(`/api/tasks/${existingTask._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);

            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe(updatedData.title);
            expect(res.body.status).toBe(updatedData.status);
            expect(res.body.description).toBe(existingTask.description);
        });

        it('PUT /:id - should return 404 if task to update not found', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toHexString();
            const res = await request(app)
                .put(`/api/tasks/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({title: 'Update for non-existent'});
            expect(res.statusCode).toEqual(404);
        });

        it('DELETE /:id - should delete a task successfully', async () => {
            const res = await request(app)
                .delete(`/api/tasks/${existingTask._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('Task deleted successfully');
            expect(res.body.id).toBe(existingTask._id);

            const getRes = await request(app)
                .get(`/api/tasks/${existingTask._id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(getRes.statusCode).toEqual(404);
        });

        it('DELETE /:id - should return 404 if task to delete not found', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toHexString();
            const res = await request(app)
                .delete(`/api/tasks/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(404);
        });
    });
});