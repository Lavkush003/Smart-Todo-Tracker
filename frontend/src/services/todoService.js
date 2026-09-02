import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTodos = async (params = {}) => {
  const response = await api.get('/todos', { params });
  return response.data;
};

export const fetchTodoById = async (id) => {
  const response = await api.get(`/todos/${id}`);
  return response.data;
};

export const createTodo = async (payload) => {
  const response = await api.post('/todos', payload);
  return response.data;
};

export const updateTodo = async (id, payload) => {
  const response = await api.put(`/todos/${id}`, payload);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};

export const fetchStats = async () => {
  const response = await api.get('/todos/stats');
  return response.data;
};

export const fetchTodayTodos = async () => {
  const response = await api.get('/todos/today');
  return response.data;
};

export const fetchOverdueTodos = async () => {
  const response = await api.get('/todos/overdue');
  return response.data;
};

export const sendChatMessage = async (message) => {
  const response = await api.post('/chat', { message });
  return response.data;
};
