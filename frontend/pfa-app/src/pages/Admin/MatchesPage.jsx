// src/pages/MatchesPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Tabs from '../../components/common/Tabs';
import Button from '../../components/common/Button';
import MatchList from '../../components/matches/MatchList';
import matchService from '../../services/matchService';
import theme from '../../styles/theme';
import NewMatchModal from '../../components/matches/NewMatchModal';
import FloatingActionButton from '../../components/common/FloatingActionButton';

const MatchesContainer = styled.div`
    width: 100%;
`;

const MatchesHeader = styled.div`
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

const AdminActions = styled.div`
    display: flex;
    gap: ${theme.spacing.md};
`;

const FilterContainer = styled.div`
    display: flex;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
    align-items: center;
`;

const FilterLabel = styled.span`
    font-weight: ${theme.typography.fontWeights.medium};
    color: ${theme.colors.textSecondary};
`;

const Select = styled.select`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.small};
    background-color: ${theme.colors.background};
    color: ${theme.colors.textPrimary};
    font-size: ${theme.typography.fontSizes.sm};
    min-width: 150px;
`;

const DateInput = styled.input`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.small};
    background-color: ${theme.colors.background};
    color: ${theme.colors.textPrimary};
    font-size: ${theme.typography.fontSizes.sm};
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

const EmptyStateContainer = styled.div`
    text-align: center;
    padding: ${theme.spacing.xl} 0;
    color: ${theme.colors.textSecondary};
`;

const EmptyStateIcon = styled.div`
    font-size: 48px;
    margin-bottom: ${theme.spacing.md};
    color: ${theme.colors.border};
`;

const EmptyStateText = styled.p`
    font-size: ${theme.typography.fontSizes.lg};
    margin-bottom: ${theme.spacing.lg};
`;

// Fonction pour obtenir la date d'aujourd'hui au format YYYY-MM-DD
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Fonction pour obtenir la date d'il y a 30 jours
const getThirtyDaysAgoDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const MatchesPage = () => {
  // États
  const [matches, setMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [pastMatches, setPastMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewMatchModalOpen, setIsNewMatchModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filtres - Modifié pour montrer "mon équipe" par défaut
  const [teamFilter, setTeamFilter] = useState('my');
  const [periodFilter, setPeriodFilter] = useState('upcoming');
  const [dateRangeStart, setDateRangeStart] = useState(getThirtyDaysAgoDate());
  const [dateRangeEnd, setDateRangeEnd] = useState(getTodayDate());

  // ID de l'équipe actuellement connectée (simulé)
  // Dans une application réelle, cela viendrait de l'authentification
  const currentTeamId = 1;

  // Rôle de l'utilisateur connecté (simulé)
  // Dans une application réelle, cela viendrait du système d'authentification
  const userRole = 'CAPITAINE'; // Valeurs possibles: 'ADMIN', 'CAPITAINE', 'JOUEUR'
  const isAdmin = userRole === 'ADMIN';
  const isCapitaine = userRole === 'CAPITAINE';

  // Charger les matchs à l'initialisation
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);

        // Pour un capitaine, on charge directement les matchs de son équipe
        const matchesData = await matchService.getMatchsByEquipe(currentTeamId);

        // Formater les données des matchs
        const formattedMatches = matchesData.map(match => matchService.utils.formatMatchData(match));
        setMatches(formattedMatches);

        // Filtrer les matchs à venir
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = formattedMatches.filter(match => {
          const matchDate = new Date(match.dateMatch);
          return matchDate >= today || match.statut === 'PLANIFIE';
        }).sort((a, b) => new Date(a.dateMatch) - new Date(b.dateMatch));

        // Filtrer les matchs passés ET joués (avec un score)
        const past = formattedMatches.filter(match => {
          // Vérifier si le match a été joué (statut JOUE)
          const isPlayed = match.statut === 'JOUE';

          // Vérifier si un score a été enregistré
          const hasScore = (match.scoreEquipeInitiatrice !== null && match.scoreEquipeInitiatrice !== undefined) ||
              (match.scoreEquipeAdverse !== null && match.scoreEquipeAdverse !== undefined);

          return isPlayed && hasScore;
        }).sort((a, b) => new Date(b.dateMatch) - new Date(a.dateMatch));

        console.log("Matchs joués avec score:", past);

        setUpcomingMatches(upcoming);
        setPastMatches(past);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Impossible de charger les matchs. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchMatches();
  }, [refreshTrigger, currentTeamId]);

  // Gestionnaires d'événements
  const handleNewMatch = () => {
    setIsNewMatchModalOpen(true);
  };

  const handleMatchCreated = () => {
    setIsNewMatchModalOpen(false);
    // Rafraîchir les données
    setRefreshTrigger(prev => prev + 1);
  };

  const handlePeriodFilterChange = (e) => {
    setPeriodFilter(e.target.value);
  };

  // Récupérer les matchs filtrés par période
  const getFilteredMatches = () => {
    switch (periodFilter) {
      case 'upcoming':
        return upcomingMatches;
      case 'past':
        return pastMatches;
      case 'custom':
        const startDate = new Date(dateRangeStart);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(dateRangeEnd);
        endDate.setHours(23, 59, 59, 999);

        // Pour les matchs en période personnalisée, filtrer les matchs joués avec score
        return matches.filter(match => {
          const matchDate = new Date(match.dateMatch);
          const isInDateRange = matchDate >= startDate && matchDate <= endDate;
          const isPlayed = match.statut === 'JOUE';
          const hasScore = (match.scoreEquipeInitiatrice !== null && match.scoreEquipeInitiatrice !== undefined) ||
              (match.scoreEquipeAdverse !== null && match.scoreEquipeAdverse !== undefined);

          return isInDateRange && isPlayed && hasScore;
        }).sort((a, b) => new Date(b.dateMatch) - new Date(a.dateMatch)); // Tri antichronologique
      default:
        return matches;
    }
  };

  // Contenu des onglets - Titre modifié pour indiquer qu'on affiche les matchs de l'équipe
  const tabsContent = [
    {
      label: 'Matchs à venir',
      badge: upcomingMatches.length || null,
      content: (
          <>
            {getFilteredMatches().length > 0 ? (
                <MatchList
                    matches={getFilteredMatches()}
                    showActions={true}
                    currentTeamId={currentTeamId}
                />
            ) : (
                <EmptyStateContainer>
                  <EmptyStateIcon>⚽</EmptyStateIcon>
                  <EmptyStateText>Aucun match à venir pour votre équipe.</EmptyStateText>
                  {isAdmin && (
                      <Button
                          buttonType="outlined"
                          variant="primary"
                          onClick={handleNewMatch}
                      >
                        Créer un match
                      </Button>
                  )}
                </EmptyStateContainer>
            )}
          </>
      )
    },
    {
      label: 'Matchs joués',
      badge: pastMatches.length || null,
      content: (
          <>
            <FilterContainer>
              <FilterLabel>Période:</FilterLabel>
              <Select value={periodFilter} onChange={handlePeriodFilterChange}>
                <option value="past">Tous les matchs joués</option>
                <option value="custom">Période personnalisée</option>
              </Select>
              {periodFilter === 'custom' && (
                  <>
                    <FilterLabel>Du:</FilterLabel>
                    <DateInput
                        type="date"
                        value={dateRangeStart}
                        onChange={(e) => setDateRangeStart(e.target.value)}
                    />
                    <FilterLabel>Au:</FilterLabel>
                    <DateInput
                        type="date"
                        value={dateRangeEnd}
                        onChange={(e) => setDateRangeEnd(e.target.value)}
                    />
                  </>
              )}
            </FilterContainer>

            {getFilteredMatches().length > 0 ? (
                <MatchList
                    matches={getFilteredMatches()}
                    showActions={false}
                    currentTeamId={currentTeamId}
                />
            ) : (
                <EmptyStateContainer>
                  <EmptyStateIcon>🏆</EmptyStateIcon>
                  <EmptyStateText>Aucun match joué trouvé pour votre équipe.</EmptyStateText>
                </EmptyStateContainer>
            )}
          </>
      )
    }
  ];

  // Affichage du chargement
  if (loading) {
    return (
        <MainLayout>
          <LoadingMessage>Chargement des matchs...</LoadingMessage>
        </MainLayout>
    );
  }

  return (
      <MainLayout>
        <MatchesContainer>
          <MatchesHeader>
            <Title>Matchs de mon équipe</Title>
            {isAdmin && (
                <AdminActions>
                  <Button
                      buttonType="filled"
                      variant="primary"
                      onClick={handleNewMatch}
                  >
                    Créer un match
                  </Button>
                </AdminActions>
            )}
          </MatchesHeader>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Tabs tabs={tabsContent} />

          {/* Le bouton flottant est seulement affiché pour les administrateurs */}
          {isAdmin && (
              <FloatingActionButton
                  secondary
                  onClick={handleNewMatch}
                  ariaLabel="Créer un nouveau match"
              />
          )}

          {isNewMatchModalOpen && isAdmin && (
              <NewMatchModal
                  onClose={() => setIsNewMatchModalOpen(false)}
                  onSubmit={handleMatchCreated}
                  currentTeamId={currentTeamId}
              />
          )}
        </MatchesContainer>
      </MainLayout>
  );
};

export default MatchesPage;