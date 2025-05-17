const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

describe('Project API Endpoints', () => {
    let token;
    let userId;
    let testProjectId;

    const testUserCredentials = {
        name: 'Project Test User',
        email: 'projecttest@example.com',
        password: 'password123',
    };

    const projectData = {
        name: 'Test Project Alpha',
        description: 'Description for Alpha project',
    };

    beforeEach(async () => {
        const registerRes = await request(app).post('/api/users/register').send(testUserCredentials);
        userId = registerRes.body._id;

        const loginRes = await request(app)
            .post('/api/users/login')
            .send({email: testUserCredentials.email, password: testUserCredentials.password});
        token = loginRes.body.token;

        const projectCreationRes = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${token}`)
            .send(projectData);

        if (projectCreationRes.body && projectCreationRes.body._id) {
            testProjectId = projectCreationRes.body._id; // Corregido: usa projectCreationRes
        } else {
            console.error("CRITICAL TEST SETUP ERROR: Failed to create test project in beforeEach.", projectCreationRes.status, projectCreationRes.body);
        }
    });

    describe('POST /api/projects', () => {
        it('should create a new project for an authenticated user', async () => {
            const newProjectData = {name: 'Brand New Project XYZ', description: 'Fresh start XYZ'};
            const res = await request(app)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`)
                .send(newProjectData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.name).toBe(newProjectData.name);
            expect(res.body.user).toBe(userId);
        });

        it('should return 400 if name is missing', async () => {
            const res = await request(app)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`)
                .send({description: 'Project without name'});
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors[0].msg).toBe('The project name is mandatory.');
        });
    });

    describe('GET /api/projects', () => {
        it('should get all projects for the authenticated user', async () => {
            await request(app)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`)
                .send({name: 'Another Project for GET test'});


            const res = await request(app)
                .get('/api/projects')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
            expect(res.body.some(p => p._id === testProjectId)).toBe(true);
            res.body.forEach(project => {
                expect(project.user).toBe(userId);
            });
        });
    });

    describe('GET /api/projects/:id', () => {
        it('should get a specific project by ID', async () => {
            expect(testProjectId).toBeDefined();
            const res = await request(app)
                .get(`/api/projects/${testProjectId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body._id).toBe(testProjectId);
            expect(res.body.name).toBe(projectData.name);
        });

        it('should return 404 if project not found', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toHexString();
            const res = await request(app)
                .get(`/api/projects/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toBe('Project not found');
        });

        it('should return 400 if project ID is invalid', async () => {
            const invalidId = '123invalid';
            const res = await request(app)
                .get(`/api/projects/${invalidId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors[0].msg).toBe('Invalid project ID.');
        });
    });

    describe('PUT /api/projects/:id', () => {
        it('should update an existing project', async () => {
            expect(testProjectId).toBeDefined();
            const updatedData = {name: 'Updated Project Name Alpha', description: 'Updated desc Alpha'};
            const res = await request(app)
                .put(`/api/projects/${testProjectId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toBe(updatedData.name);
            expect(res.body.description).toBe(updatedData.description);
        });
    });

    describe('DELETE /api/projects/:id', () => {
        it('should delete a project and its associated tasks', async () => {
            expect(testProjectId).toBeDefined();
            await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({
                title: 'Task 1 for deletion test',
                projectId: testProjectId
            });
            await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({
                title: 'Task 2 for deletion test',
                projectId: testProjectId
            });

            let tasksRes = await request(app).get(`/api/projects/${testProjectId}/tasks`).set('Authorization', `Bearer ${token}`);
            expect(tasksRes.body.length).toBe(2);

            const deleteRes = await request(app)
                .delete(`/api/projects/${testProjectId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(deleteRes.statusCode).toEqual(200);
            expect(deleteRes.body.message).toBe('Project and task related deleted');

            const getProjectRes = await request(app).get(`/api/projects/${testProjectId}`).set('Authorization', `Bearer ${token}`);
            expect(getProjectRes.statusCode).toEqual(404);

            tasksRes = await request(app).get(`/api/projects/${testProjectId}/tasks`).set('Authorization', `Bearer ${token}`);
            expect(tasksRes.statusCode).toEqual(404);
            expect(tasksRes.body.message).toBe('Project not found or does not belong to the user');
        });
    });

    describe('GET /api/projects/:id/tasks', () => {
        it('should get all tasks for a specific project', async () => {
            expect(testProjectId).toBeDefined();
            await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({
                title: 'ProjectSpecificTask1 for ProjectAlpha',
                projectId: testProjectId
            });
            await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({
                title: 'ProjectSpecificTask2 for ProjectAlpha',
                projectId: testProjectId
            });

            const res = await request(app)
                .get(`/api/projects/${testProjectId}/tasks`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
            res.body.forEach(task => {
                expect(task.project).toBe(testProjectId);
                expect(task.user).toBe(userId);
            });
        });

        it('should return 404 if project for tasks not found', async () => {
            const nonExistentProjectId = new mongoose.Types.ObjectId().toHexString();
            const res = await request(app)
                .get(`/api/projects/${nonExistentProjectId}/tasks`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toBe('Project not found or does not belong to the user');
        });
    });
});