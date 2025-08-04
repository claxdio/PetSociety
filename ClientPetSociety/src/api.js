import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // Añade esto si usas Django DRF
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Si el error es 401 y no es una solicitud de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, { 
                    refresh: refreshToken 
                });
                
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Si el refresh falla, redirige a login
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;