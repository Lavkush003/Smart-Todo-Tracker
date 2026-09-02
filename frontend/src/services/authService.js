import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const authApi = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
});

export const loginUser = async (email, password) => {
  const response = await authApi.post('/login', { email, password });
  return response.data;
};

export const signupUser = async (name, email, password) => {
  const response = await authApi.post('/signup', { name, email, password });
  return response.data;
};
