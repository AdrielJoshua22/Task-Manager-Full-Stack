import axios from 'axios';

const AUTH_URL = 'https://task-manager-full-stack-production.up.railway.app/api/auth';

export const login = async (username, password) => {
  const response = await axios.post(`${AUTH_URL}/login`, { username, password });
  return response.data;
};