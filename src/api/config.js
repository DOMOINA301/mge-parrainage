// Configuration API
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://mge-backend-1.onrender.com/api'
  : 'http://localhost:5000/api';

export default API_URL;