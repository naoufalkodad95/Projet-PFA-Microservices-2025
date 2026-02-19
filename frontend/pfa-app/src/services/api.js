// src/services/api.js
import axios from 'axios';

// Création d'une instance axios avec des configurations par défaut
const api = axios.create({
  // Utilisez l'URL de votre backend - à modifier selon votre configuration
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 secondes
});

// Intercepteur pour gérer les réponses et les erreurs
api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Gestion des erreurs
      console.error('API Error:', error.response?.data || error.message);

      // Vous pouvez ajouter ici une gestion globale des erreurs
      // comme afficher un toast ou rediriger vers une page d'erreur

      return Promise.reject(error);
    }
);

export default api;