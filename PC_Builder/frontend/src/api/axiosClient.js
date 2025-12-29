import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000/api',
});

axiosClient.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default axiosClient;