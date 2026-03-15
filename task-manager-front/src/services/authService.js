import axios from 'axios';

export const login = async (username, password) => {
  const response = await axios({
    method: 'post',
    url: 'https://task-manager-full-stack-production.up.railway.app/api/auth/login',
    data: {
      username: username,
      password: password
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};