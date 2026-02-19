// src/services/tournoiService.js - Mise à jour pour inclure le prix
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

// Service pour les tournois
const tournoiService = {
  // Récupérer tous les tournois
  getAll: async () => {
    try {
      console.log('Appel API - Récupération de tous les tournois');
      const response = await api.get('/Tournois');
      console.log('Réponse API - Tournois:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tournois:', error);
      throw error;
    }
  },

  // Récupérer un tournoi par son ID
  getById: async (id) => {
    try {
      console.log(`Appel API - Récupération du tournoi ${id}`);
      const response = await api.get(`/Tournois/${id}`);
      console.log('Réponse API - Tournoi:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du tournoi ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau tournoi
  create: async (tournoi) => {
    try {
      // S'assurer que les noms de propriétés sont corrects pour l'API
      const tournoiData = {
        nom: tournoi.nom,
        dateDebut: tournoi.dateDebut,
        dateFin: tournoi.dateFin,
        nbEquipesMax: tournoi.nbEquipesMax,
        statut: tournoi.statut,
        reglement: tournoi.reglement,
        prix: tournoi.prix // Ajout du champ prix
      };
      
      console.log('Appel API - Création de tournoi avec données:', tournoiData);
      const response = await api.post('/Tournois', tournoiData);
      console.log('Réponse API - Tournoi créé:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du tournoi:', error);
      throw error;
    }
  },

  // Mettre à jour un tournoi
  update: async (id, tournoi) => {
    try {
      // S'assurer que les noms de propriétés sont corrects pour l'API
      const tournoiData = {
        iD_Tournoi: parseInt(id),  // Utiliser la même casse que dans l'API
        nom: tournoi.nom,
        dateDebut: tournoi.dateDebut,
        dateFin: tournoi.dateFin,
        nbEquipesMax: tournoi.nbEquipesMax,
        statut: tournoi.statut,
        reglement: tournoi.reglement,
        prix: tournoi.prix // Ajout du champ prix
      };
      
      console.log(`Appel API - Mise à jour du tournoi ${id} avec données:`, tournoiData);
      const response = await api.put(`/Tournois/${id}`, tournoiData);
      console.log('Réponse API - Tournoi mis à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du tournoi ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un tournoi
  delete: async (id) => {
    try {
      console.log(`Appel API - Suppression du tournoi ${id}`);
      const response = await api.delete(`/Tournois/${id}`);
      console.log('Réponse API - Tournoi supprimé:', response.status);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du tournoi ${id}:`, error);
      throw error;
    }
  }
};

export default tournoiService;