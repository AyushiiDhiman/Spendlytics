import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
};

export const expenseAPI = {
  list: () => api.get("/expenses"),
  add: (data) => api.post("/expenses", data),
  remove: (id) => api.delete(`/expenses/${id}`),
  summary: () => api.get("/expenses/summary"),
};

export const aiAPI = {
  categorize: (data) => api.post("/ai/categorize", data),
  insights: () => api.get("/ai/insights"),
};

export default api;
