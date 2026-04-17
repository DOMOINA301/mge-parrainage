import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mge-backend-1.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;