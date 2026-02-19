// src/components/matches/CreateMatchModal.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import theme from '../../styles/theme';
import matchService from '../../services/matchService';
import teamService from '../../services/teamService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.large};
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.textPrimary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.typography.fontSizes.xl};
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  
  &:hover {
    color: ${theme.colors.negative};
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing.lg};
`;

const ModalFooter = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.sm};
  font-weight: ${theme.typography.fontWeights.medium};
  color: ${theme.colors.textPrimary};
`;

const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSizes.md};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const FieldRow = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  
  > * {
    flex: 1;
  }
`;

const ErrorMessage = styled.div`
  margin-top: ${theme.spacing.sm};
  color: ${theme.colors.negative};
  font-size: ${theme.typography.fontSizes.sm};
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  padding: ${theme.spacing.lg};
  color: ${theme.colors.textSecondary};
`;

// Fonction pour obtenir la date d'aujourd'hui au format YYYY-MM-DD
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Fonction pour obtenir l'heure actuelle au format HH:MM
const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Fonction pour ajouter des heures à une heure donnée
const addHoursToTime = (timeString, hoursToAdd) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  let newHours = hours + hoursToAdd;

  // Gestion du dépassement de 24h
  if (newHours >= 24) {
    newHours = newHours - 24;
  }

  return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const CreateMatchModal = ({ onClose, onSubmit, currentTeamId }) => {
  // États du formulaire
  const [formData, setFormData] = useState({
    equipeInitiatriceId: currentTeamId,
    equipeAdverseId: '',
    dateMatch: getTodayDate(),
    heureDebut: getCurrentTime(),
    heureFin: addHoursToTime(getCurrentTime(), 1),
    terrain: '',
    arbitre: '',
    notes: ''
  });

  const [teams, setTeams] = useState([]);
  const [availableTerrains, setAvailableTerrains] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingTerrain, setIsCheckingTerrain] = useState(false);
  const [isHomeTeam, setIsHomeTeam] = useState(true);

  // Récupérer la liste des équipes
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await teamService.getAllEquipes();
        setTeams(teamsData.filter(team => team.id !== currentTeamId));
      } catch (error) {
        console.error('Error fetching teams:', error);
        setErrors(prev => ({ ...prev, teams: 'Impossible de charger la liste des équipes.' }));
      }
    };

    fetchTeams();
  }, [currentTeamId]);

  // Récupérer la liste des terrains disponibles
  useEffect(() => {
    // Dans une application réelle, vous pourriez récupérer cette liste depuis l'API
    setAvailableTerrains([
      'Terrain 1',
      'Terrain 2',
      'Terrain 3',
      'Terrain 4'
    ]);
  }, []);

  // Gestion du changement des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Si l'erreur existe, la supprimer quand l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    // Si l'heure de début est modifiée, mettre à jour l'heure de fin automatiquement
    if (name === 'heureDebut') {
      setFormData(prev => ({ ...prev, heureFin: addHoursToTime(value, 1) }));
    }
  };

  // Gestion du changement d'équipe domicile/extérieur
  const handleTeamTypeChange = (e) => {
    const value = e.target.value === 'true';
    setIsHomeTeam(value);

    if (value) {
      // Si on est l'équipe domicile
      setFormData(prev => ({
        ...prev,
        equipeInitiatriceId: currentTeamId,
        equipeAdverseId: prev.equipeAdverseId || ''
      }));
    } else {
      // Si on est l'équipe extérieure
      setFormData(prev => ({
        ...prev,
        equipeInitiatriceId: prev.equipeAdverseId || '',
        equipeAdverseId: currentTeamId
      }));
    }
  };

  // Vérifier la disponibilité du terrain
  const checkTerrainAvailability = async () => {
    if (!formData.terrain || !formData.dateMatch || !formData.heureDebut || !formData.heureFin) {
      return true; // Ne pas vérifier si toutes les données ne sont pas présentes
    }

    try {
      setIsCheckingTerrain(true);

      const dateDebut = new Date(`${formData.dateMatch}T${formData.heureDebut}`);
      const dateFin = new Date(`${formData.dateMatch}T${formData.heureFin}`);

      const isAvailable = await matchService.isTerrainDisponible(
          formData.terrain,
          dateDebut,
          dateFin
      );

      setIsCheckingTerrain(false);
      return isAvailable;
    } catch (error) {
      console.error('Error checking terrain availability:', error);
      setIsCheckingTerrain(false);
      return false;
    }
  };

  // Validation du formulaire
  const validateForm = async () => {
    const newErrors = {};

    // Validation de base
    if (!formData.equipeAdverseId) {
      newErrors.equipeAdverseId = 'Veuillez sélectionner une équipe adverse';
    }

    if (!formData.dateMatch) {
      newErrors.dateMatch = 'Veuillez sélectionner une date';
    }

    if (!formData.heureDebut) {
      newErrors.heureDebut = 'Veuillez sélectionner une heure de début';
    }

    if (!formData.heureFin) {
      newErrors.heureFin = 'Veuillez sélectionner une heure de fin';
    }

    if (!formData.terrain) {
      newErrors.terrain = 'Veuillez sélectionner un terrain';
    }

    // Vérifier que l'heure de fin est après l'heure de début
    if (formData.heureDebut && formData.heureFin) {
      if (formData.heureDebut >= formData.heureFin) {
        newErrors.heureFin = 'L\'heure de fin doit être postérieure à l\'heure de début';
      }
    }

    // Vérifier la disponibilité du terrain
    if (formData.terrain && formData.dateMatch && formData.heureDebut && formData.heureFin) {
      const isTerrainAvailable = await checkTerrainAvailability();
      if (!isTerrainAvailable) {
        newErrors.terrain = 'Ce terrain n\'est pas disponible à cette date/heure';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    const isValid = await validateForm();

    if (isValid) {
      try {
        setIsSubmitting(true);

        // Adapter le format des données pour l'API
        const matchData = {
          equipeInitiatriceId: parseInt(formData.equipeInitiatriceId),
          equipeAdverseId: parseInt(formData.equipeAdverseId),
          dateMatch: formData.dateMatch,
          heureDebut: formData.heureDebut,
          heureFin: formData.heureFin,
          terrain: formData.terrain,
          arbitre: formData.arbitre.trim() || null,
          notes: formData.notes.trim() || null,
          statut: 'A_VENIR'
        };

        // Appel à l'API pour créer le match
        await matchService.createMatch(matchData);

        setIsSubmitting(false);
        onSubmit();
      } catch (error) {
        console.error('Error creating match:', error);
        setIsSubmitting(false);
        setErrors(prev => ({ ...prev, submit: 'Erreur lors de la création du match. Veuillez réessayer.' }));
      }
    }
  };

  return (
      <ModalOverlay>
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>Nouveau match</ModalTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <Label>Type de match</Label>
              <FieldRow>
                <div>
                  <input
                      type="radio"
                      id="homeTeam"
                      name="teamType"
                      value="true"
                      checked={isHomeTeam}
                      onChange={handleTeamTypeChange}
                  />
                  <Label htmlFor="homeTeam" style={{ display: 'inline', marginLeft: theme.spacing.sm }}>
                    Domicile
                  </Label>
                </div>
                <div>
                  <input
                      type="radio"
                      id="awayTeam"
                      name="teamType"
                      value="false"
                      checked={!isHomeTeam}
                      onChange={handleTeamTypeChange}
                  />
                  <Label htmlFor="awayTeam" style={{ display: 'inline', marginLeft: theme.spacing.sm }}>
                    Extérieur
                  </Label>
                </div>
              </FieldRow>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="equipeAdverseId">Équipe adverse</Label>
              <Select
                  id="equipeAdverseId"
                  name="equipeAdverseId"
                  value={formData.equipeAdverseId}
                  onChange={handleChange}
              >
                <option value="">Sélectionnez une équipe</option>
                {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name || team.nom}
                    </option>
                ))}
              </Select>
              {errors.equipeAdverseId && <ErrorMessage>{errors.equipeAdverseId}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="dateMatch">Date</Label>
              <Input
                  type="date"
                  id="dateMatch"
                  name="dateMatch"
                  value={formData.dateMatch}
                  onChange={handleChange}
                  min={getTodayDate()}
              />
              {errors.dateMatch && <ErrorMessage>{errors.dateMatch}</ErrorMessage>}
            </FormGroup>

            <FieldRow>
              <FormGroup>
                <Label htmlFor="heureDebut">Heure de début</Label>
                <Input
                    type="time"
                    id="heureDebut"
                    name="heureDebut"
                    value={formData.heureDebut}
                    onChange={handleChange}
                />
                {errors.heureDebut && <ErrorMessage>{errors.heureDebut}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="heureFin">Heure de fin</Label>
                <Input
                    type="time"
                    id="heureFin"
                    name="heureFin"
                    value={formData.heureFin}
                    onChange={handleChange}
                />
                {errors.heureFin && <ErrorMessage>{errors.heureFin}</ErrorMessage>}
              </FormGroup>
            </FieldRow>

            <FormGroup>
              <Label htmlFor="terrain">Terrain</Label>
              <Select
                  id="terrain"
                  name="terrain"
                  value={formData.terrain}
                  onChange={handleChange}
              >
                <option value="">Sélectionnez un terrain</option>
                {availableTerrains.map(terrain => (
                    <option key={terrain} value={terrain}>
                      {terrain}
                    </option>
                ))}
              </Select>
              {isCheckingTerrain && <LoadingIndicator>Vérification de la disponibilité...</LoadingIndicator>}
              {errors.terrain && <ErrorMessage>{errors.terrain}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="arbitre">Arbitre (optionnel)</Label>
              <Input
                  type="text"
                  id="arbitre"
                  name="arbitre"
                  value={formData.arbitre}
                  onChange={handleChange}
                  placeholder="Nom de l'arbitre"
                  maxLength={100}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <TextArea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Ajouter des notes sur le match..."
                  maxLength={500}
              />
            </FormGroup>

            {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
          </ModalBody>

          <ModalFooter>
            <Button
                buttonType="outlined"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
                buttonType="filled"
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
              {isSubmitting ? 'Création en cours...' : 'Créer le match'}
            </Button>
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>
  );
};

export default CreateMatchModal;