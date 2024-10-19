import axios from "axios";
import { BASE_URL } from "./config";

const API = axios.create({ baseURL: `${BASE_URL}api/auth` });

// Attach access token to headers if present, excluding the refresh token request
API.interceptors.request.use(config => {
    const token = localStorage.getItem("accessToken");
    if (token && config.url !== "/token") {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global error handler for 401 errors (unauthorized)
API.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            // Attempt to refresh token
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const { data } = await API.post("/token", {
                        token: refreshToken
                    });
                    localStorage.setItem("accessToken", data.accessToken);
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return API(originalRequest); // Retry original request with new token
                } catch (err) {
                    console.error("Token refresh failed", err);
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login"; // Redirect to login if refresh fails
                }
            } else {
                // No refresh token or refresh failed
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login"; // Redirect to login
            }
        }

        return Promise.reject(error);
    }
);

// export const register = data => API.post("/register", data);
export const login = data => {
    const proccessLogin = API.post("/login", data);
    return proccessLogin;
};
export const refreshToken = data => API.post("/token", data);
