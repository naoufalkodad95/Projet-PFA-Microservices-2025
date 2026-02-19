// src/context/TeamContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import teamService from '../services/teamService';

// Créer le contexte
const TeamContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useTeam = () => useContext(TeamContext);

// Fournisseur du contexte
export const TeamProvider = ({ children }) => {
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données de l'équipe
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);

        // Dans un cas réel, vous auriez probablement un ID d'équipe actif
        const teamId = 1; // Pour simplifier, on utilise l'ID 1

        // Récupérer les données de l'équipe
        const teamData = await teamService.getTeamById(teamId);
        setTeam(teamData);

        // Récupérer les membres de l'équipe
        const membersData = await teamService.getTeamMembers(teamId);
        setMembers(membersData);

        // Récupérer les demandes d'adhésion
        const requestsData = await teamService.getTeamMembershipRequests(teamId);
        setRequests(requestsData);

        setLoading(false);
      } catch (err) {
        setError('Failed to load team data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTeamData();
  }, []);

  // Accepter une demande d'adhésion
  const acceptMembershipRequest = async (requestId) => {
    try {
      await teamService.acceptMembershipRequest(team.id, requestId);

      // Mettre à jour les demandes et les membres
      const request = requests.find(r => r.id === requestId);
      setRequests(prevRequests => prevRequests.filter(r => r.id !== requestId));

      if (request) {
        setMembers(prevMembers => [...prevMembers, { ...request, role: 'Player' }]);
      }

      return true;
    } catch (err) {
      setError('Failed to accept membership request');
      console.error(err);
      return false;
    }
  };

  // Rejeter une demande d'adhésion
  const rejectMembershipRequest = async (requestId) => {
    try {
      await teamService.rejectMembershipRequest(team.id, requestId);

      // Mettre à jour les demandes
      setRequests(prevRequests => prevRequests.filter(r => r.id !== requestId));

      return true;
    } catch (err) {
      setError('Failed to reject membership request');
      console.error(err);
      return false;
    }
  };

  // Supprimer un membre de l'équipe
  const removeMember = async (memberId) => {
    try {
      await teamService.removeMember(team.id, memberId);

      // Mettre à jour les membres
      setMembers(prevMembers => prevMembers.filter(m => m.id !== memberId));

      return true;
    } catch (err) {
      setError('Failed to remove team member');
      console.error(err);
      return false;
    }
  };

  // Promouvoir un membre au rang de capitaine
  const promoteToCaptain = async (memberId) => {
    try {
      await teamService.promoteToCaptain(team.id, memberId);

      // Mettre à jour les rôles des membres
      setMembers(prevMembers => prevMembers.map(member => ({
        ...member,
        role: member.id === memberId ? 'Captain' :
            member.role === 'Captain' ? 'Player' : member.role
      })));

      return true;
    } catch (err) {
      setError('Failed to promote member to captain');
      console.error(err);
      return false;
    }
  };

  // Mettre à jour les informations de l'équipe
  const updateTeam = async (teamData) => {
    try {
      const updatedTeam = await teamService.updateTeam(team.id, teamData);
      setTeam(updatedTeam);
      return true;
    } catch (err) {
      setError('Failed to update team information');
      console.error(err);
      return false;
    }
  };

  // Valeur du contexte
  const value = {
    team,
    members,
    requests,
    loading,
    error,
    acceptMembershipRequest,
    rejectMembershipRequest,
    removeMember,
    promoteToCaptain,
    updateTeam
  };

  return (
      <TeamContext.Provider value={value}>
        {children}
      </TeamContext.Provider>
  );
};

export default TeamContext;