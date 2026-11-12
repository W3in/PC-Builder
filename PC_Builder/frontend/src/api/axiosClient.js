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

// A rejected token (expired, or signed by another server) means the saved login is stale:
// clear it and send the user to sign in again instead of failing with a cryptic alert.
axiosClient.interceptors.response.use((response) => response, (error) => {
    const sentToken = Boolean(error.config?.headers?.Authorization);
    const isPasswordCheck = error.config?.url?.includes('profile/password');
    if (error.response?.status === 401 && sentToken && !isPasswordCheck) {
        localStorage.removeItem('pc_user');
        if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(error);
});

export default axiosClient;