// src/components/matches/MatchStats.jsx
import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

const StatsContainer = styled.div`
    margin-top: ${theme.spacing.lg};
    padding: ${theme.spacing.lg};
    background-color: ${theme.colors.background};
    border-radius: ${theme.borderRadius.medium};
    box-shadow: ${theme.shadows.small};
    border: 1px solid ${theme.colors.border};
`;

const StatsTitle = styled.h3`
    font-size: ${theme.typography.fontSizes.lg};
    color: ${theme.colors.textPrimary};
    margin-top: 0;
    margin-bottom: ${theme.spacing.md};
    padding-bottom: ${theme.spacing.sm};
    border-bottom: 1px solid ${theme.colors.border};
`;

const StatRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: ${theme.spacing.md};

    &:last-child {
        margin-bottom: 0;
    }
`;

const TeamStat = styled.div`
    flex: 1;
    text-align: ${props => props.align};
    font-weight: ${props => props.isHighlighted ? theme.typography.fontWeights.bold : theme.typography.fontWeights.normal};
    color: ${props => props.isHighlighted ? theme.colors.primary : theme.colors.textPrimary};
`;

const StatLabel = styled.div`
    width: 120px;
    text-align: center;
    color: ${theme.colors.textSecondary};
    font-size: ${theme.typography.fontSizes.sm};
`;

const ProgressBarContainer = styled.div`
    display: flex;
    height: 8px;
    width: 100%;
    background-color: ${theme.colors.cardBackground};
    border-radius: ${theme.borderRadius.small};
    overflow: hidden;
    margin-top: ${theme.spacing.xs};
`;

const ProgressBarLeft = styled.div`
    height: 100%;
    width: ${props => props.width}%;
    background-color: ${theme.colors.primary};
`;

const ProgressBarRight = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background-color: ${theme.colors.secondary};
`;

const NoStatsMessage = styled.div`
  text-align: center;
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.md} 0;
`;

const MatchStats = ({ match, homeTeamId }) => {
  // Si le match n'a pas de statistiques ou n'est pas terminé, on affiche un message
  if (!match.statut === 'TERMINE' || !match.statistiques) {
    return (
        <StatsContainer>
          <StatsTitle>Statistiques</StatsTitle>
          <NoStatsMessage>
            Les statistiques seront disponibles une fois le match terminé.
          </NoStatsMessage>
        </StatsContainer>
    );
  }

  // Création de statistiques simulées pour l'exemple
  // Dans une application réelle, ces données viendraient du backend
  const stats = match.statistiques || {
    possessionEquipeInitiatrice: 55,
    possessionEquipeAdverse: 45,
    tirsEquipeInitiatrice: 12,
    tirsEquipeAdverse: 8,
    tirsCadresEquipeInitiatrice: 7,
    tirsCadresEquipeAdverse: 4,
    fautesEquipeInitiatrice: 5,
    fautesEquipeAdverse: 8,
    cornersEquipeInitiatrice: 6,
    cornersEquipeAdverse: 3
  };

  // Déterminer quelle équipe est l'équipe locale du point de vue de l'utilisateur
  const isHomeTeamInitiator = match.equipeInitiatrice.id === homeTeamId;

  // Permet de déterminer l'ordre d'affichage des statistiques
  const leftTeam = isHomeTeamInitiator ? 'Initiatrice' : 'Adverse';
  const rightTeam = isHomeTeamInitiator ? 'Adverse' : 'Initiatrice';

  // Fonction pour calculer le pourcentage pour les barres de progression
  const calculatePercentage = (leftValue, rightValue) => {
    const total = leftValue + rightValue;
    if (total === 0) return { left: 50, right: 50 };

    const leftPercent = Math.round((leftValue / total) * 100);
    return { left: leftPercent, right: 100 - leftPercent };
  };

  // Générer les statistiques à afficher
  const statsToDisplay = [
    {
      label: 'Possession',
      left: stats[`possessionEquipe${leftTeam}`],
      right: stats[`possessionEquipe${rightTeam}`],
      unit: '%'
    },
    {
      label: 'Tirs',
      left: stats[`tirsEquipe${leftTeam}`],
      right: stats[`tirsEquipe${rightTeam}`]
    },
    {
      label: 'Tirs cadrés',
      left: stats[`tirsCadresEquipe${leftTeam}`],
      right: stats[`tirsCadresEquipe${rightTeam}`]
    },
    {
      label: 'Fautes',
      left: stats[`fautesEquipe${leftTeam}`],
      right: stats[`fautesEquipe${rightTeam}`]
    },
    {
      label: 'Corners',
      left: stats[`cornersEquipe${leftTeam}`],
      right: stats[`cornersEquipe${rightTeam}`]
    }
  ];

  return (
      <StatsContainer>
        <StatsTitle>Statistiques</StatsTitle>

        {statsToDisplay.map((stat, index) => {
          const percentages = calculatePercentage(stat.left, stat.right);

          return (
              <StatRow key={index}>
                <TeamStat align="right" isHighlighted={stat.left > stat.right}>
                  {stat.left}{stat.unit || ''}
                </TeamStat>

                <StatLabel>{stat.label}</StatLabel>

                <TeamStat align="left" isHighlighted={stat.right > stat.left}>
                  {stat.right}{stat.unit || ''}
                </TeamStat>

                <ProgressBarContainer>
                  <ProgressBarLeft width={percentages.left} />
                  <ProgressBarRight width={percentages.right} />
                </ProgressBarContainer>
              </StatRow>
          );
        })}
      </StatsContainer>
  );
};

export default MatchStats;