const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

describe('Task API Endpoints', () => {
    let token;
    let userId;
    let defaultProjectId;

    const testUserCredentials = {
        name: 'Task Test User',
        email: 'tasktest@example.com',
        password: 'password123',
    };

    beforeEach(async () => {
        const registerRes = await request(app).post('/api/users/register').send(testUserCredentials);
        userId = registerRes.body._id;
        const loginRes = await request(app).post('/api/users/login').send({
            email: testUserCredentials.email,
            password: testUserCredentials.password
        });
        token = loginRes.body.token;

        const projectRes = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${token}`)
            .send({name: 'Default Test Project for Tasks'});

        if (projectRes.body && projectRes.body._id) {
            defaultProjectId = projectRes.body._id;
        } else {
            throw new Error("Default project creation failed in taskRoutes.test.js beforeEach, tests cannot continue reliably.");
        }
    });

    describe('POST /api/tasks', () => {
        it('should create a new task for an authenticated user and a valid project', async () => {
            const taskData = {
                title: 'Test Task Title',
                description: 'Test task description',
                projectId: defaultProjectId,
            };
            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send(taskData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.title).toBe(taskData.title);
            expect(res.body.user).toBe(userId);
            expect(res.body.project).toBe(defaultProjectId);
            expect(res.body.status).toBe('pending');
        });

        it('should return 400 if projectId is missing', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({title: 'Task without project'});
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors.some(e => e.path === 'projectId' && e.msg === 'Project ID is mandatory.')).toBe(true);
        });

        it('should return 400 if title is missing', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({description: 'Task without title', projectId: defaultProjectId});
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors.some(e => e.path === 'title' && e.msg === 'Title is mandatory.')).toBe(true);
        });

        it('should return 401 if no token is provided', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .send({title: 'A task title', projectId: defaultProjectId});
            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toBe('No authorization, token not found or invalid format');
        });
    });

    describe('GET /api/tasks', () => {
        beforeEach(async () => {
            if (!defaultProjectId) throw new Error("Default Project ID not set for GET /api/tasks tests");
            await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({
                title: 'Task P1',
                projectId: defaultProjectId
            });
            await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({
                title: 'Task P2',
                projectId: defaultProjectId
            });
        });

        it('should get all tasks for an authenticated user with default pagination', async () => {
            const res = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('tasks');
            expect(Array.isArray(res.body.tasks)).toBe(true);
            expect(res.body.currentPage).toBe(1);
            expect(res.body.tasks.length).toBeGreaterThanOrEqual(2);
            res.body.tasks.forEach(task => {
                expect(task.user).toBe(userId);
            });
        });

        it('should get tasks with specific pagination parameters', async () => {
            for (let i = 3; i <= 7; i++) {
                await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({
                    title: `Task Pag ${i}`,
                    projectId: defaultProjectId
                });
            }
            const limit = 3;
            const page = 2;
            const res = await request(app)
                .get(`/api/tasks?page=${page}&limit=${limit}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.tasks.length).toBe(limit);
            expect(res.body.currentPage).toBe(page);
            const totalCreatedTasks = 2 + 5;
            expect(res.body.totalPages).toBe(Math.ceil(totalCreatedTasks / limit));
            expect(res.body.totalTasks).toBe(totalCreatedTasks);
        });
    });

    describe('Operations on a specific task (/api/tasks/:id)', () => {
        let existingTask;
        beforeEach(async () => {
            if (!defaultProjectId) throw new Error("Default Project ID not set for single task operations tests");
            const taskCreationResponse = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({title: 'Task for single ops', description: 'Initial Desc', projectId: defaultProjectId});
            existingTask = taskCreationResponse.body;
            expect(existingTask && existingTask._id).toBeDefined();
        });

        it('GET /:id - should get a specific task by ID', async () => {
            const res = await request(app)
                .get(`/api/tasks/${existingTask._id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body._id).toBe(existingTask._id);
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
            expect(res.body.errors.some(e => e.path === 'id' && e.msg === 'Invalid task ID.')).toBe(true);
        });

        it('PUT /:id - should return 404 if task to update not found', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toHexString();
            const res = await request(app)
                .put(`/api/tasks/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({title: 'Update for non-existent', projectId: defaultProjectId}); // Necesita projectId válido
            expect(res.statusCode).toEqual(404);
        });

        it('DELETE /:id - should delete a task successfully', async () => {
            const res = await request(app)
                .delete(`/api/tasks/${existingTask._id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('Task deleted successfully');
            const getRes = await request(app).get(`/api/tasks/${existingTask._id}`).set('Authorization', `Bearer ${token}`);
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