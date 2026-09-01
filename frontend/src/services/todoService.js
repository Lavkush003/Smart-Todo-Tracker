import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
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

export const parseTaskWithAI = async (text) => {
  const response = await api.post('/ai/parse-task', { text });
  return response.data;
};

export const getInsightWithAI = async () => {
  const response = await api.get('/ai/insight');
  return response.data;
};

export const generateSubtasksWithAI = async (id) => {
  const response = await api.post(`/ai/${id}/subtasks`);
  return response.data;
};
