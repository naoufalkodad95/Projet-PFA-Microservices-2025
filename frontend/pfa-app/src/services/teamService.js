// src/services/teamService.js
// import api from './api';

// const teamService = {
//   // Récupérer les détails d'une équipe
// // Récupérer les détails d'une équipe
//   // Dans teamService.js
//   getAllEquipes: async () => {
//     const response = await api.get('/equipes'); // Doit correspondre au chemin API
//     return response.data;
//   },
//   getTeamById: async (teamId) => {
//     try {
//       const response = await api.get(`/equipes/${teamId}`);

//       // Transformer les données
//       const teamData = response.data;

//       // Traitement spécial pour le logo si nécessaire
//       let processedLogo = null;
//       if (teamData.logo) {
//         // Si le logo est une chaîne Base64, la conserver telle quelle
//         if (typeof teamData.logo === 'string' && teamData.logo.startsWith('data:')) {
//           processedLogo = teamData.logo;
//         }
//         // Si le logo est un tableau ou autre format
//         else {
//           // Si c'est un tableau d'octets, le laisser tel quel
//           // car il sera traité dans le composant
//           processedLogo = teamData.logo;

//           // Impression de débogage
//           console.log("Format du logo reçu:", typeof teamData.logo);
//           if (Array.isArray(teamData.logo)) {
//             console.log("Longueur du tableau:", teamData.logo.length);
//           }
//         }
//       }

//       return {
//         id: teamData.id,
//         name: teamData.nom,
//         logo: processedLogo,
//         stats: {
//           players: `${teamData.joueursIds ? teamData.joueursIds.length : 0}/10`,
//           points: teamData.points || 0,
//           wins: teamData.victoires || 0,
//           losses: teamData.defaites || 0,
//           goalsFor: teamData.nbrButPlus || 0,
//           goalsAgainst: teamData.nbrButMoins || 0,
//           winRate: calculateWinRate(teamData.victoires, teamData.defaites, teamData.egalites)
//         }
//       };
//     } catch (error) {
//       console.error('Error fetching team:', error);
//       throw error;
//     }
//   },

//   // Récupérer les membres d'une équipe
//   getTeamMembers: async (teamId) => {
//     try {
//       const response = await api.get(`/equipes/${teamId}/joueurs`);

//       // Transformer les données pour correspondre au format attendu par le frontend
//       return response.data.map(player => ({
//         id: player.id,
//         name: `${player.prenom} ${player.nom}`,
//         position: player.position || 'Not specified',
//         role: player.id === (response.data.capitaineId || 0) ? 'Captain' : 'Player',
//         goals: player.nbrButs || 0,
//         email: player.email
//       }));
//     } catch (error) {
//       console.error('Error fetching team members:', error);
//       throw error;
//     }
//   },

//   // Récupérer les demandes d'adhésion à une équipe
//   getTeamMembershipRequests: async (teamId) => {
//     try {
//       const response = await api.get(`/equipes/${teamId}/demandes`);

//       // Transformer les données pour correspondre au format attendu
//       return response.data.map(request => ({
//         id: request.id,
//         name: `${request.prenom} ${request.nom}`,
//         position: request.position || 'Not specified',
//         goals: request.nbrButs || 0,
//         email: request.email
//       }));
//     } catch (error) {
//       console.error('Error fetching membership requests:', error);
//       throw error;
//     }
//   },

//   // Accepter une demande d'adhésion
//   acceptMembershipRequest: async (teamId, joueurId) => {
//     try {
//       const response = await api.post(`/equipes/${teamId}/demandes/${joueurId}/accepter`);
//       return response.data;
//     } catch (error) {
//       console.error('Error accepting membership request:', error);
//       throw error;
//     }
//   },

//   // Rejeter une demande d'adhésion
//   rejectMembershipRequest: async (teamId, joueurId) => {
//     try {
//       const response = await api.post(`/equipes/${teamId}/demandes/${joueurId}/refuser`);
//       return response.data;
//     } catch (error) {
//       console.error('Error rejecting membership request:', error);
//       throw error;
//     }
//   },

//   // Supprimer un membre de l'équipe
//   removeMember: async (teamId, joueurId) => {
//     try {
//       await api.delete(`/equipes/${teamId}/joueurs/${joueurId}`);
//       return { success: true };
//     } catch (error) {
//       console.error('Error removing team member:', error);
//       throw error;
//     }
//   },

//   // Promouvoir un joueur au rang de capitaine
//   promoteToCaptain: async (teamId, joueurId) => {
//     try {
//       const response = await api.post(`/equipes/${teamId}/capitaine/${joueurId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error promoting member to captain:', error);
//       throw error;
//     }
//   },

//   // Mettre à jour les informations de l'équipe
//   updateEquipe: async (teamId, teamData) => {
//     try {
//       // Convertir les données au format attendu par l'API
//       const apiTeamData = {
//         nom: teamData.name,
//         logo: teamData.logo
//         // Ajoutez d'autres champs si nécessaire
//       };

//       const response = await api.put(`/equipes/${teamId}`, apiTeamData);

//       // Transformer la réponse pour correspondre au format attendu
//       const updatedTeam = response.data;
//       return {
//         id: updatedTeam.id,
//         name: updatedTeam.nom,
//         logo: updatedTeam.logo,
//         stats: {
//           players: `${updatedTeam.joueursIds ? updatedTeam.joueursIds.length : 0}/10`,
//           points: updatedTeam.points || 0,
//           wins: updatedTeam.victoires || 0,
//           losses: updatedTeam.defaites || 0,
//           goalsFor: updatedTeam.nbrButPlus || 0,
//           goalsAgainst: updatedTeam.nbrButMoins || 0,
//           winRate: calculateWinRate(updatedTeam.victoires, updatedTeam.defaites, updatedTeam.egalites)
//         }
//       };
//     } catch (error) {
//       console.error('Error updating team:', error);
//       throw error;
//     }
//   },

// // Mettre à jour cette fonction dans votre fichier teamService.js

//   /**
//    * Ajoute un joueur à une équipe
//    */
//   addJoueurToEquipe: async (teamId, joueurId) => {
//     try {
//       console.log(`Tentative d'ajout du joueur ${joueurId} à l'équipe ${teamId}`);

//       // Vérifier que les paramètres sont bien des nombres
//       const equipeId = Number(teamId);
//       const playerId = Number(joueurId);

//       if (isNaN(equipeId) || isNaN(playerId)) {
//         throw new Error('ID d\'équipe ou de joueur invalide');
//       }

//       // Appel API en ajoutant des logs détaillés
//       try {
//         const response = await api.post(`/equipes/${equipeId}/joueurs/${playerId}`);
//         console.log('Réponse du serveur:', response.data);
//         return response.data;
//       } catch (apiError) {
//         console.error('Erreur API:', apiError.response?.data || apiError.message);

//         // Journaliser les détails spécifiques de l'erreur
//         if (apiError.response) {
//           console.error('Status:', apiError.response.status);
//           console.error('Headers:', apiError.response.headers);
//           console.error('Data:', apiError.response.data);
//         }

//         throw apiError;
//       }
//     } catch (error) {
//       console.error('Erreur complète lors de l\'ajout du joueur:', error);
//       throw error;
//     }
//   },

//   // Créer un nouveau joueur
//   createJoueur: async (joueurData) => {
//     try {
//       // Cette fonction doit appeler le microservice de gestion des utilisateurs
//       // Comme nous nous concentrons sur le microservice des équipes et matchs,
//       // nous supposons qu'il existe un endpoint pour créer un joueur

//       // Adapter les données au format attendu par l'API utilisateurs
//       const apiJoueurData = {
//         nom: joueurData.nom,
//         prenom: joueurData.prenom,
//         email: joueurData.email,
//         position: joueurData.position || '',
//         niveau: parseInt(joueurData.niveau) || 1,
//         dateNaissance: joueurData.dateNaissance || null,
//         telephone: joueurData.telephone || ''
//       };

//       // Appel à l'API du service utilisateurs
//       const response = await api.post('/joueurs', apiJoueurData);

//       // Retourner les données au format attendu par le frontend
//       return {
//         id: response.data.id,
//         name: `${response.data.prenom} ${response.data.nom}`,
//         position: response.data.position || 'Not specified',
//         goals: response.data.nbrButs || 0,
//         email: response.data.email
//       };
//     } catch (error) {
//       console.error('Error creating joueur:', error);
//       throw error;
//     }
//   },

//   // Rechercher des joueurs disponibles
//   searchJoueurs: async (searchParams) => {
//     try {
//       // Construire l'URL avec les paramètres de recherche
//       let url = '/joueurs/search';

//       // Initialiser les paramètres de requête
//       const params = new URLSearchParams();

//       // Ajouter les paramètres s'ils existent
//       if (searchParams.nom) params.append('nom', searchParams.nom);
//       if (searchParams.position) params.append('position', searchParams.position);
//       if (searchParams.niveauMin) params.append('niveauMin', searchParams.niveauMin);

//       // Ajouter les paramètres à l'URL si nécessaire
//       if (params.toString()) {
//         url += `?${params.toString()}`;
//       }

//       const response = await api.get(url);

//       // Transformer les données pour correspondre au format attendu
//       return response.data.map(player => ({
//         id: player.id,
//         name: `${player.prenom} ${player.nom}`,
//         position: player.position || 'Not specified',
//         goals: player.nbrButs || 0,
//         email: player.email
//       }));
//     } catch (error) {
//       console.error('Error searching players:', error);
//       throw error;
//     }
//   },

//   // Obtenir tous les joueurs sans équipe
//   getJoueursSansEquipe: async () => {
//     try {
//       const response = await api.get('/joueurs/sans-equipe');

//       // Transformer les données pour correspondre au format attendu
//       return response.data.map(player => ({
//         id: player.id,
//         name: `${player.prenom} ${player.nom}`,
//         position: player.position || 'Not specified',
//         goals: player.nbrButs || 0,
//         email: player.email
//       }));
//     } catch (error) {
//       console.error('Error fetching players without team:', error);
//       throw error;
//     }
//   },

//   // Mettre à jour les informations d'un joueur
//   updateJoueur: async (joueurId, joueurData) => {
//     try {
//       // Cette fonction devrait normalement appeler le microservice de gestion des utilisateurs
//       // Adapter les données au format attendu par l'API
//       const apiJoueurData = {
//         nom: joueurData.nom,
//         prenom: joueurData.prenom,
//         email: joueurData.email,
//         position: joueurData.position || '',
//         niveau: parseInt(joueurData.niveau) || 1,
//         dateNaissance: joueurData.dateNaissance || null,
//         telephone: joueurData.telephone || ''
//       };

//       const response = await api.put(`/joueurs/${joueurId}`, apiJoueurData);

//       // Retourner les données au format attendu par le frontend
//       return {
//         id: response.data.id,
//         name: `${response.data.prenom} ${response.data.nom}`,
//         position: response.data.position || 'Not specified',
//         goals: response.data.nbrButs || 0,
//         email: response.data.email
//       };
//     } catch (error) {
//       console.error('Error updating joueur:', error);
//       throw error;
//     }
//   },

//   // Demander à rejoindre une équipe
//   demanderRejoindreEquipe: async (joueurId, equipeId) => {
//     try {
//       const response = await api.post(`/joueurs/${joueurId}/equipes/${equipeId}/demande`);
//       return response.data;
//     } catch (error) {
//       console.error('Error requesting to join team:', error);
//       throw error;
//     }
//   }
// };

// // Fonction utilitaire pour calculer le taux de victoire
// function calculateWinRate(wins, losses, draws) {
//   const totalMatches = wins + losses + (draws || 0);
//   if (totalMatches === 0) return '0%';

//   const winRate = (wins / totalMatches) * 100;
//   return `${Math.round(winRate)}%`;
// }

// export default teamService;


// src/services/teamService.js

// Données factices pour le développement
const mockData = {
  team: {
    id: 1,
    name: 'The Tigers',
    logo: null,
    stats: {
      players: '7/10',
      points: 24,
      wins: 8,
      losses: 3,
      goalsFor: 35,
      goalsAgainst: 21,
      winRate: '73%'
    }
  },
  members: [
    {
      id: 1,
      name: 'bilal kanba',
      position: 'Forward',
      role: 'Captain',
      goals: 10,
      email: 'bilal.kanba@email.com'
    },
    {
      id: 2,
      name: 'naoufal kodad',
      position: 'Midfield',
      role: 'Player',
      goals: 5,
      email: 'naoufal.kodad@email.com'
    },
    {
      id: 3,
      name: 'wiam bouhmidi',
      position: 'Defender',
      role: 'Player',
      goals: 2,
      email: 'wiam.bouhmidi@email.com'
    },
    {
      id: 4,
      name: 'hamza amaraa',
      position: 'Goalkeeper',
      role: 'Player',
      goals: 0,
      email: 'hamza.amaraa@email.com'
    },
    {
      id: 5,
      name: 'abdo maldini',
      position: 'Midfield',
      role: 'Player',
      goals: 3,
      email: 'abdo.maldini@email.com'
    },
    {
      id: 6,
      name: 'walid walid',
      position: 'Forward',
      role: 'Player',
      goals: 7,
      email: 'walid.walid@email.com'
    },
    {
      id: 7,
      name: 'moufid gendarme',
      position: 'Defender',
      role: 'Player',
      goals: 1,
      email: 'moufid.gendarme@email.com'
    }
  ],
  requests: [
    {
      id: 7,
      name: 'hamza kodad',
      position: 'Forward',
      goals: 9,
      email: 'hamza.kodad@email.com'
    },
    {
      id: 8,
      name: 'amine bouhmidi',
      position: 'Midfield',
      goals: 5,
      email: 'amine.bouhmidi@email.com'
    },
    {
      id: 9,
      name: 'ahmed kanba',
      position: 'Defender',
      goals: 3,
      email: 'ahmed.kanba@email.com'
    },
  ]
};

// Simuler un délai de réseau pour le développement
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const teamService = {
  // Récupérer les détails d'une équipe
  getTeamById: async (teamId) => {
    try {
      // En production, vous feriez un appel API ici
      // const response = await api.get(`/teams/${teamId}`);
      // return response.data;

      // Pour le développement, utiliser les données factices
      await delay(500); // Simuler un délai réseau
      return mockData.team;
    } catch (error) {
      console.error('Error fetching team:', error);
      throw error;
    }
  },

  // Récupérer les membres d'une équipe
  getTeamMembers: async (teamId) => {
    try {
      await delay(500); // Simuler un délai réseau
      return mockData.members;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  // Récupérer les demandes d'adhésion à une équipe
  getTeamMembershipRequests: async (teamId) => {
    try {
      await delay(500); // Simuler un délai réseau
      return mockData.requests;
    } catch (error) {
      console.error('Error fetching membership requests:', error);
      throw error;
    }
  },

  // Accepter une demande d'adhésion
  acceptMembershipRequest: async (teamId, requestId) => {
    try {
      await delay(500); // Simuler un délai réseau
      return { success: true };
    } catch (error) {
      console.error('Error accepting membership request:', error);
      throw error;
    }
  },

  // Rejeter une demande d'adhésion
  rejectMembershipRequest: async (teamId, requestId) => {
    try {
      await delay(500); // Simuler un délai réseau
      return { success: true };
    } catch (error) {
      console.error('Error rejecting membership request:', error);
      throw error;
    }
  },

  // Supprimer un membre de l'équipe
  removeMember: async (teamId, memberId) => {
    try {
      await delay(500); // Simuler un délai réseau
      return { success: true };
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  },

  // Promouvoir un membre au rang de capitaine
  promoteToCaptain: async (teamId, memberId) => {
    try {
      await delay(500); // Simuler un délai réseau
      return { success: true };
    } catch (error) {
      console.error('Error promoting member to captain:', error);
      throw error;
    }
  },

  // Mettre à jour les informations de l'équipe
  updateTeam: async (teamId, teamData) => {
    try {
      await delay(500); // Simuler un délai réseau
      return { ...mockData.team, ...teamData };
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  }
};

export default teamService;
