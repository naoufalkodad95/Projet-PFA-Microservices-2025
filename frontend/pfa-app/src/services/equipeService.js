import axios from 'axios';

const API_URL = 'https://localhost:7112/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const equipeService = {
  getAll: async () => {
    try {
      console.log('Appel API - Récupération de toutes les équipes');
      const response = await api.get('/Equipes');
      console.log('Réponse API - Équipes:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      console.log(`Appel API - Récupération de l'équipe ${id}`);
      const response = await api.get(`/Equipes/${id}`);
      console.log('Réponse API - Équipe:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'équipe ${id}:`, error);
      throw error;
    }
  },

  create: async (equipe) => {
    try {
      const equipeData = {
        nom: equipe.nom,
        dateCreation: equipe.dateCreation,
        logoBase64: equipe.logoBase64,
        nombreJoueurs: equipe.nombreJoueurs || 11,
        capitaine: equipe.capitaine || ''
      };

      console.log('Appel API - Création d\'équipe avec données:', equipeData);
      const response = await api.post('/Equipes', equipeData);
      console.log('Réponse API - Équipe créée:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'équipe:', error);
      throw error;
    }
  },

  update: async (id, equipe) => {
    try {
      const equipeData = {
        iD_Equipe: parseInt(id),
        nom: equipe.nom,
        dateCreation: equipe.dateCreation,
        logoBase64: equipe.logoBase64,
        nombreJoueurs: equipe.nombreJoueurs || 11,
        capitaine: equipe.capitaine || ''
      };

      console.log(`Appel API - Mise à jour de l'équipe ${id} avec données:`, equipeData);
      const response = await api.put(`/Equipes/${id}`, equipeData);
      console.log('Réponse API - Équipe mise à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'équipe ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log(`Vérification avant suppression de l'équipe ${id}`);

      try {
        const tournois = await equipeService.getTournoisByEquipeId(id);
        if (tournois && tournois.length > 0) {
          throw new Error('Cette équipe participe à un ou plusieurs tournois et ne peut pas être supprimée');
        }
      } catch (checkError) {
        if (checkError.message && checkError.message.includes('participe à un ou plusieurs tournois')) {
          throw checkError;
        }
        console.log("Impossible de vérifier les tournois de l'équipe, on continue la suppression");
      }

      const response = await api.delete(`/Equipes/${id}`);
      console.log('Réponse API - Équipe supprimée:', response.status);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'équipe ${id}:`, error);
      throw error;
    }
  },

  getTournoisByEquipeId: async (equipeId) => {
    try {
      console.log(`Appel API - Récupération des tournois de l'équipe ${equipeId}`);
      const response = await api.get(`/Equipes/${equipeId}/Tournois`);
      console.log('Réponse API - Tournois de l\'équipe:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des tournois de l'équipe ${equipeId}:`, error);
      throw error;
    }
  },

  getEquipesByTournoiId: async (tournoiId) => {
    try {
      console.log(`Appel API - Récupération des équipes du tournoi ${tournoiId}`);
      const response = await api.get(`/Tournois/${tournoiId}/Equipes`);
      console.log('Réponse API - Équipes du tournoi:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des équipes du tournoi ${tournoiId}:`, error);
      throw error;
    }
  },

  addEquipeToTournoi: async (equipeId, tournoiId) => {
    try {
      console.log(`Appel API - Ajout de l'équipe ${equipeId} au tournoi ${tournoiId}`);
      const response = await api.post(`/Equipes/${equipeId}/Tournois/${tournoiId}`);
      console.log('Réponse API - Équipe ajoutée au tournoi:', response.status);
      return true;
    } catch (error) {
      console.error(`Erreur lors de l'ajout de l'équipe ${equipeId} au tournoi ${tournoiId}:`, error);
      throw error;
    }
  },

  removeEquipeFromTournoi: async (equipeId, tournoiId) => {
    try {
      console.log(`Appel API - Retrait de l'équipe ${equipeId} du tournoi ${tournoiId}`);
      const response = await api.delete(`/Equipes/${equipeId}/Tournois/${tournoiId}`);
      console.log('Réponse API - Équipe retirée du tournoi:', response.status);
      return true;
    } catch (error) {
      console.error(`Erreur lors du retrait de l'équipe ${equipeId} du tournoi ${tournoiId}:`, error);
      throw error;
    }
  }
};

export default equipeService;