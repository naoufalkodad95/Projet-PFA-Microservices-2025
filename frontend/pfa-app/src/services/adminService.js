import api from './api';
import matchService from './matchService';

/**
 * Service pour gérer les opérations d'administration
 */
const adminService = {
  /**
   * Génère un calendrier de matchs automatiquement
   * @param {Object} params - Paramètres de génération
   * @returns {Promise<Array>} Liste des matchs générés
   */
  generateCalendar: async (params) => {
    // Utilise le service match existant pour créer les matchs
    const { teams, startDate, endDate, timeSlots, fields, homeAndAway } = params;
    const generatedMatches = [];

    try {
      // Pour chaque paire d'équipes, créer des matchs
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          // Créer match aller
          const matchDomicile = {
            equipeDomicileId: teams[i],
            equipeExterieurId: teams[j],
            dateMatch: getRandomDateTimeInRange(startDate, endDate, timeSlots),
            terrain: fields[Math.floor(Math.random() * fields.length)],
            isTournoi: false
          };

          const createdMatch = await matchService.createMatch(matchDomicile);
          generatedMatches.push(createdMatch);

          // Créer match retour si nécessaire
          if (homeAndAway) {
            const matchExterieur = {
              equipeDomicileId: teams[j],
              equipeExterieurId: teams[i],
              dateMatch: getRandomDateTimeInRange(startDate, endDate, timeSlots),
              terrain: fields[Math.floor(Math.random() * fields.length)],
              isTournoi: false
            };

            const createdReturnMatch = await matchService.createMatch(matchExterieur);
            generatedMatches.push(createdReturnMatch);
          }
        }
      }

      return generatedMatches;
    } catch (error) {
      console.error('Erreur lors de la génération du calendrier:', error);
      throw error;
    }
  },

  /**
   * Vérifie si un terrain est disponible en excluant un match spécifique
   * @param {string} terrain - Nom du terrain
   * @param {string} dateDebut - Date et heure de début au format ISO
   * @param {string} dateFin - Date et heure de fin au format ISO
   * @param {number} matchIdToExclude - ID du match à exclure
   * @returns {Promise<boolean>} true si le terrain est disponible
   */
  checkFieldAvailabilityExcludingMatch: async (terrain, dateDebut, dateFin, matchIdToExclude) => {
    try {
      // Vérifier d'abord si le terrain est généralement disponible
      const isAvailable = await matchService.isTerrainDisponible(terrain, dateDebut, dateFin);

      if (isAvailable) {
        return true;
      }

      // Si non disponible, vérifier si c'est uniquement à cause du match que nous voulons modifier
      const matchsInPeriod = await matchService.getMatchsPeriode(dateDebut, dateFin);

      // Filtrer pour exclure le match en cours de modification
      const conflictingMatches = matchsInPeriod.filter(match =>
          match.id !== matchIdToExclude && match.terrain === terrain
      );

      return conflictingMatches.length === 0;
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques des matchs
   * @returns {Promise<Object>} Statistiques des matchs
   */
  getMatchStatistics: async () => {
    try {
      const allMatches = await matchService.getAllMatchs();

      // Statistiques de base
      const totalMatches = allMatches.length;
      const playedMatches = allMatches.filter(match => match.statut === 'JOUE').length;
      const upcomingMatches = allMatches.filter(match => match.statut === 'PLANIFIE').length;

      // Statistiques par équipe
      const teamStats = {};

      allMatches.forEach(match => {
        // Équipe domicile
        if (!teamStats[match.equipeDomicileId]) {
          teamStats[match.equipeDomicileId] = {
            id: match.equipeDomicileId,
            nom: match.equipeDomicileNom,
            matchesPlayed: 0,
            matchesWon: 0,
            matchesLost: 0,
            matchesTied: 0
          };
        }

        // Équipe extérieur
        if (!teamStats[match.equipeExterieurId]) {
          teamStats[match.equipeExterieurId] = {
            id: match.equipeExterieurId,
            nom: match.equipeExterieurNom,
            matchesPlayed: 0,
            matchesWon: 0,
            matchesLost: 0,
            matchesTied: 0
          };
        }

        // Compter les matchs joués et leurs résultats
        if (match.statut === 'JOUE') {
          teamStats[match.equipeDomicileId].matchesPlayed++;
          teamStats[match.equipeExterieurId].matchesPlayed++;

          if (match.scoreDomicile > match.scoreExterieur) {
            teamStats[match.equipeDomicileId].matchesWon++;
            teamStats[match.equipeExterieurId].matchesLost++;
          } else if (match.scoreDomicile < match.scoreExterieur) {
            teamStats[match.equipeDomicileId].matchesLost++;
            teamStats[match.equipeExterieurId].matchesWon++;
          } else {
            teamStats[match.equipeDomicileId].matchesTied++;
            teamStats[match.equipeExterieurId].matchesTied++;
          }
        }
      });

      return {
        totalMatches,
        playedMatches,
        upcomingMatches,
        teamStats: Object.values(teamStats)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques du tableau de bord
   * @returns {Promise<Object>} Statistiques du tableau de bord
   */
  getDashboardStats: async () => {
    try {
      // Récupérer les matchs
      const allMatches = await matchService.getAllMatchs();

      // Récupérer les équipes - à adapter selon votre API
      const teamsResponse = await api.get('/equipes');
      const allTeams = teamsResponse.data;

      // Récupérer les défis - à adapter selon votre API
      const challengesResponse = await api.get('/defis');
      const allChallenges = challengesResponse.data;

      // Compter les matchs par terrain
      const fieldStats = {};
      allMatches.forEach(match => {
        if (!fieldStats[match.terrain]) {
          fieldStats[match.terrain] = 0;
        }
        fieldStats[match.terrain]++;
      });

      const fields = Object.keys(fieldStats).map(terrain => ({
        name: terrain,
        matchCount: fieldStats[terrain]
      }));

      // Récupérer les activités récentes (derniers matchs créés, résultats saisis, etc.)
      // Ici, nous simulons des activités récentes basées sur les données existantes
      const recentMatches = [...allMatches].sort((a, b) => new Date(b.dateMatch) - new Date(a.dateMatch)).slice(0, 5);
      const recentActivity = recentMatches.map(match => ({
        type: match.statut === 'JOUE' ? 'RESULT_ENTERED' : 'MATCH_CREATED',
        date: match.dateMatch,
        description: match.statut === 'JOUE'
            ? `Résultat saisi: ${match.equipeDomicileNom} ${match.scoreDomicile} - ${match.scoreExterieur} ${match.equipeExterieurNom}`
            : `Match planifié: ${match.equipeDomicileNom} vs ${match.equipeExterieurNom}`
      }));

      return {
        totalTeams: allTeams.length,
        totalPlayers: allTeams.reduce((acc, team) => acc + (team.joueurs ? team.joueurs.length : 0), 0),
        totalMatches: allMatches.length,
        matchesPlayed: allMatches.filter(match => match.statut === 'JOUE').length,
        matchesPending: allMatches.filter(match => match.statut !== 'JOUE').length,
        activeChallenges: allChallenges.filter(defi => defi.statut === 'EN_ATTENTE').length,
        fields,
        recentActivity
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques du tableau de bord:', error);
      throw error;
    }
  },

  /**
   * Vérifie si l'utilisateur est un administrateur
   * @returns {Promise<boolean>} true si l'utilisateur est un admin
   */
  checkAdminStatus: async () => {
    // À adapter selon votre logique d'authentification
    try {
      const userJson = localStorage.getItem('user');

      if (!userJson) {
        return false;
      }

      const user = JSON.parse(userJson);
      return user && user.role === 'ADMIN';
    } catch (error) {
      console.error('Erreur lors de la vérification du statut admin:', error);
      return false;
    }
  }
};

/**
 * Génère une date et heure aléatoire dans une plage donnée
 * @param {string} startDate - Date de début
 * @param {string} endDate - Date de fin
 * @param {Array} timeSlots - Créneaux horaires disponibles
 * @returns {string} Date et heure au format ISO
 */
function getRandomDateTimeInRange(startDate, endDate, timeSlots) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Générer une date aléatoire entre début et fin
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

  // Réinitialiser l'heure à 00:00:00
  date.setHours(0, 0, 0, 0);

  // Choisir un créneau horaire aléatoire
  const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
  const [hours, minutes] = timeSlot.start.split(':');

  date.setHours(parseInt(hours), parseInt(minutes), 0);

  return date.toISOString();
}

export default adminService;