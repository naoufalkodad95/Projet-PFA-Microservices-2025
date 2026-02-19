// src/components/matches/NewMatchModal.jsx
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
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSizes.md};
  
  &:focus {
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const CheckboxInput = styled.input`
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
  color: ${theme.colors.textPrimary};
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

const NewMatchModal = ({ onClose, onSubmit, currentTeamId }) => {
  // États du formulaire
  const [formData, setFormData] = useState({
    equipeDomicileId: currentTeamId,
    equipeExterieurId: '',
    dateMatch: getTodayDate(),
    heureMatch: getCurrentTime(),
    dureeMatch: '01:00',
    terrain: '',
    isTournoi: false,
    tournoiId: ''
  });

  const [availableTerrains, setAvailableTerrains] = useState([]);
  const [teams, setTeams] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [isCheckingTerrain, setIsCheckingTerrain] = useState(false);

  // Récupérer la liste des équipes
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoadingTeams(true);
        const teamsData = await teamService.getAllEquipes();
        setTeams(teamsData);
        setIsLoadingTeams(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des équipes:', error);
        setErrors(prev => ({ ...prev, teams: 'Impossible de charger la liste des équipes' }));
        setIsLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);

  // Récupérer la liste des terrains disponibles
  useEffect(() => {
    // Dans une application réelle, vous récupéreriez cette liste depuis l'API
    // Pour l'exemple, nous utilisons une liste statique
    setAvailableTerrains([
      'Terrain 1',
      'Terrain 2',
      'Terrain 3',
      'Terrain 4'
    ]);
  }, []);

  // Gestion du changement des champs du formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Pour les checkboxes, utiliser la valeur de "checked"
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Si l'erreur existe, la supprimer quand l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Vérifier la disponibilité du terrain
  const checkTerrainAvailability = async () => {
    if (!formData.terrain || !formData.dateMatch || !formData.heureMatch) {
      return true; // Ne pas vérifier si toutes les données ne sont pas présentes
    }

    try {
      setIsCheckingTerrain(true);

      // Calculer l'heure de fin en ajoutant la durée du match
      const [durationHours, durationMinutes] = formData.dureeMatch.split(':').map(Number);
      const [startHours, startMinutes] = formData.heureMatch.split(':').map(Number);

      let endHours = startHours + durationHours;
      let endMinutes = startMinutes + durationMinutes;

      if (endMinutes >= 60) {
        endHours += Math.floor(endMinutes / 60);
        endMinutes = endMinutes % 60;
      }

      const heureFinMatch = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

      // Créer les objets Date pour l'API
      const dateDebut = new Date(`${formData.dateMatch}T${formData.heureMatch}`);
      const dateFin = new Date(`${formData.dateMatch}T${heureFinMatch}`);

      const isAvailable = await matchService.isTerrainDisponible(
          formData.terrain,
          dateDebut,
          dateFin
      );

      setIsCheckingTerrain(false);
      return isAvailable;
    } catch (error) {
      console.error('Erreur lors de la vérification de la disponibilité du terrain:', error);
      setIsCheckingTerrain(false);
      return false;
    }
  };

  // Validation du formulaire
  const validateForm = async () => {
    const newErrors = {};

    // Validation de base
    if (!formData.equipeExterieurId) {
      newErrors.equipeExterieurId = 'Veuillez sélectionner une équipe adverse';
    }

    if (formData.equipeDomicileId === formData.equipeExterieurId) {
      newErrors.equipeExterieurId = 'L\'équipe adverse doit être différente de votre équipe';
    }

    if (!formData.dateMatch) {
      newErrors.dateMatch = 'Veuillez sélectionner une date';
    }

    if (!formData.heureMatch) {
      newErrors.heureMatch = 'Veuillez sélectionner une heure';
    }

    if (!formData.terrain) {
      newErrors.terrain = 'Veuillez sélectionner un terrain';
    }

    // Vérifier la disponibilité du terrain
    if (formData.terrain && formData.dateMatch && formData.heureMatch && !newErrors.terrain) {
      const isTerrainAvailable = await checkTerrainAvailability();
      if (!isTerrainAvailable) {
        newErrors.terrain = 'Ce terrain n\'est pas disponible à cette date/heure';
      }
    }

    // Si c'est un tournoi, vérifier que l'ID du tournoi est fourni
    if (formData.isTournoi && !formData.tournoiId) {
      newErrors.tournoiId = 'Veuillez sélectionner un tournoi';
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

        // Calculer l'heure de fin en ajoutant la durée du match
        const [durationHours, durationMinutes] = formData.dureeMatch.split(':').map(Number);
        const [startHours, startMinutes] = formData.heureMatch.split(':').map(Number);

        let endHours = startHours + durationHours;
        let endMinutes = startMinutes + durationMinutes;

        if (endMinutes >= 60) {
          endHours += Math.floor(endMinutes / 60);
          endMinutes = endMinutes % 60;
        }

        // Créer la date du match au format ISO pour l'API
        const dateMatch = new Date(`${formData.dateMatch}T${formData.heureMatch}`);

        // Adapter le format des données pour l'API
        const matchData = {
          equipeDomicileId: parseInt(formData.equipeDomicileId),
          equipeExterieurId: parseInt(formData.equipeExterieurId),
          dateMatch: dateMatch.toISOString(),
          terrain: formData.terrain,
          isTournoi: formData.isTournoi,
          tournoiId: formData.isTournoi ? parseInt(formData.tournoiId) : null
        };

        // Appel à l'API pour créer le match
        await matchService.createMatch(matchData);

        setIsSubmitting(false);
        onSubmit();
      } catch (error) {
        console.error('Erreur lors de la création du match:', error);
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
            {isLoadingTeams ? (
                <LoadingIndicator>Chargement des équipes...</LoadingIndicator>
            ) : (
                <>
                  <FormGroup>
                    <Label htmlFor="equipeDomicileId">Équipe domicile</Label>
                    <Select
                        id="equipeDomicileId"
                        name="equipeDomicileId"
                        value={formData.equipeDomicileId}
                        onChange={handleChange}
                    >
                      {teams.map(team => (
                          <option key={team.id} value={team.id}>
                            {team.nom}
                          </option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="equipeExterieurId">Équipe extérieur</Label>
                    <Select
                        id="equipeExterieurId"
                        name="equipeExterieurId"
                        value={formData.equipeExterieurId}
                        onChange={handleChange}
                    >
                      <option value="">Sélectionnez une équipe</option>
                      {teams
                          .filter(team => team.id !== parseInt(formData.equipeDomicileId))
                          .map(team => (
                              <option key={team.id} value={team.id}>
                                {team.nom}
                              </option>
                          ))}
                    </Select>
                    {errors.equipeExterieurId && <ErrorMessage>{errors.equipeExterieurId}</ErrorMessage>}
                  </FormGroup>

                  <FieldRow>
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

                    <FormGroup>
                      <Label htmlFor="heureMatch">Heure</Label>
                      <Input
                          type="time"
                          id="heureMatch"
                          name="heureMatch"
                          value={formData.heureMatch}
                          onChange={handleChange}
                      />
                      {errors.heureMatch && <ErrorMessage>{errors.heureMatch}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="dureeMatch">Durée</Label>
                      <Input
                          type="time"
                          id="dureeMatch"
                          name="dureeMatch"
                          value={formData.dureeMatch}
                          onChange={handleChange}
                          step="900" // Par paliers de 15 minutes
                      />
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
                    {isCheckingTerrain && <div>Vérification de la disponibilité...</div>}
                    {errors.terrain && <ErrorMessage>{errors.terrain}</ErrorMessage>}
                  </FormGroup>

                  <Checkbox>
                    <CheckboxInput
                        type="checkbox"
                        id="isTournoi"
                        name="isTournoi"
                        checked={formData.isTournoi}
                        onChange={handleChange}
                    />
                    <CheckboxLabel htmlFor="isTournoi">Ce match fait partie d'un tournoi</CheckboxLabel>
                  </Checkbox>

                  {formData.isTournoi && (
                      <FormGroup>
                        <Label htmlFor="tournoiId">Tournoi</Label>
                        <Select
                            id="tournoiId"
                            name="tournoiId"
                            value={formData.tournoiId}
                            onChange={handleChange}
                        >
                          <option value="">Sélectionnez un tournoi</option>
                          {/*
                      Ici, vous devriez charger la liste des tournois depuis l'API
                      Pour l'exemple, nous utilisons une liste statique
                    */}
                          <option value="1">Tournoi de printemps</option>
                          <option value="2">Coupe locale</option>
                        </Select>
                        {errors.tournoiId && <ErrorMessage>{errors.tournoiId}</ErrorMessage>}
                      </FormGroup>
                  )}

                  {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
                </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
                buttonType="outlined"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting || isLoadingTeams}
            >
              Annuler
            </Button>
            <Button
                buttonType="filled"
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting || isLoadingTeams}
            >
              {isSubmitting ? 'Création en cours...' : 'Créer le match'}
            </Button>
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>
  );
};

export default NewMatchModal;