import axios from 'axios';


const REACT_APP_API_URL = 'https://keshermanager.onrender.com'; // Adjust this to match your Spring Boot server

console.log('API Base URL:', REACT_APP_API_URL);

// Create an axios instance with default config
const api = axios.create({
  baseURL: REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add interceptors for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
