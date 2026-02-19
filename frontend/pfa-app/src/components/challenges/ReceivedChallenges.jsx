// src/components/challenges/ReceivedChallenges.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../common/Button';
import theme from '../../styles/theme';

const ChallengeBadge = styled.span`
    display: inline-block;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.typography.fontSizes.xs};
    font-weight: ${theme.typography.fontWeights.medium};
    border-radius: ${theme.borderRadius.small};
    text-transform: uppercase;

    ${props => {
        switch (props.status) {
            case 'ACCEPTE':
                return `
          background-color: rgba(37, 165, 95, 0.1);
          color: ${theme.colors.primary};
        `;
            case 'REFUSE':
                return `
          background-color: rgba(211, 84, 0, 0.1);
          color: ${theme.colors.negative};
        `;
            case 'ANNULE':
                return `
          background-color: rgba(0, 0, 0, 0.05);
          color: ${theme.colors.textSecondary};
        `;
            case 'EN_ATTENTE':
            default:
                return `
          background-color: rgba(255, 107, 53, 0.1);
          color: ${theme.colors.secondary};
        `;
        }
    }}
`;

const ChallengesTable = styled.div`
    width: 100%;
    border-radius: ${theme.borderRadius.medium};
    overflow: hidden;
    background-color: ${theme.colors.background};
    box-shadow: ${theme.shadows.small};
    border: 1px solid ${theme.colors.border};
    margin-bottom: ${theme.spacing.lg};
`;

const TableHeader = styled.div`
    padding: ${theme.spacing.md};
    background-color: ${theme.colors.primary};
    color: ${theme.colors.textOnPrimary};
    font-weight: ${theme.typography.fontWeights.medium};
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    gap: ${theme.spacing.md};
`;

const TableBody = styled.div`
    max-height: 600px;
    overflow-y: auto;
`;

const ChallengeRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md};
    border-bottom: 1px solid ${theme.colors.border};
    align-items: center;

    &:nth-child(even) {
        background-color: ${theme.colors.cardBackground};
    }

    &:hover {
        background-color: ${theme.colors.lightPrimary};
    }
`;

const TeamName = styled.div`
    font-weight: ${theme.typography.fontWeights.medium};
    color: ${theme.colors.textPrimary};
`;

const DateInfo = styled.div`
    color: ${theme.colors.textPrimary};
`;

const TimeInfo = styled.div`
    color: ${theme.colors.textPrimary};
`;

const StatusCell = styled.div`
    display: flex;
    align-items: center;
`;

const ActionCell = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing.sm};
`;

const MessageContainer = styled.div`
    margin-top: ${theme.spacing.sm};
    padding: ${theme.spacing.sm};
    background-color: ${theme.colors.lightPrimary};
    border-radius: ${theme.borderRadius.small};
    color: ${theme.colors.textPrimary};
    font-size: ${theme.typography.fontSizes.sm};
`;

const EmptyMessage = styled.div`
    padding: ${theme.spacing.xl};
    text-align: center;
    color: ${theme.colors.textSecondary};
`;

// Fonction pour formater la date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Fonction pour formater l'heure
const formatTime = (timeString) => {
  // Si c'est déjà au format HH:MM
  if (timeString.includes(':')) {
    return timeString;
  }
  // Sinon, c'est probablement un objet JSON avec heure, minute
  try {
    const timeObj = typeof timeString === 'string' ? JSON.parse(timeString) : timeString;
    return `${timeObj.hour.toString().padStart(2, '0')}:${timeObj.minute.toString().padStart(2, '0')}`;
  } catch (e) {
    return timeString; // En cas d'erreur, retourner la chaîne originale
  }
};

// Fonction pour obtenir le label du statut
const getStatusLabel = (status) => {
  switch (status) {
    case 'ACCEPTE': return 'Accepté';
    case 'REFUSE': return 'Refusé';
    case 'ANNULE': return 'Annulé';
    case 'EN_ATTENTE': return 'En attente';
    default: return status;
  }
};

const ReceivedChallenges = ({ challenges = [], onAccept, onRefuse }) => {
  // État pour suivre les défis pour lesquels on affiche le message
  const [expandedChallenges, setExpandedChallenges] = useState({});

  // Fonction pour basculer l'affichage du message
  const toggleMessage = (challengeId) => {
    setExpandedChallenges(prev => ({
      ...prev,
      [challengeId]: !prev[challengeId]
    }));
  };

  // Trier les défis par date (les plus récents d'abord)
  const sortedChallenges = [...challenges].sort((a, b) =>
      new Date(b.dateDefi) - new Date(a.dateDefi));

  return (
      <ChallengesTable>
        <TableHeader>
          <div>Équipe</div>
          <div>Date</div>
          <div>Heure</div>
          <div>Statut</div>
          <div>Actions</div>
        </TableHeader>

        <TableBody>
          {sortedChallenges.length > 0 ? (
              sortedChallenges.map(challenge => (
                  <React.Fragment key={challenge.id}>
                    <ChallengeRow>
                      <TeamName>{challenge.equipeInitiatriceNom}</TeamName>
                      <DateInfo>{formatDate(challenge.dateDefi)}</DateInfo>
                      <TimeInfo>{formatTime(challenge.heureDebut)} - {formatTime(challenge.heureFin)}</TimeInfo>
                      <StatusCell>
                        <ChallengeBadge status={challenge.statut}>
                          {getStatusLabel(challenge.statut)}
                        </ChallengeBadge>
                      </StatusCell>
                      <ActionCell>
                        {challenge.statut === 'EN_ATTENTE' && (
                            <>
                              <Button
                                  buttonType="filled"
                                  variant="primary"
                                  size="small"
                                  onClick={() => onAccept(challenge.id)}
                              >
                                Accepter
                              </Button>
                              <Button
                                  buttonType="outlined"
                                  variant="secondary"
                                  size="small"
                                  onClick={() => onRefuse(challenge.id)}
                              >
                                Refuser
                              </Button>
                            </>
                        )}
                        {challenge.message && (
                            <Button
                                buttonType="text"
                                variant="primary"
                                size="small"
                                onClick={() => toggleMessage(challenge.id)}
                            >
                              {expandedChallenges[challenge.id] ? 'Masquer' : 'Message'}
                            </Button>
                        )}
                        {challenge.statut === 'ACCEPTE' && challenge.matchId && (
                            <Button
                                buttonType="outlined"
                                variant="primary"
                                size="small"
                                as={Link}
                                to={`/matches/${challenge.matchId}`}
                            >
                              Voir Match
                            </Button>
                        )}
                      </ActionCell>
                    </ChallengeRow>
                    {expandedChallenges[challenge.id] && challenge.message && (
                        <ChallengeRow style={{ padding: 0, borderTop: 'none' }}>
                          <MessageContainer style={{ gridColumn: '1 / -1' }}>
                            {challenge.message}
                          </MessageContainer>
                        </ChallengeRow>
                    )}
                  </React.Fragment>
              ))
          ) : (
              <EmptyMessage>Vous n'avez pas de défis reçus.</EmptyMessage>
          )}
        </TableBody>
      </ChallengesTable>
  );
};

export default ReceivedChallenges;