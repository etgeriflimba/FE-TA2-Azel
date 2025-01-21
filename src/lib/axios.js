import axios from "axios";

const getApiToken = () => {
  // Check for tokens in localStorage
  const userToken = localStorage.getItem("api_token_user");
  const adminToken = localStorage.getItem("api_token_admin");

  // Prioritize admin token if both exist, otherwise use user token
  return adminToken || userToken || null;
};

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
});

// Add a request interceptor to dynamically set the Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = getApiToken();

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete config.headers['Authorization']; // Remove Authorization header if no token
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
