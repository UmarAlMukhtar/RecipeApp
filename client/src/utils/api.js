import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_API_URL || "https://your-backend-url.com/api"
    : "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to false for simpler CORS handling
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
