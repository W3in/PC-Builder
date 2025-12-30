import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000/api',
});

axiosClient.interceptors.request.use((config) => {
    const storedData = localStorage.getItem('pc_user');

    if (storedData && storedData !== "undefined") {
        const userData = JSON.parse(storedData);
        if (userData && userData.token) {
            config.headers.Authorization = `Bearer ${userData.token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export default axiosClient;