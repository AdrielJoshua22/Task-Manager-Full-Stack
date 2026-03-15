import axios from 'axios';

const LOGIN_URL = 'https://task-manager-full-stack-production.up.railway.app/api/auth/login';

export const login = async (username, password) => {
  const response = await axios.post(LOGIN_URL, { username, password });
  return response.data;
};