import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import matchService from '../../services/matchService';
import teamService from '../../services/teamService';
import CustomDatePicker from '../../components/admin/CustomDatePicker';

const PageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;

const PageTitle = styled.h1`
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
`;

const FiltersContainer = styled.div`
    display: flex;
    gap: 15px;
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    margin-bottom: 20px;
    flex-wrap: wrap;
`;

const FilterGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const FilterLabel = styled.label`
    font-size: 0.8rem;
    color: #666;
`;

const Select = styled.select`
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
    min-width: 150px;
`;

const Input = styled.input`
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
`;

const Button = styled.button`
    background-color: ${props => props.secondary ? '#f5f5f5' : '#25A55F'};
    color: ${props => props.secondary ? '#333' : 'white'};
    border: ${props => props.secondary ? '1px solid #ccc' : 'none'};
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;

    &:hover {
        background-color: ${props => props.secondary ? '#e0e0e0' : '#1c8048'};
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
        opacity: 0.7;
    }
`;

const ResetFiltersButton = styled(Button)`
    margin-left: auto;
    align-self: flex-end;
`;

const TableContainer = styled.div`
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    overflow: hidden;
`;

const TableTitle = styled.div`
    background-color: #f5f5f5;
    padding: 15px;
    font-weight: bold;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const Th = styled.th`
    text-align: left;
    padding: 12px 15px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    font-weight: 600;
    color: #333;
`;

const Td = styled.td`
    padding: 12px 15px;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: middle;
`;

const ScoreInput = styled.input`
    width: 40px;
    padding: 5px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
`;

const ScoreContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: center;
`;

const DashSpan = styled.span`
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0 5px;
`;

const SaveButton = styled(Button)`
    margin-left: 10px;
`;

const EmptyState = styled.div`
    padding: 40px;
    text-align: center;
    color: #666;
`;

const LoadingState = styled.div`
    text-align: center;
    padding: 20px;
    color: #666;
`;

const Tabs = styled.div`
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.div`
    padding: 10px 20px;
    cursor: pointer;
    border-bottom: ${props => props.active ? '2px solid #25A55F' : '2px solid transparent'};
    color: ${props => props.active ? '#25A55F' : '#333'};
    font-weight: ${props => props.active ? 'bold' : 'normal'};

    &:hover {
        background-color: #f5f5f5;
    }
`;

const Badge = styled.span`
    background-color: ${props => props.color || '#e0e0e0'};
    color: ${props => props.textColor || '#333'};
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
`;

const SuccessMessage = styled.div`
    color: #2e7d32;
    font-size: 0.875rem;
    margin: 10px 0;
    padding: 10px;
    background-color: #e8f5e9;
    border-radius: 4px;
    text-align: center;
`;

// Modale de confirmation
const ConfirmModal = ({ onConfirm, onCancel, match }) => {
  const ModalBackdrop = styled.div`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
  `;

  const ModalContainer = styled.div`
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 450px;
      padding: 20px;
  `;

  const ModalTitle = styled.h3`
      margin-top: 0;
      color: #25A55F;
  `;

  const ModalText = styled.p`
      margin-bottom: 20px;
  `;

  const ButtonGroup = styled.div`
      display: flex;
      justify-content: flex-end;
      gap: 10px;
  `;

  return (
      <ModalBackdrop>
        <ModalContainer>
          <ModalTitle>Confirmer le résultat</ModalTitle>
          <ModalText>
            Vous êtes sur le point de saisir le résultat du match :
            <br /><br />
            <strong>{match.equipeDomicileNom}</strong> {match.scoreDomicile} - {match.scoreExterieur} <strong>{match.equipeExterieurNom}</strong>
            <br /><br />
            Cette action est définitive et le match sera marqué comme joué.
          </ModalText>
          <ButtonGroup>
            <Button secondary onClick={onCancel}>Annuler</Button>
            <Button onClick={onConfirm}>Confirmer</Button>
          </ButtonGroup>
        </ModalContainer>
      </ModalBackdrop>
  );
};

// Composant principal de saisie des résultats
const ResultsEntry = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' ou 'completed'
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // États pour les filtres
  const [filters, setFilters] = useState({
    team: '',
    date: '',
    status: activeTab === 'pending' ? 'PLANIFIE' : 'JOUE'
  });

  // État pour les scores en cours de saisie
  const [scores, setScores] = useState({});

  // État pour les dates à mettre en évidence dans le calendrier
  const [highlightedDates, setHighlightedDates] = useState([]);

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupérer les équipes
        const teamsData = await teamService.getAllEquipes();
        setTeams(teamsData);

        // Récupérer tous les matchs
        const matchesData = await matchService.getAllMatchs();
        setMatches(matchesData);

        // Initialiser les scores pour les matchs en attente
        const initialScores = {};
        matchesData
            .filter(match => match.statut === 'PLANIFIE')
            .forEach(match => {
              initialScores[match.id] = {
                scoreDomicile: match.scoreDomicile || 0,
                scoreExterieur: match.scoreExterieur || 0
              };
            });

        setScores(initialScores);

        // Extraire les dates des matchs pour les mettre en évidence dans le calendrier
        const dates = matchesData.map(match => new Date(match.dateMatch));
        setHighlightedDates(dates);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mise à jour du filtre statut lorsque l'onglet change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      status: activeTab === 'pending' ? 'PLANIFIE' : 'JOUE'
    }));
  }, [activeTab]);

  // Filtrer les matchs en fonction des critères
  const getFilteredMatches = () => {
    return matches.filter(match => {
      // Filtre par statut
      if (filters.status && match.statut !== filters.status) {
        return false;
      }

      // Filtre par équipe
      if (filters.team && match.equipeDomicileId.toString() !== filters.team && match.equipeExterieurId.toString() !== filters.team) {
        return false;
      }

      // Filtre par date
      if (filters.date) {
        const matchDate = new Date(match.dateMatch).toLocaleDateString('fr-CA'); // Format YYYY-MM-DD
        if (matchDate !== filters.date) {
          return false;
        }
      }

      return true;
    });
  };

  // Gérer le changement de filtre
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      team: '',
      date: '',
      status: activeTab === 'pending' ? 'PLANIFIE' : 'JOUE'
    });
  };

  // Gérer le changement de score
  const handleScoreChange = (matchId, team, value) => {
    // Vérifier que la valeur est un nombre >= 0
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      return;
    }

    setScores({
      ...scores,
      [matchId]: {
        ...scores[matchId],
        [team]: numValue
      }
    });
  };

  // Préparer le match pour sauvegarder le score
  const prepareToSaveScore = (match) => {
    // Vérifier que le score est défini
    if (!scores[match.id]) {
      return;
    }

    const updatedMatch = {
      ...match,
      scoreDomicile: scores[match.id].scoreDomicile,
      scoreExterieur: scores[match.id].scoreExterieur
    };

    setSelectedMatch(updatedMatch);
    setShowConfirmModal(true);
  };

  // Sauvegarder le score d'un match
  const saveMatchScore = async () => {
    try {
      setLoading(true);

      const match = selectedMatch;

      // Vérifier que le match et le score sont définis
      if (!match || !scores[match.id]) {
        return;
      }

      // Préparer les données pour l'API
      const resultData = {
        scoreDomicile: scores[match.id].scoreDomicile,
        scoreExterieur: scores[match.id].scoreExterieur
      };

      // Mettre à jour le résultat du match
      const updatedMatch = await matchService.saisirResultat(match.id, resultData);

      // Mettre à jour l'état local
      setMatches(matches.map(m => m.id === match.id ? updatedMatch : m));

      setSuccessMessage('Résultat enregistré avec succès !');
      setTimeout(() => setSuccessMessage(null), 3000);

      // Fermer la modale
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Erreur lors de la saisie du résultat:', error);
      alert('Erreur lors de la saisie du résultat. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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

  // Obtenir le badge de statut
  const getStatusBadge = (status) => {
    switch (status) {
      case 'JOUE':
        return <Badge color="#e8f5e9" textColor="#2e7d32">Joué</Badge>;
      case 'PLANIFIE':
        return <Badge color="#e3f2fd" textColor="#1565c0">Planifié</Badge>;
      case 'ANNULE':
        return <Badge color="#ffebee" textColor="#c62828">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Filtrer les matchs
  const filteredMatches = getFilteredMatches();

  if (loading && matches.length === 0) {
    return <LoadingState>Chargement des données...</LoadingState>;
  }

  return (
      <PageContainer>
        <PageTitle>Saisie des résultats</PageTitle>

        <Tabs>
          <Tab
              active={activeTab === 'pending'}
              onClick={() => setActiveTab('pending')}
          >
            Matchs en attente
          </Tab>
          <Tab
              active={activeTab === 'completed'}
              onClick={() => setActiveTab('completed')}
          >
            Matchs terminés
          </Tab>
        </Tabs>

        <FiltersContainer>
          <FilterGroup>
            <FilterLabel htmlFor="team">Équipe</FilterLabel>
            <Select
                id="team"
                name="team"
                value={filters.team}
                onChange={handleFilterChange}
            >
              <option value="">Toutes les équipes</option>
              {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.nom}
                  </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel htmlFor="date">Date</FilterLabel>
            <CustomDatePicker
                selectedDate={filters.date ? new Date(filters.date) : null}
                onChange={(date) => {
                  // Convertir la date en format YYYY-MM-DD pour les filtres
                  if (date) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const formattedDate = `${year}-${month}-${day}`;
                    handleFilterChange({ target: { name: 'date', value: formattedDate } });
                  } else {
                    handleFilterChange({ target: { name: 'date', value: '' } });
                  }
                }}
                highlightedDates={highlightedDates}
                placeholderText="jj/mm/aaaa"
            />
          </FilterGroup>

          <ResetFiltersButton
              type="button"
              secondary
              onClick={resetFilters}
          >
            Réinitialiser les filtres
          </ResetFiltersButton>
        </FiltersContainer>

        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        <TableContainer>
          <TableTitle>
            {activeTab === 'pending' ? 'Matchs en attente de résultat' : 'Matchs terminés'}
            ({filteredMatches.length})
          </TableTitle>

          {filteredMatches.length === 0 ? (
              <EmptyState>
                {activeTab === 'pending'
                    ? 'Aucun match en attente de résultat'
                    : 'Aucun match terminé correspondant aux critères'}
              </EmptyState>
          ) : (
              <Table>
                <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Équipe domicile</Th>
                  <Th>Score</Th>
                  <Th>Équipe extérieur</Th>
                  <Th>Terrain</Th>
                  <Th>Statut</Th>
                </tr>
                </thead>
                <tbody>
                {filteredMatches.map(match => (
                    <tr key={match.id}>
                      <Td>
                        {formatDate(match.dateMatch)}
                        <br />
                        <small>{formatTime(match.dateMatch)}</small>
                      </Td>
                      <Td>{match.equipeDomicileNom}</Td>
                      <Td>
                        {activeTab === 'pending' ? (
                            <ScoreContainer>
                              <ScoreInput
                                  type="number"
                                  min="0"
                                  value={scores[match.id]?.scoreDomicile || 0}
                                  onChange={(e) => handleScoreChange(match.id, 'scoreDomicile', e.target.value)}
                              />
                              <DashSpan>-</DashSpan>
                              <ScoreInput
                                  type="number"
                                  min="0"
                                  value={scores[match.id]?.scoreExterieur || 0}
                                  onChange={(e) => handleScoreChange(match.id, 'scoreExterieur', e.target.value)}
                              />
                              <SaveButton
                                  onClick={() => prepareToSaveScore(match)}
                                  disabled={loading}
                              >
                                Sauvegarder
                              </SaveButton>
                            </ScoreContainer>
                        ) : (
                            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                              {match.scoreDomicile} - {match.scoreExterieur}
                            </div>
                        )}
                      </Td>
                      <Td>{match.equipeExterieurNom}</Td>
                      <Td>{match.terrain}</Td>
                      <Td>{getStatusBadge(match.statut)}</Td>
                    </tr>
                ))}
                </tbody>
              </Table>
          )}
        </TableContainer>

        {/* Modale de confirmation */}
        {showConfirmModal && selectedMatch && (
            <ConfirmModal
                match={selectedMatch}
                onConfirm={saveMatchScore}
                onCancel={() => setShowConfirmModal(false)}
            />
        )}
      </PageContainer>
  );
};

export default ResultsEntry;