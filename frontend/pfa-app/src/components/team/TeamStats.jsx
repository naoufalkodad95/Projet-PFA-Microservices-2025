import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import theme from '../../styles/theme';
import { Trophy, Users, Calendar, ThumbsUp, ThumbsDown, Target, Shield, Percent } from 'lucide-react';

const StatsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
    width: 100%;
`;

const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.sm};
`;

const StatsTitle = styled.h2`
    font-size: ${theme.typography.fontSizes.xl};
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
`;

const TeamLogo = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: ${theme.typography.fontWeights.bold};
    box-shadow: ${theme.shadows.medium};
    margin-right: ${theme.spacing.sm};
`;

const StatsRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing.md};
`;

const StatCard = styled.div`
    flex: 1;
    min-width: 120px;
    background-color: ${theme.colors.background};
    border-radius: ${theme.borderRadius.medium};
    padding: ${theme.spacing.md};
    box-shadow: ${theme.shadows.small};
    border: 1px solid ${theme.colors.border};
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
        transform: translateY(-3px);
        box-shadow: ${theme.shadows.medium};
    }

    /* For negative stats (like losses, goals against) */
    ${props => props.isNegative && `
    .stat-value {
      color: ${theme.colors.secondary};
    }
    .stat-icon {
      color: ${theme.colors.secondary};
    }
  `}

    /* For positive stats (like wins, goals for) */
    ${props => props.isPositive && `
    .stat-value {
      color: ${theme.colors.primary};
    }
    .stat-icon {
      color: ${theme.colors.primary};
    }
  `}
`;

const StatLabel = styled.div`
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.textSecondary};
    margin-bottom: ${theme.spacing.xs};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing.xs};
`;

const StatValue = styled.div`
    font-size: ${theme.typography.fontSizes.xl};
    font-weight: ${theme.typography.fontWeights.bold};
    color: inherit;
`;

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: ${theme.spacing.xs};
`;

// French month names
const frenchMonths = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const getCurrentMonth = () => {
  const month = new Date().getMonth();
  return frenchMonths[month];
};

const TeamStats = ({
                     stats = {
                       players: '7/10',
                       points: 24,
                       wins: 8,
                       losses: 3,
                       goalsFor: 35,
                       goalsAgainst: 21,
                       winRate: '73%'
                     },
                     onEditClick,
                     teamInitial = 'T'
                   }) => {
  return (
      <StatsContainer>
        <HeaderRow>
          <StatsTitle>
            Statistiques d'Équipe
          </StatsTitle>
          <Button
              buttonType="outlined"
              variant="primary"
              onClick={onEditClick}
          >
            Modifier l'Équipe
          </Button>
        </HeaderRow>
        <StatsRow>
          <StatCard>
            <IconWrapper>
              <Users size={20} className="stat-icon" />
            </IconWrapper>
            <StatLabel>Joueurs</StatLabel>
            <StatValue className="stat-value">{stats.players}</StatValue>
          </StatCard>
          <StatCard isPositive>
            <IconWrapper>
              <Trophy size={20} className="stat-icon" />
            </IconWrapper>
            <StatLabel>Points</StatLabel>
            <StatValue className="stat-value">{stats.points}</StatValue>
          </StatCard>
          <StatCard isPositive>
            <IconWrapper>
              <ThumbsUp size={20} className="stat-icon" />
            </IconWrapper>
            <StatLabel>Victoires</StatLabel>
            <StatValue className="stat-value">{stats.wins}</StatValue>
          </StatCard>
          <StatCard isNegative>
            <IconWrapper>
              <ThumbsDown size={20} className="stat-icon" />
            </IconWrapper>
            <StatLabel>Défaites</StatLabel>
            <StatValue className="stat-value">{stats.losses}</StatValue>
          </StatCard>
        </StatsRow>
        <StatsRow>
          <StatCard isPositive>
            <IconWrapper>
              <Target size={20} className="stat-icon" />
            </IconWrapper>
            <StatLabel>Buts Pour</StatLabel>
            <StatValue className="stat-value">{stats.goalsFor}</StatValue>
          </StatCard>
          <StatCard isNegative>
            <IconWrapper>
              <Shield size={20} className="stat-icon" />
            </IconWrapper>
            <StatLabel>Buts Contre</StatLabel>
            <StatValue className="stat-value">{stats.goalsAgainst}</StatValue>
          </StatCard>
          <StatCard isPositive>
            <IconWrapper>
              <Percent size={20} className="stat-icon" />
            </IconWrapper>
            <StatLabel>Taux de Victoire</StatLabel>
            <StatValue className="stat-value">{stats.winRate}</StatValue>
          </StatCard>
        </StatsRow>
      </StatsContainer>
  );
};

export default TeamStats;