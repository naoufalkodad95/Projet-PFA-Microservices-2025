import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import matchService from '../../services/matchService';
import teamService from '../../services/teamService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Styled Components
const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #1a1a1a;
  margin: 0;
  font-weight: 700;
`;

const PeriodSelector = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 8px 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const PeriodButton = styled.button`
  background: ${props => props.active ? '#25A55F' : 'transparent'};
  color: ${props => props.active ? 'white' : '#555'};
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#25A55F' : '#f0f0f0'};
  }
  
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
`;

const StatIconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.bgColor || '#e6f7ef'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
`;

const StatIcon = styled.div`
  font-size: 1.6rem;
  color: ${props => props.color || '#25A55F'};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #1a1a1a;
`;

const StatLabel = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 2px 0;
`;

const StatChange = styled.span`
  font-size: 0.8rem;
  color: ${props => props.positive ? '#25A55F' : '#e74c3c'};
  display: flex;
  align-items: center;
  
  &::before {
    content: ${props => props.positive ? '"↑"' : '"↓"'};
    margin-right: 4px;
  }
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: ${props => props.height || 'auto'};
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ChartTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const ChartDescription = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin: 4px 0 0 0;
`;

const ChartFilter = styled.select`
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  background: #fff;
  color: #333;
`;

const RecentMatchesCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const RecentMatchesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
`;

const RecentMatchesList = styled.div`
  max-height: 390px;
  overflow-y: auto;
`;

const MatchItem = styled.div`
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MatchDateLabel = styled.div`
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 6px;
`;

const MatchTeams = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const TeamName = styled.span`
  font-weight: 500;
  font-size: 0.95rem;
  color: #333;
`;

const MatchScore = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  margin: 0 10px;
  
  span {
    background-color: ${props => props.played ? '#f5f5f5' : 'transparent'};
    padding: ${props => props.played ? '2px 8px' : '0'};
    border-radius: ${props => props.played ? '4px' : '0'};
  }
`;

const MatchDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #666;
`;

const MatchStatusBadge = styled.span`
  background-color: ${props =>
    props.status === 'JOUE' ? '#e6f7ef' :
        props.status === 'PLANIFIE' ? '#e3f2fd' :
            props.status === 'ANNULE' ? '#ffebee' : '#f5f5f5'};
  color: ${props =>
    props.status === 'JOUE' ? '#25A55F' :
        props.status === 'PLANIFIE' ? '#2196f3' :
            props.status === 'ANNULE' ? '#f44336' : '#757575'};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ViewAllLink = styled(Link)`
  font-size: 0.85rem;
  color: #25A55F;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
  
  &::after {
    content: '→';
    margin-left: 4px;
  }
`;

const ActivityStreamCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  grid-column: span 1;
`;

const ActivityHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
`;

const ActivityList = styled.div`
  padding: 4px 0;
  max-height: 390px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  padding: 12px 20px;
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => {
  switch (props.type) {
    case 'MATCH_CREATED': return '#e3f2fd';
    case 'RESULT_ENTERED': return '#e6f7ef';
    case 'CHALLENGE_ACCEPTED': return '#fff8e1';
    default: return '#f5f5f5';
  }
}};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  color: ${props => {
  switch (props.type) {
    case 'MATCH_CREATED': return '#2196f3';
    case 'RESULT_ENTERED': return '#25A55F';
    case 'CHALLENGE_ACCEPTED': return '#ff9800';
    default: return '#757575';
  }
}};
  font-size: 1.2rem;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.p`
  margin: 0 0 4px;
  font-size: 0.9rem;
  color: #333;
`;

const ActivityTime = styled.span`
  font-size: 0.75rem;
  color: #999;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  font-size: 1.1rem;
  color: #666;
`;

// Dashboard Component
const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // week, month, year
  const [chartFilter, setChartFilter] = useState('all'); // all, played, upcoming
  const [terrainFilter, setTerrainFilter] = useState('all');

  const [stats, setStats] = useState({
    teams: 0,
    matches: {
      total: 0,
      played: 0,
      upcoming: 0
    },
    fields: []
  });

  const [matchesData, setMatchesData] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [activities, setActivities] = useState([]);
  const [fieldUtilization, setFieldUtilization] = useState([]);

  // Simuler des données d'évolution pour le graphique
  const [trendsData, setTrendsData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Récupérer les matchs
        const matches = await matchService.getAllMatchs();

        // Récupérer les équipes
        const teams = await teamService.getAllEquipes();

        // Filtrer les matchs selon la période sélectionnée
        const filteredMatches = filterMatchesByPeriod(matches, period);

        // Créer les données pour le graphique
        const chartData = createChartData(filteredMatches);
        setMatchesData(chartData);

        // Traiter les stats
        const playedMatches = matches.filter(match => match.statut === 'JOUE');
        const upcomingMatches = matches.filter(match => match.statut !== 'JOUE');

        // Compter les matchs par terrain
        const fieldCounts = countMatchesByField(matches);
        setFieldUtilization(fieldCounts);

        // Traiter les statistiques d'équipes
        const teamStats = calculateTeamStats(teams, matches);

        // Trier les matchs par date
        const sortedMatches = [...matches].sort((a, b) =>
            new Date(b.dateMatch) - new Date(a.dateMatch)
        );

        // Récents matchs joués et à venir
        const recentPlayed = sortedMatches
            .filter(match => match.statut === 'JOUE')
            .slice(0, 3);

        const upcoming = sortedMatches
            .filter(match => match.statut !== 'JOUE')
            .sort((a, b) => new Date(a.dateMatch) - new Date(b.dateMatch))
            .slice(0, 4);

        // Combiner et trier par date
        const combinedRecent = [...recentPlayed, ...upcoming]
            .sort((a, b) => new Date(a.dateMatch) - new Date(b.dateMatch));

        setRecentMatches(combinedRecent);

        // Créer des activités simulées
        const mockActivities = generateMockActivities(matches);
        setActivities(mockActivities);

        // Mettre à jour les données d'évolution
        const trends = generateTrendsData(period);
        setTrendsData(trends);

        // Mettre à jour les stats
        setStats({
          teams: teams.length,
          matches: {
            total: matches.length,
            played: playedMatches.length,
            upcoming: upcomingMatches.length
          },
          fields: fieldCounts
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données du tableau de bord:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [period]);

  // Filtrer les matchs selon la période
  const filterMatchesByPeriod = (matches, period) => {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // Toutes les dates
    }

    return matches.filter(match => new Date(match.dateMatch) >= startDate);
  };

  // Créer les données pour le graphique
  const createChartData = (matches) => {
    // Organiser les matchs par semaine ou par mois selon la période
    const dataByDate = {};

    matches.forEach(match => {
      const date = new Date(match.dateMatch);
      let key;

      if (period === 'week') {
        // Regrouper par jour
        key = date.toISOString().split('T')[0];
      } else if (period === 'month') {
        // Regrouper par semaine
        const weekNumber = Math.ceil((date.getDate()) / 7);
        key = `Sem ${weekNumber}`;
      } else {
        // Regrouper par mois
        key = date.toLocaleDateString('fr-FR', { month: 'short' });
      }

      if (!dataByDate[key]) {
        dataByDate[key] = { played: 0, upcoming: 0, name: key };
      }

      if (match.statut === 'JOUE') {
        dataByDate[key].played++;
      } else {
        dataByDate[key].upcoming++;
      }
    });

    // Convertir en tableau
    return Object.values(dataByDate);
  };

  // Compter les matchs par terrain
  const countMatchesByField = (matches) => {
    const counts = {};

    matches.forEach(match => {
      if (!counts[match.terrain]) {
        counts[match.terrain] = { name: match.terrain, count: 0 };
      }
      counts[match.terrain].count++;
    });

    return Object.values(counts);
  };

  // Calculer les statistiques d'équipes
  const calculateTeamStats = (teams, matches) => {
    const teamStats = {};

    teams.forEach(team => {
      teamStats[team.id] = {
        id: team.id,
        name: team.nom,
        matchesPlayed: 0,
        matchesWon: 0,
        matchesLost: 0,
        matchesTied: 0
      };
    });

    matches.forEach(match => {
      if (match.statut === 'JOUE') {
        // Équipe domicile
        if (teamStats[match.equipeDomicileId]) {
          teamStats[match.equipeDomicileId].matchesPlayed++;

          if (match.scoreDomicile > match.scoreExterieur) {
            teamStats[match.equipeDomicileId].matchesWon++;
          } else if (match.scoreDomicile < match.scoreExterieur) {
            teamStats[match.equipeDomicileId].matchesLost++;
          } else {
            teamStats[match.equipeDomicileId].matchesTied++;
          }
        }

        // Équipe extérieur
        if (teamStats[match.equipeExterieurId]) {
          teamStats[match.equipeExterieurId].matchesPlayed++;

          if (match.scoreDomicile < match.scoreExterieur) {
            teamStats[match.equipeExterieurId].matchesWon++;
          } else if (match.scoreDomicile > match.scoreExterieur) {
            teamStats[match.equipeExterieurId].matchesLost++;
          } else {
            teamStats[match.equipeExterieurId].matchesTied++;
          }
        }
      }
    });

    return Object.values(teamStats);
  };

  // Générer des activités simulées
  const generateMockActivities = (matches) => {
    const recentMatches = [...matches]
        .sort((a, b) => new Date(b.dateMatch) - new Date(a.dateMatch))
        .slice(0, 8);

    const activities = [];

    recentMatches.forEach((match, index) => {
      const date = new Date(match.dateMatch);
      const now = new Date();
      const timeAgo = Math.floor((now - date) / (1000 * 60 * 60)); // Heures

      let activity;

      if (match.statut === 'JOUE') {
        activity = {
          id: `activity-${index}-1`,
          type: 'RESULT_ENTERED',
          description: `Résultat saisi: ${match.equipeDomicileNom} ${match.scoreDomicile} - ${match.scoreExterieur} ${match.equipeExterieurNom}`,
          time: timeAgo <= 24 ? `${timeAgo}h` : `${Math.floor(timeAgo / 24)}j`,
          icon: '🏆'
        };
      } else {
        activity = {
          id: `activity-${index}-2`,
          type: 'MATCH_CREATED',
          description: `Match planifié: ${match.equipeDomicileNom} vs ${match.equipeExterieurNom}`,
          time: timeAgo <= 24 ? `${timeAgo}h` : `${Math.floor(timeAgo / 24)}j`,
          icon: '📅'
        };
      }

      activities.push(activity);

      // Ajouter quelques défis acceptés
      if (index % 3 === 0) {
        activities.push({
          id: `activity-${index}-3`,
          type: 'CHALLENGE_ACCEPTED',
          description: `Défi accepté: ${match.equipeDomicileNom} vs ${match.equipeExterieurNom}`,
          time: timeAgo <= 24 ? `${timeAgo + 2}h` : `${Math.floor((timeAgo + 2) / 24)}j`,
          icon: '🤝'
        });
      }
    });

    // Trier par heure (les plus récents en premier)
    return activities.sort((a, b) => {
      const aTime = parseInt(a.time.replace('h', '').replace('j', ''));
      const bTime = parseInt(b.time.replace('h', '').replace('j', ''));
      return aTime - bTime;
    }).slice(0, 10);
  };

  // Générer des données de tendance simulées
  const generateTrendsData = (period) => {
    const data = [];
    const now = new Date();
    let count = 0;

    switch (period) {
      case 'week':
        // 7 derniers jours
        count = 7;
        for (let i = 0; i < count; i++) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          data.unshift({
            name: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
            matches: Math.floor(Math.random() * 3) + 1,
            players: Math.floor(Math.random() * 5) + 10
          });
        }
        break;
      case 'month':
        // 4 dernières semaines
        count = 4;
        for (let i = 0; i < count; i++) {
          data.unshift({
            name: `Sem ${i + 1}`,
            matches: Math.floor(Math.random() * 8) + 3,
            players: Math.floor(Math.random() * 15) + 25
          });
        }
        break;
      case 'year':
        // 12 derniers mois
        count = 12;
        for (let i = 0; i < count; i++) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - i);
          data.unshift({
            name: date.toLocaleDateString('fr-FR', { month: 'short' }),
            matches: Math.floor(Math.random() * 15) + 5,
            players: Math.floor(Math.random() * 30) + 40
          });
        }
        break;
      default:
        return [];
    }

    return data;
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  // Formater l'heure
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Couleurs pour les graphiques
  const COLORS = ['#25A55F', '#2196f3', '#ff9800', '#9c27b0', '#f44336'];

  if (loading) {
    return <LoadingState>Chargement du tableau de bord...</LoadingState>;
  }

  return (
      <DashboardContainer>
        <DashboardHeader>
          <Title>Tableau de bord administrateur</Title>
          <PeriodSelector>
            <PeriodButton
                active={period === 'week'}
                onClick={() => setPeriod('week')}
            >
              Semaine
            </PeriodButton>
            <PeriodButton
                active={period === 'month'}
                onClick={() => setPeriod('month')}
            >
              Mois
            </PeriodButton>
            <PeriodButton
                active={period === 'year'}
                onClick={() => setPeriod('year')}
            >
              Année
            </PeriodButton>
          </PeriodSelector>
        </DashboardHeader>

        <StatsGrid>
          <StatCard>
            <StatIconWrapper bgColor="#e6f7ef">
              <StatIcon color="#25A55F">👥</StatIcon>
            </StatIconWrapper>
            <StatContent>
              <StatValue>{stats.teams}</StatValue>
              <StatLabel>Équipes actives</StatLabel>
              <StatChange positive>+2 ce mois</StatChange>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIconWrapper bgColor="#e3f2fd">
              <StatIcon color="#2196f3">🏆</StatIcon>
            </StatIconWrapper>
            <StatContent>
              <StatValue>{stats.matches.total}</StatValue>
              <StatLabel>Matchs planifiés</StatLabel>
              <StatChange positive>+5 cette semaine</StatChange>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIconWrapper bgColor="#fff8e1">
              <StatIcon color="#ff9800">⚽</StatIcon>
            </StatIconWrapper>
            <StatContent>
              <StatValue>{stats.matches.played}</StatValue>
              <StatLabel>Matchs joués</StatLabel>
              <StatChange positive>+3 cette semaine</StatChange>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIconWrapper bgColor="#f3e5f5">
              <StatIcon color="#9c27b0">🏟️</StatIcon>
            </StatIconWrapper>
            <StatContent>
              <StatValue>{stats.fields.length}</StatValue>
              <StatLabel>Terrains utilisés</StatLabel>
              <StatChange>Utilisation stable</StatChange>
            </StatContent>
          </StatCard>
        </StatsGrid>

        <GridRow>
          <ChartCard height="420px">
            <ChartHeader>
              <div>
                <ChartTitle>Évolution des matchs</ChartTitle>
                <ChartDescription>
                  {period === 'week' ? 'Derniers 7 jours' :
                      period === 'month' ? 'Dernier mois' : 'Dernière année'}
                </ChartDescription>
              </div>
              <ChartFilter
                  value={chartFilter}
                  onChange={e => setChartFilter(e.target.value)}
              >
                <option value="all">Tous les matchs</option>
                <option value="played">Matchs joués</option>
                <option value="upcoming">Matchs à venir</option>
              </ChartFilter>
            </ChartHeader>

            <ResponsiveContainer width="100%" height={340}>
              <LineChart
                  data={trendsData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="matches"
                    name="Matchs"
                    stroke="#25A55F"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                />
                <Line
                    type="monotone"
                    dataKey="players"
                    name="Joueurs actifs"
                    stroke="#2196f3"
                    strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ActivityStreamCard>
            <ActivityHeader>
              <ChartTitle>Activités récentes</ChartTitle>
            </ActivityHeader>

            <ActivityList>
              {activities.map(activity => (
                  <ActivityItem key={activity.id}>
                    <ActivityIconWrapper type={activity.type}>
                      {activity.icon}
                    </ActivityIconWrapper>
                    <ActivityContent>
                      <ActivityText>{activity.description}</ActivityText>
                      <ActivityTime>Il y a {activity.time}</ActivityTime>
                    </ActivityContent>
                  </ActivityItem>
              ))}
            </ActivityList>
          </ActivityStreamCard>
        </GridRow>

        <GridRow>
          <ChartCard>
            <ChartHeader>
              <div>
                <ChartTitle>Utilisation des terrains</ChartTitle>
                <ChartDescription>Répartition des matchs par terrain</ChartDescription>
              </div>
              <ChartFilter
                  value={terrainFilter}
                  onChange={e => setTerrainFilter(e.target.value)}
              >
                <option value="all">Tous les terrains</option>
                {stats.fields.map(field => (
                    <option key={field.name} value={field.name}>{field.name}</option>
                ))}
              </ChartFilter>
            </ChartHeader>

            <div style={{ display: 'flex', height: "280px" }}>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                      data={fieldUtilization}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Matchs" fill="#25A55F">
                      {fieldUtilization.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ width: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Pie
                        data={fieldUtilization}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                    >
                      {fieldUtilization.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartCard>
        </GridRow>

        <RecentMatchesCard>
          <RecentMatchesHeader>
            <ChartTitle>Matchs récents et à venir</ChartTitle>
            <ViewAllLink to="/admin/matches">Voir tous les matchs</ViewAllLink>
          </RecentMatchesHeader>

          <RecentMatchesList>
            {recentMatches.map(match => (
                <MatchItem key={match.id}>
                  <MatchDateLabel>
                    {formatDate(match.dateMatch)} • {formatTime(match.dateMatch)} • {match.terrain}
                  </MatchDateLabel>

                  <MatchTeams>
                    <TeamName>{match.equipeDomicileNom}</TeamName>
                    <MatchScore played={match.statut === 'JOUE'}>
                  <span>
                    {match.statut === 'JOUE'
                        ? `${match.scoreDomicile} - ${match.scoreExterieur}`
                        : 'vs'
                    }
                  </span>
                    </MatchScore>
                    <TeamName>{match.equipeExterieurNom}</TeamName>
                  </MatchTeams>

                  <MatchDetails>
                    <MatchStatusBadge status={match.statut}>
                      {match.statut === 'JOUE' ? 'Joué' :
                          match.statut === 'PLANIFIE' ? 'Planifié' :
                              match.statut === 'ANNULE' ? 'Annulé' :
                                  match.statut}
                    </MatchStatusBadge>

                    {match.statut !== 'JOUE' && (
                        <Link to={`/admin/matches?edit=${match.id}`} style={{ fontSize: '0.8rem', color: '#2196f3' }}>
                          Modifier
                        </Link>
                    )}
                  </MatchDetails>
                </MatchItem>
            ))}
          </RecentMatchesList>
        </RecentMatchesCard>
      </DashboardContainer>
  );
};

export default AdminDashboard;