// src/services/classementService.js
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

// Service pour les classements
const classementService = {
  // Récupérer tous les classements
  getAll: async () => {
    try {
      console.log('Appel API - Récupération de tous les classements');
      const response = await api.get('/Classements');
      console.log('Réponse API - Classements:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des classements:', error);
      throw error;
    }
  },

  // Récupérer un classement par son ID
  getById: async (id) => {
    try {
      console.log(`Appel API - Récupération du classement ${id}`);
      const response = await api.get(`/Classements/${id}`);
      console.log('Réponse API - Classement:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du classement ${id}:`, error);
      throw error;
    }
  },

  // Récupérer le classement d'un tournoi
  getByTournoiId: async (tournoiId) => {
    try {
      console.log(`Appel API - Récupération du classement du tournoi ${tournoiId}`);
      const response = await api.get(`/Tournois/${tournoiId}/Classements`);
      console.log('Réponse API - Classement du tournoi:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du classement du tournoi ${tournoiId}:`, error);
      throw error;
    }
  },

  // Récupérer le classement d'une équipe dans un tournoi
  getByTournoiAndEquipeId: async (tournoiId, equipeId) => {
    try {
      console.log(`Appel API - Récupération du classement de l'équipe ${equipeId} dans le tournoi ${tournoiId}`);
      const response = await api.get(`/Classements/Tournoi/${tournoiId}/Equipe/${equipeId}`);
      console.log('Réponse API - Classement de l\'équipe dans le tournoi:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du classement de l'équipe ${equipeId} dans le tournoi ${tournoiId}:`, error);
      throw error;
    }
  },

  // Créer un nouveau classement
  create: async (classement) => {
    try {
      const classementData = {
        position: classement.position,
        points: classement.points,
        iD_Tournoi: classement.iD_Tournoi,
        iD_Equipe: classement.iD_Equipe
      };
      
      console.log('Appel API - Création d\'un classement avec données:', classementData);
      const response = await api.post('/Classements', classementData);
      console.log('Réponse API - Classement créé:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du classement:', error);
      throw error;
    }
  },

  // Mettre à jour un classement
  update: async (id, classement) => {
    try {
      const classementData = {
        iD_Classement: parseInt(id),
        position: classement.position,
        points: classement.points,
        iD_Tournoi: classement.iD_Tournoi,
        iD_Equipe: classement.iD_Equipe
      };
      
      console.log(`Appel API - Mise à jour du classement ${id} avec données:`, classementData);
      const response = await api.put(`/Classements/${id}`, classementData);
      console.log('Réponse API - Classement mis à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du classement ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un classement
  delete: async (id) => {
    try {
      console.log(`Appel API - Suppression du classement ${id}`);
      const response = await api.delete(`/Classements/${id}`);
      console.log('Réponse API - Classement supprimé:', response.status);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du classement ${id}:`, error);
      throw error;
    }
  },

  // Mettre à jour le classement après un match
  updateClassementAfterMatch: async (tournoiId, match) => {
    // Cette fonction est à implémenter selon votre logique métier
    // Par exemple, après un match, vous pourriez :
    // 1. Récupérer le classement actuel des deux équipes
    // 2. Calculer les nouveaux points selon le résultat du match
    // 3. Mettre à jour les classements
    // 4. Réorganiser les positions

    try {
      console.log(`Mise à jour du classement après le match dans le tournoi ${tournoiId}`);
      
      // Récupérer tous les classements du tournoi
      const classements = await classementService.getByTournoiId(tournoiId);
      
      // Trouver les classements des équipes concernées
      const classementEquipe1 = classements.find(c => c.iD_Equipe === match.iD_Equipe1);
      const classementEquipe2 = classements.find(c => c.iD_Equipe === match.iD_Equipe2);
      
      // Déterminer les points à attribuer selon le résultat
      if (match.scoreEquipe1 !== null && match.scoreEquipe2 !== null) {
        let pointsEquipe1 = 0;
        let pointsEquipe2 = 0;
        
        if (match.scoreEquipe1 > match.scoreEquipe2) {
          // Victoire équipe 1
          pointsEquipe1 = 3;
        } else if (match.scoreEquipe1 < match.scoreEquipe2) {
          // Victoire équipe 2
          pointsEquipe2 = 3;
        } else {
          // Match nul
          pointsEquipe1 = 1;
          pointsEquipe2 = 1;
        }
        
        // Mettre à jour ou créer les classements
        if (classementEquipe1) {
          await classementService.update(classementEquipe1.iD_Classement, {
            ...classementEquipe1,
            points: classementEquipe1.points + pointsEquipe1
          });
        } else {
          await classementService.create({
            position: 1, // sera recalculé après
            points: pointsEquipe1,
            iD_Tournoi: tournoiId,
            iD_Equipe: match.iD_Equipe1
          });
        }
        
        if (classementEquipe2) {
          await classementService.update(classementEquipe2.iD_Classement, {
            ...classementEquipe2,
            points: classementEquipe2.points + pointsEquipe2
          });
        } else {
          await classementService.create({
            position: 1, // sera recalculé après
            points: pointsEquipe2,
            iD_Tournoi: tournoiId,
            iD_Equipe: match.iD_Equipe2
          });
        }
        
        // Récupérer le classement mis à jour et recalculer les positions
        await classementService.recalculatePositions(tournoiId);
      }
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du classement après le match:`, error);
      throw error;
    }
  },
  
  // Recalculer les positions dans un classement
  recalculatePositions: async (tournoiId) => {
    try {
      // Récupérer tous les classements du tournoi
      const classements = await classementService.getByTournoiId(tournoiId);
      
      // Trier par points (décroissant)
      const sortedClassements = [...classements].sort((a, b) => b.points - a.points);
      
      // Mettre à jour les positions
      for (let i = 0; i < sortedClassements.length; i++) {
        const c = sortedClassements[i];
        await classementService.update(c.iD_Classement, {
          ...c,
          position: i + 1
        });
      }
      
      return true;
    } catch (error) {
      console.error(`Erreur lors du recalcul des positions:`, error);
      throw error;
    }
  }
};

export default classementService;