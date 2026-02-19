import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { teamService } from '../../../services/teamService';
import { matchService } from '../../../services/matchService';

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
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 5px;
`;

const ModalFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: #333;
  border-color: #ccc;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SaveButton = styled(Button)`
  background-color: #25A55F;
  color: white;
  
  &:hover {
    background-color: #1c8048;
  }
`;

const MatchEditModal = ({ match, onClose, onUpdate }) => {
  const [teams, setTeams] = useState([]);
  const [fields, setFields] = useState(['Terrain 1', 'Terrain 2', 'Terrain 3']); // Simulé, à remplacer par un appel API
  const [formData, setFormData] = useState({
    id: match.id,
    equipeDomicileId: match.equipeDomicileId.toString(),
    equipeExterieurId: match.equipeExterieurId.toString(),
    dateMatch: '',
    heureMatch: '',
    terrain: match.terrain
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFieldAvailable, setIsFieldAvailable] = useState(true);

  useEffect(() => {
    // Formater la date et l'heure à partir de dateMatch
    const matchDate = new Date(match.dateMatch);
    const formattedDate = matchDate.toISOString().split('T')[0];
    const hours = matchDate.getHours().toString().padStart(2, '0');
    const minutes = matchDate.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    setFormData(prev => ({
      ...prev,
      dateMatch: formattedDate,
      heureMatch: formattedTime
    }));

    // Récupérer les équipes
    const fetchTeams = async () => {
      try {
        const teamsData = await teamService.getAllTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des équipes:', error);
      }
    };

    fetchTeams();
  }, [match]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }

    // Vérifier la disponibilité du terrain si tous les champs nécessaires sont remplis
    if (name === 'terrain' || name === 'dateMatch' || name === 'heureMatch') {
      checkFieldAvailability();
    }
  };

  const checkFieldAvailability = async () => {
    const { terrain, dateMatch, heureMatch } = formData;

    if (terrain && dateMatch && heureMatch) {
      try {
        // Formater la date et l'heure pour l'API
        const dateTime = new Date(`${dateMatch}T${heureMatch}`);
        const endDateTime = new Date(dateTime.getTime() + 90 * 60000); // +90 minutes

        // Convertir au format ISO pour l'API
        const startISO = dateTime.toISOString();
        const endISO = endDateTime.toISOString();

        // Vérifier la disponibilité (en excluant le match actuel)
        const isAvailable = await matchService.checkFieldAvailabilityExcludingMatch(
            terrain,
            startISO,
            endISO,
            match.id
        );

        setIsFieldAvailable(isAvailable);

        if (!isAvailable) {
          setErrors({
            ...errors,
            terrain: 'Ce terrain n\'est pas disponible à ce créneau'
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de disponibilité:', error);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.equipeDomicileId) {
      newErrors.equipeDomicileId = 'Veuillez sélectionner une équipe domicile';
    }

    if (!formData.equipeExterieurId) {
      newErrors.equipeExterieurId = 'Veuillez sélectionner une équipe extérieur';
    }

    if (formData.equipeDomicileId === formData.equipeExterieurId && formData.equipeDomicileId !== '') {
      newErrors.equipeExterieurId = 'Les équipes domicile et extérieur doivent être différentes';
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

    if (!isFieldAvailable) {
      newErrors.terrain = 'Ce terrain n\'est pas disponible à ce créneau';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Formater les données pour l'API
      const dateTime = new Date(`${formData.dateMatch}T${formData.heureMatch}`);

      const matchData = {
        id: formData.id,
        equipeDomicileId: parseInt(formData.equipeDomicileId),
        equipeExterieurId: parseInt(formData.equipeExterieurId),
        dateMatch: dateTime.toISOString(),
        terrain: formData.terrain,
        isTournoi: match.isTournoi || false,
        tournoiId: match.tournoiId,
        statut: match.statut,
        scoreDomicile: match.scoreDomicile,
        scoreExterieur: match.scoreExterieur
      };

      await onUpdate(matchData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du match:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <ModalBackdrop>
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>Modifier le match</ModalTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </ModalHeader>

          <ModalBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="equipeDomicileId">Équipe Domicile:</Label>
                <Select
                    id="equipeDomicileId"
                    name="equipeDomicileId"
                    value={formData.equipeDomicileId}
                    onChange={handleChange}
                >
                  <option value="">Sélectionner une équipe...</option>
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
                <Label htmlFor="equipeExterieurId">Équipe Extérieur:</Label>
                <Select
                    id="equipeExterieurId"
                    name="equipeExterieurId"
                    value={formData.equipeExterieurId}
                    onChange={handleChange}
                >
                  <option value="">Sélectionner une équipe...</option>
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
                <Label htmlFor="dateMatch">Date du match:</Label>
                <Input
                    type="date"
                    id="dateMatch"
                    name="dateMatch"
                    value={formData.dateMatch}
                    onChange={handleChange}
                />
                {errors.dateMatch && (
                    <ErrorMessage>{errors.dateMatch}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="heureMatch">Heure du match:</Label>
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

              <FormGroup>
                <Label htmlFor="terrain">Terrain:</Label>
                <Select
                    id="terrain"
                    name="terrain"
                    value={formData.terrain}
                    onChange={handleChange}
                >
                  <option value="">Sélectionner un terrain...</option>
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
            </Form>
          </ModalBody>

          <ModalFooter>
            <CancelButton onClick={onClose}>Annuler</CancelButton>
            <SaveButton onClick={handleSubmit} disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </SaveButton>
          </ModalFooter>
        </ModalContainer>
      </ModalBackdrop>
  );
};

export default MatchEditModal;