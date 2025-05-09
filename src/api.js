const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://travelsnap-backend.onrender.com' 
  : 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
