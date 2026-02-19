// src/axiosInstance.js
import axios from 'axios';

const token = localStorage.getItem('authToken');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
