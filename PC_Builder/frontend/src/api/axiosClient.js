import axios from 'axios';

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
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