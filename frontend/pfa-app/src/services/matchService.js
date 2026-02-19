// src/services/matchService.js
import api from './api';

/**
 * Service pour gérer les opérations liées aux matchs
 */
const matchService = {
  /**
   * Récupère tous les matchs
   * @returns {Promise<Array>} Liste des matchs
   */
  getAllMatchs: async () => {
    try {
      const response = await api.get('/matchs');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs:', error);
      throw error;
    }
  },

  /**
   * Récupère un match par son ID
   * @param {number} matchId - ID du match
   * @returns {Promise<Object>} Détails du match
   */
  getMatchById: async (matchId) => {
    try {
      const response = await api.get(`/matchs/${matchId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du match ${matchId}:`, error);
      throw error;
    }
  },

  /**
   * Crée un nouveau match
   * @param {Object} matchData - Données du match à créer
   * @returns {Promise<Object>} Match créé
   */
  createMatch: async (matchData) => {
    try {
      const response = await api.post('/matchs', matchData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du match:', error);
      throw error;
    }
  },

  /**
   * Met à jour un match existant
   * @param {number} matchId - ID du match
   * @param {Object} matchData - Nouvelles données du match
   * @returns {Promise<Object>} Match mis à jour
   */
  updateMatch: async (matchId, matchData) => {
    try {
      const response = await api.put(`/matchs/${matchId}`, matchData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du match ${matchId}:`, error);
      throw error;
    }
  },
  /**
   * Supprime un match existant
   * @param {number} matchId - ID du match à supprimer
   * @returns {Promise<boolean>} true si la suppression a réussi
   */
  deleteMatch: async (matchId) => {
    try {
      console.log(`Tentative de suppression du match avec ID: ${matchId}`);

      // Effectuer la requête DELETE
      const response = await api.delete(`/matchs/${matchId}`);

      console.log('Réponse de suppression:', response);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du match ${matchId}:`, error);
      throw error;
    }
  },

  /**
   * Saisit le résultat d'un match
   * @param {number} matchId - ID du match
   * @param {Object} resultatData - Données du résultat
   * @returns {Promise<Object>} Match mis à jour avec le résultat
   */
  saisirResultat: async (matchId, resultatData) => {
    try {
      const response = await api.put(`/matchs/${matchId}/resultat`, resultatData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la saisie du résultat pour le match ${matchId}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les matchs d'une équipe
   * @param {number} equipeId - ID de l'équipe
   * @returns {Promise<Array>} Liste des matchs de l'équipe
   */
  getMatchsByEquipe: async (equipeId) => {
    try {
      const response = await api.get(`/matchs/equipe/${equipeId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des matchs de l'équipe ${equipeId}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les matchs en attente de résultat
   * @returns {Promise<Array>} Liste des matchs en attente
   */
  getMatchsEnAttente: async () => {
    try {
      const response = await api.get('/matchs/en-attente');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs en attente:', error);
      throw error;
    }
  },

  /**
   * Vérifie la disponibilité d'un terrain
   * @param {string} terrain - Nom du terrain
   * @param {Date|string} dateDebut - Date et heure de début
   * @param {Date|string} dateFin - Date et heure de fin
   * @returns {Promise<boolean>} true si le terrain est disponible, false sinon
   */
  isTerrainDisponible: async (terrain, dateDebut, dateFin) => {
    try {
      // Formater les dates au format ISO si ce sont des objets Date
      const debutFormatted = dateDebut instanceof Date ? dateDebut.toISOString() : dateDebut;
      const finFormatted = dateFin instanceof Date ? dateFin.toISOString() : dateFin;

      const response = await api.get('/matchs/terrain-disponible', {
        params: {
          terrain,
          dateDebut: debutFormatted,
          dateFin: finFormatted
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification de la disponibilité du terrain:', error);
      throw error;
    }
  },

  /**
   * Récupère les matchs d'une période donnée
   * @param {Date|string} debut - Date de début de la période
   * @param {Date|string} fin - Date de fin de la période
   * @returns {Promise<Array>} Liste des matchs dans la période
   */
  getMatchsPeriode: async (debut, fin) => {
    try {
      // Formater les dates au format ISO si ce sont des objets Date
      const debutFormatted = debut instanceof Date ? debut.toISOString() : debut;
      const finFormatted = fin instanceof Date ? fin.toISOString() : fin;

      const response = await api.get('/matchs/periode', {
        params: {
          debut: debutFormatted,
          fin: finFormatted
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs de la période:', error);
      throw error;
    }
  },

  /**
   * Finalise un match en le marquant comme terminé
   * Cette méthode est une extension pour simplifier la mise à jour du statut
   * @param {number} matchId - ID du match
   * @param {Object} finalData - Données de finalisation incluant le statut
   * @returns {Promise<Object>} Match mis à jour
   */
  finalizeMatch: async (matchId, finalData) => {
    try {
      // On utilise la méthode de mise à jour générale
      const response = await api.put(`/matchs/${matchId}`, {
        ...finalData,
        statut: 'JOUE' // Utiliser le statut "JOUE" pour un match terminé selon l'API
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la finalisation du match ${matchId}:`, error);
      throw error;
    }
  },

  /**
   * Utilitaires pour formater les données de match
   */
  utils: {
    /**
     * Formate une réponse de match pour l'affichage
     * @param {Object} matchData - Données du match
     * @returns {Object} Données formatées
     */
    formatMatchData: (matchData) => {
      if (!matchData) return null;

      console.log("Données match brutes:", matchData); // Debug

      // Créer des objets équipe pour uniformiser l'interface
      const matchFormatted = {
        ...matchData,
        equipeInitiatrice: {
          id: matchData.equipeDomicileId,
          nom: matchData.equipeDomicileNom || 'Équipe domicile'
        },
        equipeAdverse: {
          id: matchData.equipeExterieurId,
          nom: matchData.equipeExterieurNom || 'Équipe extérieur'
        },
        scoreEquipeInitiatrice: matchData.scoreDomicile,
        scoreEquipeAdverse: matchData.scoreExterieur,
        // Déduit la date et l'heure depuis dateMatch
        dateMatch: matchData.dateMatch ? matchData.dateMatch.split('T')[0] : null,
        heureDebut: matchData.dateMatch ? {
          hour: parseInt(matchData.dateMatch.split('T')[1].split(':')[0]),
          minute: parseInt(matchData.dateMatch.split('T')[1].split(':')[1])
        } : null,
        // Par défaut le match dure 1h
        heureFin: matchData.dateMatch ? {
          hour: Math.min(23, parseInt(matchData.dateMatch.split('T')[1].split(':')[0]) + 1),
          minute: parseInt(matchData.dateMatch.split('T')[1].split(':')[1])
        } : null,
      };

      console.log("Données match formatées:", matchFormatted); // Debug
      return matchFormatted;
    }
  }
};

export default matchService;