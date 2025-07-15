import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/blackjack',
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken'); // <- angepasst
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
