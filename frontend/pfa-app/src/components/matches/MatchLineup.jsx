// src/components/matches/MatchLineup.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import theme from '../../styles/theme';

const LineupContainer = styled.div`
  margin-top: ${theme.spacing.lg};
`;

const LineupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

const LineupTitle = styled.h3`
  font-size: ${theme.typography.fontSizes.lg};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const TeamsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.lg};
`;

const TeamSection = styled.div`
  flex: 1;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
  padding: ${theme.spacing.md};
`;

const TeamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.border};
`;

const TeamName = styled.h4`
  font-size: ${theme.typography.fontSizes.md};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const PlayersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PlayerItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const PlayerName = styled.div`
  font-weight: ${props => props.captain ? theme.typography.fontWeights.bold : theme.typography.fontWeights.regular};
  color: ${theme.colors.textPrimary};
  display: flex;
  align-items: center;
`;

const PlayerNumber = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: ${props => props.isHome ? theme.colors.primary : theme.colors.secondary};
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  font-size: ${theme.typography.fontSizes.sm};
  font-weight: ${theme.typography.fontWeights.medium};
  margin-right: ${theme.spacing.sm};
`;

const PlayerRole = styled.span`
  font-size: ${theme.typography.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  margin-left: ${theme.spacing.sm};
  padding: 2px 6px;
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.borderRadius.small};
`;

const CaptainBadge = styled.span`
  margin-left: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSizes.xs};
  background-color: ${props => props.isHome ? theme.colors.primary : theme.colors.secondary};
  color: white;
  padding: 2px 6px;
  border-radius: ${theme.borderRadius.small};
`;

const NoPlayersMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.md};
  color: ${theme.colors.textSecondary};
  font-style: italic;
`;

const EditButton = styled(Button)`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.typography.fontSizes.xs};
`;

const MatchLineup = ({ match, isAdmin = false, onEditLineup }) => {
  // In a real application, this would come from your API
  // For now, we'll use simulated data
  const [homeTeamPlayers] = useState([
    { id: 1, number: 1, name: "Jean Dupont", position: "Gardien", captain: true },
    { id: 2, number: 5, name: "Paul Martin", position: "Défenseur" },
    { id: 3, number: 7, name: "Michel Blanc", position: "Milieu" },
    { id: 4, number: 9, name: "Thomas Bernard", position: "Attaquant" },
    { id: 5, number: 11, name: "Éric Petit", position: "Attaquant" }
  ]);

  const [awayTeamPlayers] = useState([
    { id: 6, number: 1, name: "Lucas Mercier", position: "Gardien" },
    { id: 7, number: 4, name: "François Dubois", position: "Défenseur", captain: true },
    { id: 8, number: 6, name: "Arthur Leroy", position: "Défenseur" },
    { id: 9, number: 8, name: "Hugo Rousseau", position: "Milieu" },
    { id: 10, number: 10, name: "Nathan Moreau", position: "Attaquant" }
  ]);

  // Check if we have players for each team
  const hasHomeTeamPlayers = homeTeamPlayers && homeTeamPlayers.length > 0;
  const hasAwayTeamPlayers = awayTeamPlayers && awayTeamPlayers.length > 0;

  return (
      <LineupContainer>
        <LineupHeader>
          <LineupTitle>Composition des équipes</LineupTitle>
          {isAdmin && (
              <Button
                  buttonType="outlined"
                  variant="secondary"
                  size="small"
                  onClick={onEditLineup}
              >
                Modifier les compositions
              </Button>
          )}
        </LineupHeader>

        <TeamsRow>
          <TeamSection>
            <TeamHeader>
              <TeamName>{match.equipeInitiatrice.nom}</TeamName>
              {isAdmin && (
                  <EditButton
                      buttonType="text"
                      variant="primary"
                      size="small"
                      onClick={() => onEditLineup(match.equipeInitiatrice.id)}
                  >
                    Modifier
                  </EditButton>
              )}
            </TeamHeader>

            {hasHomeTeamPlayers ? (
                <PlayersList>
                  {homeTeamPlayers.map(player => (
                      <PlayerItem key={player.id}>
                        <PlayerName captain={player.captain}>
                          <PlayerNumber isHome>{player.number}</PlayerNumber>
                          {player.name}
                          {player.captain && (
                              <CaptainBadge isHome>Capitaine</CaptainBadge>
                          )}
                        </PlayerName>
                        <PlayerRole>{player.position}</PlayerRole>
                      </PlayerItem>
                  ))}
                </PlayersList>
            ) : (
                <NoPlayersMessage>
                  Composition d'équipe non définie
                </NoPlayersMessage>
            )}
          </TeamSection>

          <TeamSection>
            <TeamHeader>
              <TeamName>{match.equipeAdverse.nom}</TeamName>
              {isAdmin && (
                  <EditButton
                      buttonType="text"
                      variant="secondary"
                      size="small"
                      onClick={() => onEditLineup(match.equipeAdverse.id)}
                  >
                    Modifier
                  </EditButton>
              )}
            </TeamHeader>

            {hasAwayTeamPlayers ? (
                <PlayersList>
                  {awayTeamPlayers.map(player => (
                      <PlayerItem key={player.id}>
                        <PlayerName captain={player.captain}>
                          <PlayerNumber>{player.number}</PlayerNumber>
                          {player.name}
                          {player.captain && (
                              <CaptainBadge>Capitaine</CaptainBadge>
                          )}
                        </PlayerName>
                        <PlayerRole>{player.position}</PlayerRole>
                      </PlayerItem>
                  ))}
                </PlayersList>
            ) : (
                <NoPlayersMessage>
                  Composition d'équipe non définie
                </NoPlayersMessage>
            )}
          </TeamSection>
        </TeamsRow>
      </LineupContainer>
  );
};

export default MatchLineup;