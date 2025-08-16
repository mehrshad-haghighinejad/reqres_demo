import axios from "axios";

const api = axios.create({
  baseURL: "https://reqres.in",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "reqres-free-v1",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (email, password) =>
  api.post("/api/login", { email, password });

// Users
export const getUsers = (page = 1) => api.get(`/api/users?page=${page}`);
export const getUser = (id) => api.get(`/api/users/${id}`);
export const createUser = (payload) => api.post("/api/users", payload);
export const updateUser = (id, payload) => api.put(`/api/users/${id}`, payload);
export const deleteUser = (id) => api.delete(`/api/users/${id}`);

export default api;
