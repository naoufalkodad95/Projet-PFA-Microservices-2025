import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import matchService from '../../services/matchService';
import teamService from '../../services/teamService';
import CalendarGenerator from '../../components/admin/CalendarGenerator';
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

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
`;

const StatsGroup = styled.div`
  display: flex;
  gap: 30px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const StatValue = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

const GenerateButton = styled.button`
  background-color: #25A55F;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #1c8048;
  }
`;

const FormContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
  overflow: hidden;
`;

const FormTitle = styled.div`
  background-color: #f5f5f5;
  padding: 15px;
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
`;

const Form = styled.form`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  grid-column: span 3;
  margin-top: 10px;
`;

const SubmitButton = styled.button`
  background-color: #25A55F;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #1c8048;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ResetButton = styled.button`
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 5px;
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
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.color || '#666'};
  margin: 0 5px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

// Composant modal pour confirmer la suppression
const DeleteConfirmModal = ({ match, onConfirm, onCancel }) => {
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
    color: #d32f2f;
  `;

  const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  `;

  const CancelButton = styled.button`
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ccc;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  `;

  const ConfirmButton = styled.button`
    background-color: #d32f2f;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  `;

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
      <ModalBackdrop>
        <ModalContainer>
          <ModalTitle>Confirmer la suppression</ModalTitle>
          <p>Êtes-vous sûr de vouloir supprimer ce match ?</p>
          <p>
            <strong>Date:</strong> {formatDate(match.dateMatch)}<br />
            <strong>Équipes:</strong> {match.equipeDomicileNom} vs {match.equipeExterieurNom}<br />
            <strong>Terrain:</strong> {match.terrain}
          </p>
          <p>Cette action ne peut pas être annulée.</p>
          <ButtonGroup>
            <CancelButton onClick={onCancel}>Annuler</CancelButton>
            <ConfirmButton onClick={onConfirm}>Supprimer</ConfirmButton>
          </ButtonGroup>
        </ModalContainer>
      </ModalBackdrop>
  );
};

// Composant modal pour éditer un match
const EditMatchModal = ({ match, teams, fields, onSave, onCancel, handleDateChange, highlightedDates }) => {
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
    max-width: 600px;
    padding: 20px;
  `;

  const ModalTitle = styled.h3`
    margin-top: 0;
  `;

  const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  `;

  const CancelButton = styled.button`
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ccc;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  `;

  const SaveButton = styled.button`
    background-color: #25A55F;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  `;

  // État pour le formulaire
  const [formData, setFormData] = useState({
    equipeDomicileId: match.equipeDomicileId.toString(),
    equipeExterieurId: match.equipeExterieurId.toString(),
    dateMatch: '',
    heureMatch: '',
    terrain: match.terrain
  });
  const [errors, setErrors] = useState({});

  // Formater la date et l'heure initiales
  useEffect(() => {
    const dateObj = new Date(match.dateMatch);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    setFormData(prev => ({
      ...prev,
      dateMatch: `${year}-${month}-${day}`,
      heureMatch: `${hours}:${minutes}`
    }));
  }, [match]);

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Effacer les erreurs pour ce champ
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.equipeDomicileId) {
      newErrors.equipeDomicileId = 'Veuillez sélectionner une équipe domicile';
    }

    if (!formData.equipeExterieurId) {
      newErrors.equipeExterieurId = 'Veuillez sélectionner une équipe extérieur';
    }

    if (formData.equipeDomicileId === formData.equipeExterieurId && formData.equipeDomicileId) {
      newErrors.equipeExterieurId = 'Les équipes domicile et extérieur doivent être différentes';
    }

    if (!formData.dateMatch) {
      newErrors.dateMatch = 'La date est requise';
    }

    if (!formData.heureMatch) {
      newErrors.heureMatch = 'L\'heure est requise';
    }

    if (!formData.terrain) {
      newErrors.terrain = 'Le terrain est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Préparer les données pour l'API
    const dateTime = new Date(`${formData.dateMatch}T${formData.heureMatch}`);

    const updatedMatch = {
      ...match,
      equipeDomicileId: parseInt(formData.equipeDomicileId),
      equipeExterieurId: parseInt(formData.equipeExterieurId),
      dateMatch: dateTime.toISOString(),
      terrain: formData.terrain
    };

    onSave(updatedMatch);
  };

  return (
      <ModalBackdrop>
        <ModalContainer>
          <ModalTitle>Modifier le match</ModalTitle>

          <Form onSubmit={(e) => e.preventDefault()}>
            <FormGroup>
              <Label htmlFor="equipeDomicileId">Équipe domicile</Label>
              <Select
                  id="equipeDomicileId"
                  name="equipeDomicileId"
                  value={formData.equipeDomicileId}
                  onChange={handleChange}
              >
                <option value="">Sélectionner une équipe</option>
                {teams.map(team => (
                    <option key={`home-${team.id}`} value={team.id}>
                      {team.nom}
                    </option>
                ))}
              </Select>
              {errors.equipeDomicileId && (
                  <ErrorMessage>{errors.equipeDomicileId}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="equipeExterieurId">Équipe extérieur</Label>
              <Select
                  id="equipeExterieurId"
                  name="equipeExterieurId"
                  value={formData.equipeExterieurId}
                  onChange={handleChange}
              >
                <option value="">Sélectionner une équipe</option>
                {teams.map(team => (
                    <option key={`away-${team.id}`} value={team.id}>
                      {team.nom}
                    </option>
                ))}
              </Select>
              {errors.equipeExterieurId && (
                  <ErrorMessage>{errors.equipeExterieurId}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="terrain">Terrain</Label>
              <Select
                  id="terrain"
                  name="terrain"
                  value={formData.terrain}
                  onChange={handleChange}
              >
                <option value="">Sélectionner un terrain</option>
                {fields.map(field => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                ))}
              </Select>
              {errors.terrain && (
                  <ErrorMessage>{errors.terrain}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="dateMatch">Date du match</Label>
              <CustomDatePicker
                  selectedDate={formData.dateMatch ? new Date(formData.dateMatch) : null}
                  onChange={handleDateChange}
                  highlightedDates={highlightedDates}
                  minDate={new Date()} // Date minimale = aujourd'hui
                  placeholderText="jj/mm/aaaa"
              />
              {errors.dateMatch && (
                  <ErrorMessage>{errors.dateMatch}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="heureMatch">Heure du match</Label>
              <Input
                  type="time"
                  id="heureMatch"
                  name="heureMatch"
                  value={formData.heureMatch}
                  onChange={handleChange}
              />
              {errors.heureMatch && (
                  <ErrorMessage>{errors.heureMatch}</ErrorMessage>
              )}
            </FormGroup>
          </Form>

          <ButtonGroup>
            <CancelButton onClick={onCancel}>Annuler</CancelButton>
            <SaveButton onClick={handleSubmit}>Enregistrer</SaveButton>
          </ButtonGroup>
        </ModalContainer>
      </ModalBackdrop>
  );
};

// Composant principal de planification des matchs
const MatchPlanning = () => {
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    equipeDomicileId: '',
    equipeExterieurId: '',
    dateMatch: '',
    heureMatch: '',
    terrain: ''
  });
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState({
    dateRange: '01/01/2025 - 31/12/2025',
    teamCount: 0,
    matchesPlanned: 0,
    totalMatches: 0,
    status: 'En cours'
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [fields] = useState(['Terrain Foot 1', 'Terrain Foot 2', 'Terrain Foot 3', 'Terrain Foot 4']); // À adapter selon vos besoins

  // États pour les modales
  const [showCalendarGenerator, setShowCalendarGenerator] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Charger les données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Récupérer les équipes
        const teamsData = await teamService.getAllEquipes();
        setTeams(teamsData);

        // Récupérer les matchs
        const matchesData = await matchService.getAllMatchs();
        setMatches(matchesData);

        // Charger les dates à mettre en évidence
        await loadHighlightedDates();

        // Calculer les statistiques...
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);
  const loadHighlightedDates = async () => {
    try {
      // Récupérer tous les matchs pour mettre en évidence les dates
      const allMatches = await matchService.getAllMatchs();

      // Créer les dates à mettre en évidence
      const highlights = allMatches.map(match => {
        const dateObj = new Date(match.dateMatch);
        // On détermine le type de mise en évidence en fonction du statut du match
        let type = 'default';
        if (match.statut === 'JOUE') {
          type = 'custom-1'; // Rouge clair
        } else if (match.statut === 'PLANIFIE') {
          type = 'custom-2'; // Rose
        }
        return { date: dateObj, type };
      });

      setHighlightedDates(highlights);
    } catch (error) {
      console.error('Erreur lors du chargement des dates de match:', error);
    }
  };


  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Effacer les erreurs pour ce champ
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  const handleDateChange = (date) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      setFormData({ ...formData, dateMatch: formattedDate });

      // Effacer l'erreur pour ce champ
      if (errors.dateMatch) {
        setErrors({ ...errors, dateMatch: null });
      }
    } else {
      setFormData({ ...formData, dateMatch: '' });
    }
  };
  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.equipeDomicileId) {
      newErrors.equipeDomicileId = 'Veuillez sélectionner une équipe domicile';
    }

    if (!formData.equipeExterieurId) {
      newErrors.equipeExterieurId = 'Veuillez sélectionner une équipe extérieur';
    }

    if (formData.equipeDomicileId === formData.equipeExterieurId && formData.equipeDomicileId) {
      newErrors.equipeExterieurId = 'Les équipes domicile et extérieur doivent être différentes';
    }

    if (!formData.dateMatch) {
      newErrors.dateMatch = 'La date est requise';
    }

    if (!formData.heureMatch) {
      newErrors.heureMatch = 'L\'heure est requise';
    }

    if (!formData.terrain) {
      newErrors.terrain = 'Le terrain est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Préparer les données pour l'API
      const dateTime = new Date(`${formData.dateMatch}T${formData.heureMatch}`);

      const matchData = {
        equipeDomicileId: parseInt(formData.equipeDomicileId),
        equipeExterieurId: parseInt(formData.equipeExterieurId),
        dateMatch: dateTime.toISOString(),
        terrain: formData.terrain,
        isTournoi: false
      };

      // Créer le match
      const newMatch = await matchService.createMatch(matchData);

      // Mettre à jour l'état
      setMatches([...matches, newMatch]);
      setStats(prev => ({
        ...prev,
        matchesPlanned: prev.matchesPlanned + 1
      }));

      // Réinitialiser le formulaire
      setFormData({
        equipeDomicileId: '',
        equipeExterieurId: '',
        dateMatch: '',
        heureMatch: '',
        terrain: ''
      });

      // Afficher un message de succès
      setSuccessMessage('Match créé avec succès !');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la création du match:', error);
      setErrors({ submit: 'Erreur lors de la création du match. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setFormData({
      equipeDomicileId: '',
      equipeExterieurId: '',
      dateMatch: '',
      heureMatch: '',
      terrain: ''
    });
    setErrors({});
  };

  // Ouvrir la modale de suppression
  const openDeleteModal = (match) => {
    setSelectedMatch(match);
    setShowDeleteModal(true);
  };

  // Ouvrir la modale d'édition
  const openEditModal = (match) => {
    setSelectedMatch(match);
    setShowEditModal(true);
  };

  // Confirmer la suppression d'un match
  const handleDeleteMatch = async () => {
    try {
      setLoading(true);
      await matchService.deleteMatch(selectedMatch.id);

      // Mettre à jour l'état
      setMatches(matches.filter(match => match.id !== selectedMatch.id));
      setStats(prev => ({
        ...prev,
        matchesPlanned: prev.matchesPlanned - 1
      }));

      setSuccessMessage('Match supprimé avec succès !');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du match:', error);
      alert('Erreur lors de la suppression du match. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder un match modifié
  const handleSaveMatch = async (updatedMatch) => {
    try {
      setLoading(true);

      // Mettre à jour le match via l'API
      const result = await matchService.updateMatch(updatedMatch.id, updatedMatch);

      // Mettre à jour l'état
      setMatches(matches.map(match =>
          match.id === updatedMatch.id ? result : match
      ));

      setSuccessMessage('Match mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowEditModal(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du match:', error);
      alert('Erreur lors de la mise à jour du match. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Gérer les matchs générés par le générateur de calendrier
  const handleGeneratedMatches = (generatedMatches) => {
    // Ajouter les matchs générés à la liste
    setMatches([...matches, ...generatedMatches]);

    // Mettre à jour les statistiques
    setStats(prev => ({
      ...prev,
      matchesPlanned: prev.matchesPlanned + generatedMatches.length
    }));

    // Afficher un message de succès
    setSuccessMessage(`${generatedMatches.length} matchs générés avec succès !`);
    setTimeout(() => setSuccessMessage(null), 3000);
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

  // Récupérer le nom d'une équipe par son ID
  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.nom : 'Équipe inconnue';
  };

  if (loading && matches.length === 0) {
    return <LoadingState>Chargement des données...</LoadingState>;
  }

  return (
      <PageContainer>
        <PageTitle>Planification des matchs</PageTitle>

        <StatsContainer>
          <StatsGroup>
            <StatItem>
              <StatLabel>Période:</StatLabel>
              <StatValue>{stats.dateRange}</StatValue>
            </StatItem>

            <StatItem>
              <StatLabel>Équipes:</StatLabel>
              <StatValue>{stats.teamCount}</StatValue>
            </StatItem>

            <StatItem>
              <StatLabel>Matchs planifiés:</StatLabel>
              <StatValue>{stats.matchesPlanned}/{stats.totalMatches}</StatValue>
            </StatItem>
          </StatsGroup>

          <GenerateButton onClick={() => setShowCalendarGenerator(true)}>
            Générer calendrier
          </GenerateButton>
        </StatsContainer>

        {/* Générateur de calendrier */}
        {showCalendarGenerator && (
            <CalendarGenerator
                onClose={() => setShowCalendarGenerator(false)}
                onGenerate={handleGeneratedMatches}
            />
        )}

        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        <FormContainer>
          <FormTitle>Créer un nouveau match</FormTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="equipeDomicileId">Équipe domicile</Label>
              <Select
                  id="equipeDomicileId"
                  name="equipeDomicileId"
                  value={formData.equipeDomicileId}
                  onChange={handleChange}
              >
                <option value="">Sélectionner une équipe</option>
                {teams.map(team => (
                    <option key={`home-${team.id}`} value={team.id}>
                      {team.nom}
                    </option>
                ))}
              </Select>
              {errors.equipeDomicileId && (
                  <ErrorMessage>{errors.equipeDomicileId}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="equipeExterieurId">Équipe extérieur</Label>
              <Select
                  id="equipeExterieurId"
                  name="equipeExterieurId"
                  value={formData.equipeExterieurId}
                  onChange={handleChange}
              >
                <option value="">Sélectionner une équipe</option>
                {teams.map(team => (
                    <option key={`away-${team.id}`} value={team.id}>
                      {team.nom}
                    </option>
                ))}
              </Select>
              {errors.equipeExterieurId && (
                  <ErrorMessage>{errors.equipeExterieurId}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="terrain">Terrain</Label>
              <Select
                  id="terrain"
                  name="terrain"
                  value={formData.terrain}
                  onChange={handleChange}
              >
                <option value="">Sélectionner un terrain</option>
                {fields.map(field => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                ))}
              </Select>
              {errors.terrain && (
                  <ErrorMessage>{errors.terrain}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="dateMatch">Date du match</Label>
              <CustomDatePicker
                  selectedDate={formData.dateMatch ? new Date(formData.dateMatch) : null}
                  onChange={handleDateChange}
                  highlightedDates={highlightedDates}
                  minDate={new Date()} // Date minimale = aujourd'hui
                  placeholderText="jj/mm/aaaa"
              />
              {errors.dateMatch && (
                  <ErrorMessage>{errors.dateMatch}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="heureMatch">Heure du match</Label>
              <Input
                  type="time"
                  id="heureMatch"
                  name="heureMatch"
                  value={formData.heureMatch}
                  onChange={handleChange}
              />
              {errors.heureMatch && (
                  <ErrorMessage>{errors.heureMatch}</ErrorMessage>
              )}
            </FormGroup>

            <ButtonsContainer>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer le match'}
              </SubmitButton>
              <ResetButton type="button" onClick={handleReset}>
                Réinitialiser
              </ResetButton>
            </ButtonsContainer>

            {errors.submit && (
                <ErrorMessage style={{ gridColumn: 'span 3', textAlign: 'center' }}>
                  {errors.submit}
                </ErrorMessage>
            )}
          </Form>
        </FormContainer>

        <TableContainer>
          <TableTitle>Matchs planifiés ({matches.length})</TableTitle>

          {matches.length === 0 ? (
              <p style={{ padding: '20px', textAlign: 'center' }}>
                Aucun match planifié pour le moment
              </p>
          ) : (
              <Table>
                <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Heure</Th>
                  <Th>Équipe domicile</Th>
                  <Th>Équipe extérieur</Th>
                  <Th>Terrain</Th>
                  <Th>Statut</Th>
                  <Th>Actions</Th>
                </tr>
                </thead>
                <tbody>
                {matches.map(match => (
                    <tr key={match.id}>
                      <Td>{formatDate(match.dateMatch)}</Td>
                      <Td>{formatTime(match.dateMatch)}</Td>
                      <Td>
                        {match.equipeDomicileNom || getTeamName(match.equipeDomicileId)}
                      </Td>
                      <Td>
                        {match.equipeExterieurNom || getTeamName(match.equipeExterieurId)}
                      </Td>
                      <Td>{match.terrain}</Td>
                      <Td>
                        {match.statut === 'JOUE' ? 'Joué' :
                            match.statut === 'PLANIFIE' ? 'Planifié' :
                                match.statut === 'ANNULE' ? 'Annulé' :
                                    match.statut}
                      </Td>
                      <Td>
                        <ActionButton
                            title="Modifier"
                            color="#2196f3"
                            onClick={() => openEditModal(match)}
                        >
                          ✎
                        </ActionButton>
                        <ActionButton
                            title="Supprimer"
                            color="#f44336"
                            onClick={() => openDeleteModal(match)}
                        >
                          ✕
                        </ActionButton>
                      </Td>
                    </tr>
                ))}
                </tbody>
              </Table>
          )}
        </TableContainer>

        {/* Modales */}
        {showDeleteModal && selectedMatch && (
            <DeleteConfirmModal
                match={selectedMatch}
                onConfirm={handleDeleteMatch}
                onCancel={() => setShowDeleteModal(false)}
                handleDateChange={handleDateChange}
                highlightedDates={highlightedDates}
            />
        )}

        {showEditModal && selectedMatch && (
            <EditMatchModal
                match={selectedMatch}
                teams={teams}
                fields={fields}
                onSave={handleSaveMatch}
                onCancel={() => setShowEditModal(false)}
            />
        )}
      </PageContainer>
  );
};

export default MatchPlanning;