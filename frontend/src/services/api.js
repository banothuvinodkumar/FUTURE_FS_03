import axios from "axios";

const API = axios.create({
  // Use VITE_API_URL for production (set in Vercel), fallback to localhost for development
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// ✅ FIXED TOKEN HANDLING
API.interceptors.request.use((req) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userInfo?.token) {
    req.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return req;
});

export default API;
