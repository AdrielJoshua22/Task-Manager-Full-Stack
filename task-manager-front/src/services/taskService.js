import axios from 'axios';

const isLocal = window.location.hostname === 'localhost';
const API_BASE_URL = isLocal
  ? 'http://localhost:8080/api'
  : 'https://task-manager-full-stack-production.up.railway.app/api';

const taskClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getTasksByUser = async (username) => {
  const response = await taskClient.get(`/tasks/user/${username}`);
  return response.data;
};

export const createTask = async (username, taskData) => {
  const response = await taskClient.post(`/tasks/${username}`, taskData);
  return response.data;
};