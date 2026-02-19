// src/services/defiService.js
import api from './api';

const defiService = {
  // Récupérer tous les défis
  getAllDefis: async () => {
    try {
      const response = await api.get('/defis');
      return response.data;
    } catch (error) {
      console.error('Error fetching defis:', error);
      throw error;
    }
  },

  // Récupérer un défi par son ID
  getDefiById: async (defiId) => {
    try {
      const response = await api.get(`/defis/${defiId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching defi details:', error);
      throw error;
    }
  },

  // Créer un nouveau défi
  createDefi: async (equipeInitiatriceId, defiData) => {
    try {
      const response = await api.post(`/defis/equipes/${equipeInitiatriceId}`, defiData);
      return response.data;
    } catch (error) {
      console.error('Error creating defi:', error);
      throw error;
    }
  },

  // Mettre à jour un défi
  updateDefi: async (defiId, defiData) => {
    try {
      const response = await api.put(`/defis/${defiId}`, defiData);
      return response.data;
    } catch (error) {
      console.error('Error updating defi:', error);
      throw error;
    }
  },

  // Supprimer un défi
  deleteDefi: async (defiId) => {
    try {
      await api.delete(`/defis/${defiId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting defi:', error);
      throw error;
    }
  },

  // Récupérer les défis envoyés par une équipe
  getDefisEnvoyes: async (equipeId) => {
    try {
      const response = await api.get(`/defis/equipes/${equipeId}/envoyes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sent defis:', error);
      throw error;
    }
  },

  // Récupérer les défis reçus par une équipe
  getDefisRecus: async (equipeId) => {
    try {
      const response = await api.get(`/defis/equipes/${equipeId}/recus`);
      return response.data;
    } catch (error) {
      console.error('Error fetching received defis:', error);
      throw error;
    }
  },

  // Accepter un défi
  accepterDefi: async (defiId) => {
    try {
      const response = await api.put(`/defis/${defiId}/accepter`);
      return response.data;
    } catch (error) {
      console.error('Error accepting defi:', error);
      throw error;
    }
  },

  // Refuser un défi
  refuserDefi: async (defiId) => {
    try {
      const response = await api.put(`/defis/${defiId}/refuser`);
      return response.data;
    } catch (error) {
      console.error('Error refusing defi:', error);
      throw error;
    }
  },

  // Annuler un défi
  annulerDefi: async (defiId) => {
    try {
      const response = await api.put(`/defis/${defiId}/annuler`);
      return response.data;
    } catch (error) {
      console.error('Error canceling defi:', error);
      throw error;
    }
  }
};

export default defiService;