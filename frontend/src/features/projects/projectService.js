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

const projectService = {
    createProject,
    getProjects,
};

export default projectService;