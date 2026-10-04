import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err.code, err.message, err.config?.baseURL, err.config?.url);

    const url = err.config?.url || "";
    const isAuthCall = url.includes("/auth/login") || url.includes("/auth/register");
    if (err.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const getErrorMessage = (err, fallback = "Something went wrong") => {
  if (!err.response) return "Cannot reach the API. Is the backend running?";
  const d = err.response.data;
  return d?.message || d?.error || fallback;
};

export default api;