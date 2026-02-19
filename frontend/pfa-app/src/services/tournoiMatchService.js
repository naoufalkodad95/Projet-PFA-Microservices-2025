// src/services/matchService.js
import axios from 'axios';

// URL de base de l'API
const API_URL = 'https://localhost:7112/api';

// Créer une instance axios avec des en-têtes par défaut
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Service pour les matches
const matchService = {
  // Récupérer tous les matches
  getAll: async () => {
    try {
      console.log('Appel API - Récupération de tous les matches');
      const response = await api.get('/Matches');
      console.log('Réponse API - Matches:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des matches:', error);
      throw error;
    }
  },

  // Récupérer un match par son ID
  getById: async (id) => {
    try {
      console.log(`Appel API - Récupération du match ${id}`);
      const response = await api.get(`/Matches/${id}`);
      console.log('Réponse API - Match:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du match ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les matches d'un tournoi
  getByTournoiId: async (tournoiId) => {
    try {
      console.log(`Appel API - Récupération des matches du tournoi ${tournoiId}`);
      const response = await api.get(`/Tournois/${tournoiId}/Matches`);
      console.log('Réponse API - Matches du tournoi:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des matches du tournoi ${tournoiId}:`, error);
      throw error;
    }
  },

  // Créer un nouveau match
  create: async (match) => {
    try {
      const matchData = {
        date: match.date,
        scoreEquipe1: match.scoreEquipe1,
        scoreEquipe2: match.scoreEquipe2,
        statut: match.statut,
        iD_Tournoi: match.iD_Tournoi,
        iD_Equipe1: match.iD_Equipe1,
        iD_Equipe2: match.iD_Equipe2
      };
      
      console.log('Appel API - Création d\'un match avec données:', matchData);
      const response = await api.post('/Matches', matchData);
      console.log('Réponse API - Match créé:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du match:', error);
      throw error;
    }
  },

  // Mettre à jour un match
  update: async (id, match) => {
    try {
      const matchData = {
        iD_Match: parseInt(id),
        date: match.date,
        scoreEquipe1: match.scoreEquipe1,
        scoreEquipe2: match.scoreEquipe2,
        statut: match.statut,
        iD_Tournoi: match.iD_Tournoi,
        iD_Equipe1: match.iD_Equipe1,
        iD_Equipe2: match.iD_Equipe2
      };
      
      console.log(`Appel API - Mise à jour du match ${id} avec données:`, matchData);
      const response = await api.put(`/Matches/${id}`, matchData);
      console.log('Réponse API - Match mis à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du match ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un match
  delete: async (id) => {
    try {
      console.log(`Appel API - Suppression du match ${id}`);
      const response = await api.delete(`/Matches/${id}`);
      console.log('Réponse API - Match supprimé:', response.status);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du match ${id}:`, error);
      throw error;
    }
  }
};

export default matchService;