import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import teamService from '../../../services/teamService';
import matchService from '../../../services/matchService';
import adminService from '../../../services/adminService';

const FormContainer = styled.div`
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
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

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  grid-column: span 2;
  margin-top: 20px;
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

const CancelButton = styled.button`
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

const MatchCreationForm = ({ onCreateMatch }) => {
  const [teams, setTeams] = useState([]);
  const [fields, setFields] = useState(['Terrain 1', 'Terrain 2', 'Terrain 3']); // À adapter selon vos terrains
  const [formData, setFormData] = useState({
    equipeDomicileId: '',
    equipeExterieurId: '',
    dateMatch: '',
    heureMatch: '',
    terrain: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFieldAvailable, setIsFieldAvailable] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await teamService.getAllEquipes();
        setTeams(teamsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des équipes:', error);
      }
    };

    fetchTeams();
  }, []);

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
        const endDateTime = new Date(dateTime.getTime() + 90 * 60000); // +90 minutes pour la durée du match

        // Convertir au format ISO pour l'API
        const startISO = dateTime.toISOString();
        const endISO = endDateTime.toISOString();

        // Vérifier la disponibilité
        const isAvailable = await matchService.isTerrainDisponible(
            terrain,
            startISO,
            endISO
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
        equipeDomicileId: parseInt(formData.equipeDomicileId),
        equipeExterieurId: parseInt(formData.equipeExterieurId),
        dateMatch: dateTime.toISOString(),
        terrain: formData.terrain,
        isTournoi: false
      };

      await onCreateMatch(matchData);

      // Réinitialiser le formulaire après création
      setFormData({
        equipeDomicileId: '',
        equipeExterieurId: '',
        dateMatch: '',
        heureMatch: '',
        terrain: ''
      });

    } catch (error) {
      console.error('Erreur lors de la création du match:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
      <FormContainer>
        <FormTitle>Créer un nouveau match</FormTitle>

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

          <ButtonsContainer>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Planification...' : 'Planifier'}
            </SubmitButton>
            <CancelButton type="button" onClick={handleReset}>
              Annuler
            </CancelButton>
          </ButtonsContainer>
        </Form>
      </FormContainer>
  );
};

export default MatchCreationForm;