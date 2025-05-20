import axios from 'axios';

const API_URL = '/api/users/';

const register = async (userData) => {
    const response = await axios.post(API_URL + 'register', userData);

    if (response.data && response.data.token) {
        localStorage.setItem('userToken', JSON.stringify(response.data.token));
    }

    return response.data;
}

const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);

    if (response.data && response.data.token) {
        localStorage.setItem('userToken', JSON.stringify(response.data.token));
    }

    return response.data;
}

const logout = () => {
    localStorage.removeItem('userToken');
}

const authService = {
    register,
    login,
    logout,
}

export default authService;