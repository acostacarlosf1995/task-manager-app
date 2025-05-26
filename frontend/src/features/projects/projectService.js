import axios from 'axios';

const API_URL = '/api/projects/';

const createProject = async (projectData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, projectData, config);
    return response.data;
};

const getProjects = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const updateProject = async (projectId, projectData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + projectId, projectData, config);
    return response.data;
};

const deleteProject = async (projectId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(API_URL + projectId, config);
    return response.data;
};


const projectService = {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
};

export default projectService;