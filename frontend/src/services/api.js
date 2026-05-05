import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Attach JWT token to requests if user is logged in
API.interceptors.request.use((req) => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
    }
  } catch (error) {
    console.error('Failed to parse userInfo', error);
  }
  return req;
});

export default API;