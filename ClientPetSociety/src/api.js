// ClientPetSociety/src/api.js

import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // Si el error es 401 (Unauthorized) y no es una petición que ya intentamos refrescar
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marcar la petición como reintentada
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        // Intentar obtener un nuevo access token usando el refresh token
        const response = await axios.post("/api/token/refresh/", { refresh: refreshToken });
        const { access } = response.data;
        // Guardar el nuevo access token
        localStorage.setItem(ACCESS_TOKEN, access);
        // Actualizar el token en la configuración por defecto de Axios y en la petición original
        api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        // Reintentar la petición original con el nuevo token
        return api(originalRequest);
      } catch (refreshError) {
        // Si el refresh token también falla (expirado o inválido), desloguear al usuario
        console.error("Refresh token failed", refreshError);
        // Aquí podrías llamar a una función de logout global si la tuvieras
        // logout();
        window.location.href = "/login"; // Redirigir al login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
