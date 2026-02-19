// src/pages/MatchDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import ScoreUpdateModal from '../../components/matches/ScoreUpdateModal';
import matchService from '../../services/matchService';
import theme from '../../styles/theme';

const MatchContainer = styled.div`
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
`;

const MatchHeader = styled.div`
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

const BackButton = styled(Button)`
    margin-right: ${theme.spacing.md};
`;

const MatchCard = styled.div`
    background-color: ${theme.colors.background};
    border-radius: ${theme.borderRadius.medium};
    box-shadow: ${theme.shadows.medium};
    padding: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.lg};
`;

const MatchStatus = styled.div`
    display: inline-block;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.typography.fontSizes.sm};
    font-weight: ${theme.typography.fontWeights.medium};
    border-radius: ${theme.borderRadius.small};
    margin-bottom: ${theme.spacing.md};

    ${props => {
        switch (props.status) {
            case 'JOUE':
                return `
          background-color: rgba(37, 165, 95, 0.1);
          color: ${theme.colors.primary};
        `;
            case 'EN_ATTENTE':
                return `
          background-color: rgba(255, 107, 53, 0.1);
          color: ${theme.colors.secondary};
        `;
            case 'PLANIFIE':
            default:
                return `
          background-color: rgba(0, 0, 0, 0.1);
          color: ${theme.colors.textSecondary};
        `;
        }
    }}
`;

const TeamsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: ${theme.spacing.lg} 0;
`;

const TeamContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40%;
`;

const TeamLogo = styled.div`
    width: 80px;
    height: 80px;
    background-color: ${theme.colors.cardBackground};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${theme.spacing.sm};
    color: ${theme.colors.textPrimary};
    font-size: ${theme.typography.fontSizes.xxl};
    font-weight: ${theme.typography.fontWeights.bold};
    border: 3px solid ${props => props.isHome ? theme.colors.primary : theme.colors.secondary};
`;

const TeamName = styled.h3`
    font-size: ${theme.typography.fontSizes.lg};
    margin: ${theme.spacing.xs} 0;
    text-align: center;
    color: ${theme.colors.textPrimary};
`;

const ScoreContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20%;
`;

const Score = styled.div`
    font-size: ${theme.typography.fontSizes.xxl};
    font-weight: ${theme.typography.fontWeights.bold};
    color: ${theme.colors.textPrimary};
    padding: ${theme.spacing.md};
    background-color: ${props => props.isFinished ? theme.colors.lightPrimary : theme.colors.cardBackground};
    border-radius: ${theme.borderRadius.small};
    min-width: 120px;
    text-align: center;
`;

const DetailsSection = styled.div`
    margin-top: ${theme.spacing.lg};
    padding-top: ${theme.spacing.lg};
    border-top: 1px solid ${theme.colors.border};
`;

const DetailRow = styled.div`
    display: flex;
    margin-bottom: ${theme.spacing.md};
    align-items: baseline;
`;

const DetailLabel = styled.span`
    font-weight: ${theme.typography.fontWeights.medium};
    color: ${theme.colors.textSecondary};
    width: 150px;
`;

const DetailValue = styled.span`
    color: ${theme.colors.textPrimary};
    flex: 1;
`;

const ActionButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.lg};
`;

const LoadingMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
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

// Format date function (YYYY-MM-DD to DD Month YYYY)
const formatDate = (dateString) => {
  if (!dateString) return 'Date non spécifiée';

  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  } catch (e) {
    console.error('Erreur de formatage de date:', e);
    return dateString;
  }
};

// Format time function
const formatTime = (timeString) => {
  if (!timeString) return '';

  // Handle string time format (HH:MM)
  if (typeof timeString === 'string' && timeString.includes(':')) {
    return timeString;
  }

  // Handle object time format ({hour: X, minute: Y})
  try {
    if (!timeString.hour && timeString.hour !== 0) return '';

    const hour = String(timeString.hour).padStart(2, '0');
    const minute = String(timeString.minute || 0).padStart(2, '0');
    return `${hour}:${minute}`;
  } catch (e) {
    console.error('Erreur de formatage d\'heure:', e);
    return '';
  }
};

// Get status label
const getStatusLabel = (status) => {
  switch (status) {
    case 'JOUE': return 'Terminé';
    case 'EN_ATTENTE': return 'En attente';
    case 'PLANIFIE': return 'Planifié';
    default: return status || 'Non spécifié';
  }
};

const MatchDetailPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);

  // Rôle de l'utilisateur connecté (simulé)
  // Dans une application réelle, cela viendrait du système d'authentification
  const userRole = 'CAPITAINE'; // Valeurs possibles: 'ADMIN', 'CAPITAINE', 'JOUEUR'
  const isAdmin = userRole === 'ADMIN';

  // Simulation d'un ID d'équipe connecté (à remplacer par votre système d'auth)
  const currentTeamId = 1;

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        console.log(`Chargement des détails du match avec ID: ${matchId}`);
        const matchData = await matchService.getMatchById(matchId);
        console.log("Données du match reçues:", matchData); // Debug

        // Ajouter une structure par défaut pour les propriétés requises si elles sont absentes
        const formattedMatch = {
          ...matchData,
          equipeInitiatrice: matchData.equipeInitiatrice || {
            id: matchData.equipeDomicileId || 0,
            nom: matchData.equipeDomicileNom || 'Équipe domicile'
          },
          equipeAdverse: matchData.equipeAdverse || {
            id: matchData.equipeExterieurId || 0,
            nom: matchData.equipeExterieurNom || 'Équipe extérieur'
          },
          scoreEquipeInitiatrice: matchData.scoreEquipeInitiatrice || matchData.scoreDomicile,
          scoreEquipeAdverse: matchData.scoreEquipeAdverse || matchData.scoreExterieur,
          statut: matchData.statut || 'PLANIFIE'
        };

        console.log("Données du match formatées:", formattedMatch); // Debug
        setMatch(formattedMatch);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching match details:', err);
        setError('Impossible de charger les détails du match. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  const handleScoreUpdate = async (scoreData) => {
    // Vérifier que l'utilisateur est un administrateur
    if (!isAdmin) {
      setError('Vous n\'avez pas les droits pour mettre à jour le score.');
      setShowScoreModal(false);
      return;
    }

    try {
      await matchService.saisirResultat(matchId, scoreData);
      // Rafraîchir les données
      const updatedMatch = await matchService.getMatchById(matchId);
      setMatch(updatedMatch);
      setShowScoreModal(false);
    } catch (err) {
      console.error('Error updating match score:', err);
      setError('Impossible de mettre à jour le score. Veuillez réessayer.');
    }
  };

  const handleFinalizeMatch = async () => {
    // Vérifier que l'utilisateur est un administrateur
    if (!isAdmin) {
      setError('Vous n\'avez pas les droits pour finaliser le match.');
      return;
    }

    try {
      await matchService.finalizeMatch(matchId, { statut: 'JOUE' });
      // Rafraîchir les données
      const updatedMatch = await matchService.getMatchById(matchId);
      setMatch(updatedMatch);
    } catch (err) {
      console.error('Error finalizing match:', err);
      setError('Impossible de finaliser le match. Veuillez réessayer.');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
        <MainLayout>
          <LoadingMessage>Chargement des détails du match...</LoadingMessage>
        </MainLayout>
    );
  }

  if (error) {
    return (
        <MainLayout>
          <MatchContainer>
            <MatchHeader>
              <BackButton buttonType="outlined" onClick={handleGoBack}>Retour</BackButton>
            </MatchHeader>
            <ErrorMessage>{error}</ErrorMessage>
          </MatchContainer>
        </MainLayout>
    );
  }

  if (!match) {
    return (
        <MainLayout>
          <MatchContainer>
            <MatchHeader>
              <BackButton buttonType="outlined" onClick={handleGoBack}>Retour</BackButton>
            </MatchHeader>
            <ErrorMessage>Match non trouvé.</ErrorMessage>
          </MatchContainer>
        </MainLayout>
    );
  }

  // Déterminer si l'équipe actuelle est l'équipe à domicile ou extérieure
  // Utiliser des valeurs par défaut pour éviter les erreurs avec des valeurs undefined
  const isHomeTeam = match?.equipeInitiatrice?.id === currentTeamId;
  const isAwayTeam = match?.equipeAdverse?.id === currentTeamId;

  return (
      <MainLayout>
        <MatchContainer>
          <MatchHeader>
            <div>
              <BackButton buttonType="outlined" variant="secondary" onClick={handleGoBack}>Retour</BackButton>
              <Title>Détails du match</Title>
            </div>
          </MatchHeader>

          <MatchCard>
            <MatchStatus status={match.statut}>{getStatusLabel(match.statut)}</MatchStatus>

            <TeamsContainer>
              <TeamContainer>
                <TeamLogo isHome>{match.equipeInitiatrice?.nom?.charAt(0) || '?'}</TeamLogo>
                <TeamName>{match.equipeInitiatrice?.nom || 'Équipe domicile'}</TeamName>
              </TeamContainer>

              <ScoreContainer>
                <Score isFinished={match.statut === 'JOUE'}>
                  {match.scoreEquipeInitiatrice ?? '-'} - {match.scoreEquipeAdverse ?? '-'}
                </Score>
              </ScoreContainer>

              <TeamContainer>
                <TeamLogo>{match.equipeAdverse?.nom?.charAt(0) || '?'}</TeamLogo>
                <TeamName>{match.equipeAdverse?.nom || 'Équipe extérieur'}</TeamName>
              </TeamContainer>
            </TeamsContainer>

            <DetailsSection>
              <DetailRow>
                <DetailLabel>Date :</DetailLabel>
                <DetailValue>{formatDate(match.dateMatch)}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Heure :</DetailLabel>
                <DetailValue>
                  {formatTime(match.heureDebut)}
                  {formatTime(match.heureDebut) && formatTime(match.heureFin) ? ' - ' : ''}
                  {formatTime(match.heureFin)}
                </DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Terrain :</DetailLabel>
                <DetailValue>{match.terrain || 'Non spécifié'}</DetailValue>
              </DetailRow>

              {match.arbitre && (
                  <DetailRow>
                    <DetailLabel>Arbitre :</DetailLabel>
                    <DetailValue>{match.arbitre}</DetailValue>
                  </DetailRow>
              )}

              {match.notes && (
                  <DetailRow>
                    <DetailLabel>Notes :</DetailLabel>
                    <DetailValue>{match.notes}</DetailValue>
                  </DetailRow>
              )}
            </DetailsSection>

            {isAdmin && (
                <ActionButtons>
                  {match.statut !== 'JOUE' && (
                      <>
                        <Button
                            buttonType="outlined"
                            variant="secondary"
                            onClick={() => setShowScoreModal(true)}
                        >
                          Saisir le score
                        </Button>
                        <Button
                            buttonType="filled"
                            variant="primary"
                            onClick={handleFinalizeMatch}
                        >
                          Finaliser le match
                        </Button>
                      </>
                  )}
                  {match.statut === 'JOUE' && (
                      <Button
                          buttonType="outlined"
                          variant="secondary"
                          onClick={() => setShowScoreModal(true)}
                      >
                        Modifier le score
                      </Button>
                  )}
                </ActionButtons>
            )}
          </MatchCard>
        </MatchContainer>

        {showScoreModal && isAdmin && (
            <ScoreUpdateModal
                match={match}
                onClose={() => setShowScoreModal(false)}
                onSubmit={handleScoreUpdate}
            />
        )}
      </MainLayout>
  );
};

export default MatchDetailPage;