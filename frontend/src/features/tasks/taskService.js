import axios from 'axios';

const API_PROJECT_TASKS_URL = (projectId) => `/api/projects/${projectId}/tasks`;
const API_TASKS_URL = '/api/tasks/'; // URL base para crear, actualizar, eliminar tareas individuales

const getTasksByProject = async (projectId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_PROJECT_TASKS_URL(projectId), config);
    return response.data;
};

const createTask = async (taskData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_TASKS_URL, taskData, config);
    return response.data;
};

const updateTask = async (taskId, taskData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_TASKS_URL + taskId, taskData, config);
    return response.data;
};

const deleteTask = async (taskId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(API_TASKS_URL + taskId, config);
    return response.data;
};

const taskService = {
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask,
};

export default taskService;