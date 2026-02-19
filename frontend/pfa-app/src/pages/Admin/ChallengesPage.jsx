// src/pages/ChallengesPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainLayout from '../../components/layout/MainLayout';
import Tabs from '../../components/common/Tabs';
import FloatingActionButton from '../../components/common/FloatingActionButton';
import SentChallenges from '../../components/challenges/SentChallenges';
import ReceivedChallenges from '../../components/challenges/ReceivedChallenges';
import NewChallengeModal from '../../components/challenges/NewChallengeModal';
import defiService from '../../services/defiService';
import teamService from '../../services/teamService';
import theme from '../../styles/theme';

const ChallengesContainer = styled.div`
  width: 100%;
`;

const ChallengesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSizes.xxl};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: ${theme.typography.fontSizes.lg};
  color: ${theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  padding: ${theme.spacing.lg};
  margin: ${theme.spacing.md} 0;
  background-color: rgba(211, 84, 0, 0.1);
  border-left: 4px solid ${theme.colors.negative};
  color: ${theme.colors.textSecondary};
  border-radius: ${theme.borderRadius.small};
`;

const ChallengesPage = () => {
  // États
  const [sentChallenges, setSentChallenges] = useState([]);
  const [receivedChallenges, setReceivedChallenges] = useState([]);
  const [isNewChallengeModalOpen, setIsNewChallengeModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ID de l'équipe actuellement connectée (simulé)
  // Dans une application réelle, cela viendrait de l'authentification
  const currentTeamId = 1;

  // Charger les défis à l'initialisation
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);

        // Charger les défis envoyés
        const sentData = await defiService.getDefisEnvoyes(currentTeamId);
        setSentChallenges(sentData);

        // Charger les défis reçus
        const receivedData = await defiService.getDefisRecus(currentTeamId);
        setReceivedChallenges(receivedData);

        // Charger la liste des équipes pour le formulaire de création de défi
        const teamsResponse = await teamService.getAllEquipes();
        setTeams(teamsResponse);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching challenges:', err);
        setError('Impossible de charger les défis. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [currentTeamId, refreshTrigger]);

  // Gestionnaires d'événements
  const handleNewChallenge = () => {
    setIsNewChallengeModalOpen(true);
  };

  const handleChallengeCreated = () => {
    setIsNewChallengeModalOpen(false);
    // Rafraîchir les données
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancelChallenge = async (challengeId) => {
    try {
      await defiService.annulerDefi(challengeId);
      // Rafraîchir les données
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error canceling challenge:', err);
      setError('Impossible d\'annuler le défi. Veuillez réessayer.');
    }
  };

  const handleAcceptChallenge = async (challengeId) => {
    try {
      await defiService.accepterDefi(challengeId);
      // Rafraîchir les données
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error accepting challenge:', err);
      setError('Impossible d\'accepter le défi. Veuillez réessayer.');
    }
  };

  const handleRefuseChallenge = async (challengeId) => {
    try {
      await defiService.refuserDefi(challengeId);
      // Rafraîchir les données
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error refusing challenge:', err);
      setError('Impossible de refuser le défi. Veuillez réessayer.');
    }
  };

  // Contenu des onglets
  const tabsContent = [
    {
      label: 'Défis envoyés',
      badge: sentChallenges.length || null,
      content: (
          <SentChallenges
              challenges={sentChallenges}
              onCancel={handleCancelChallenge}
          />
      )
    },
    {
      label: 'Défis reçus',
      badge: receivedChallenges.length || null,
      content: (
          <ReceivedChallenges
              challenges={receivedChallenges}
              onAccept={handleAcceptChallenge}
              onRefuse={handleRefuseChallenge}
          />
      )
    }
  ];

  // Affichage du chargement
  if (loading) {
    return (
        <MainLayout>
          <LoadingMessage>Chargement des défis...</LoadingMessage>
        </MainLayout>
    );
  }

  return (
      <MainLayout>
        <ChallengesContainer>
          <ChallengesHeader>
            <Title>Défis</Title>
          </ChallengesHeader>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Tabs tabs={tabsContent} />

          <FloatingActionButton
              secondary
              onClick={handleNewChallenge}
              ariaLabel="Créer un nouveau défi"
          />

          {isNewChallengeModalOpen && (
              <NewChallengeModal
                  onClose={() => setIsNewChallengeModalOpen(false)}
                  onSubmit={handleChallengeCreated}
                  teams={teams.filter(team => team.id !== currentTeamId)}
                  currentTeamId={currentTeamId}
              />
          )}
        </ChallengesContainer>
      </MainLayout>
  );
};

export default ChallengesPage;