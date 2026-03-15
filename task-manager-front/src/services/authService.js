import axios from 'axios';

// La URL base de tu API de autenticación en Railway
const API_URL = 'https://task-manager-full-stack-production.up.railway.app/api/auth';

export const login = async (username, password) => {
  // Aquí es donde se le suma el /login final
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};