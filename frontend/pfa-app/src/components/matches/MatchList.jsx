// src/components/matches/MatchList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../common/Button';
import theme from '../../styles/theme';

const MatchesTable = styled.div`
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

const MatchGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const DateSeparator = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.lightPrimary};
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.typography.fontWeights.medium};
  font-size: ${theme.typography.fontSizes.sm};
  border-bottom: 1px solid ${theme.colors.border};
`;

const MatchRow = styled.div`
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

const TeamColumn = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const TeamLogo = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${theme.colors.cardBackground};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.typography.fontWeights.bold};
  font-size: ${theme.typography.fontSizes.sm};
  border: 2px solid ${props => props.isHome ? theme.colors.primary : theme.colors.secondary};
`;

const TeamName = styled.div`
  font-weight: ${props => props.isBold ? theme.typography.fontWeights.medium : 'normal'};
  color: ${theme.colors.textPrimary};
`;

const MatchInfo = styled.div`
  color: ${theme.colors.textPrimary};
`;

const ScoreInfo = styled.div`
  font-weight: ${theme.typography.fontWeights.medium};
  font-size: ${theme.typography.fontSizes.lg};
  color: ${theme.colors.textPrimary};
  display: flex;
  justify-content: center;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.typography.fontSizes.xs};
  font-weight: ${theme.typography.fontWeights.medium};
  border-radius: ${theme.borderRadius.small};
  text-transform: uppercase;

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
      return `
          background-color: rgba(0, 120, 212, 0.1);
          color: #0078D4;
        `;
    default:
      return `
          background-color: rgba(0, 0, 0, 0.1);
          color: ${theme.colors.textSecondary};
        `;
  }
}}
`;

const StatusColumn = styled.div`
  display: flex;
  justify-content: center;
`;

const ActionColumn = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
`;

// Fonction pour formater la date
const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Fonction pour formater l'heure
const formatTime = (timeObj) => {
  if (!timeObj) return '';

  // Gérer les différents formats possibles
  if (typeof timeObj === 'string' && timeObj.includes(':')) {
    return timeObj;
  }

  try {
    const hour = timeObj.hour.toString().padStart(2, '0');
    const minute = timeObj.minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  } catch (e) {
    return timeObj;
  }
};

// Fonction pour obtenir le label du statut
const getStatusLabel = (status) => {
  switch (status) {
    case 'JOUE': return 'Terminé';
    case 'EN_ATTENTE': return 'En attente';
    case 'PLANIFIE': return 'Planifié';
    default: return status;
  }
};

// Regrouper les matchs par date
const groupMatchesByDate = (matches) => {
  const groups = {};

  matches.forEach(match => {
    const date = match.dateMatch;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(match);
  });

  return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .map(([date, matchesList]) => ({
        date,
        matches: matchesList
      }));
};

const MatchList = ({ matches = [], showActions = true, currentTeamId }) => {
  // Regrouper les matchs par date
  const matchesByDate = groupMatchesByDate(matches);

  return (
      <MatchesTable>
        <TableHeader>
          <div>Équipe domicile</div>
          <div>Équipe extérieur</div>
          <div>Date / Heure</div>
          <div>Statut</div>
          <div>Actions</div>
        </TableHeader>

        <TableBody>
          {matchesByDate.length > 0 ? (
              matchesByDate.map((group) => (
                  <MatchGroup key={group.date}>
                    <DateSeparator>{formatDate(group.date)}</DateSeparator>

                    {group.matches.map((match) => {
                      // Déterminer si l'équipe actuelle est domicile ou extérieur
                      const isHomeTeam = match.equipeDomicileId === currentTeamId;
                      const isAwayTeam = match.equipeExterieurId === currentTeamId;

                      return (
                          <MatchRow key={match.id}>
                            <TeamColumn>
                              <TeamLogo isHome>{match.equipeDomicileNom.charAt(0)}</TeamLogo>
                              <TeamName isBold={isHomeTeam}>{match.equipeDomicileNom}</TeamName>
                            </TeamColumn>

                            <TeamColumn>
                              <TeamLogo>{match.equipeExterieurNom.charAt(0)}</TeamLogo>
                              <TeamName isBold={isAwayTeam}>{match.equipeExterieurNom}</TeamName>
                            </TeamColumn>

                            <MatchInfo>
                              {formatTime(match.heureDebut)}
                              {match.terrain && ` - ${match.terrain}`}
                            </MatchInfo>

                            <StatusColumn>
                              {match.statut === 'JOUE' ? (
                                  <ScoreInfo>
                                    {match.scoreDomicile ?? 0} - {match.scoreExterieur ?? 0}
                                  </ScoreInfo>
                              ) : (
                                  <StatusBadge status={match.statut}>
                                    {getStatusLabel(match.statut)}
                                  </StatusBadge>
                              )}
                            </StatusColumn>

                            <ActionColumn>
                              <Button
                                  buttonType="outlined"
                                  variant="primary"
                                  size="small"
                                  as={Link}
                                  to={`/matches/${match.id}`}
                              >
                                Détails
                              </Button>

                              {showActions && (isHomeTeam || isAwayTeam) && match.statut === 'JOUE' && (
                                  <Button
                                      buttonType="outlined"
                                      variant="secondary"
                                      size="small"
                                      as={Link}
                                      to={`/matches/${match.id}`}
                                  >
                                    Voir résultat
                                  </Button>
                              )}
                            </ActionColumn>
                          </MatchRow>
                      );
                    })}
                  </MatchGroup>
              ))
          ) : (
              <MatchRow>
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: theme.spacing.lg }}>
                  Aucun match trouvé.
                </div>
              </MatchRow>
          )}
        </TableBody>
      </MatchesTable>
  );
};

export default MatchList;
