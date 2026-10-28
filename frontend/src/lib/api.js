// src/lib/api.js
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Endpoints where 401 means "wrong password" — NOT "session expired".
const NO_LOGOUT_ON_401 = [
  "/auth/login",
  "/auth/register",
  "/users/me/password",
];

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || "";

    const shouldLogout =
      status === 401 &&
      !NO_LOGOUT_ON_401.some((path) => url.includes(path));

    if (shouldLogout) {
      useAuthStore.getState().logout();
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(err);
  }
);

export default api;