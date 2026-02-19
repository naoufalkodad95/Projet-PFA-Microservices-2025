import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import teamService from '../../services/teamService';
import matchService from '../../services/matchService';

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
    max-width: 700px;
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
  display: flex;
  flex-direction: column;
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
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
`;

const TeamsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
`;

const TeamItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: ${props => props.selected ? '#e6f7ef' : 'white'};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const FieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 5px;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 5px;
  padding: 8px;
  background-color: #ffebee;
  border-radius: 4px;
`;

const ModalFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ccc;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const GenerateButton = styled(Button)`
  background-color: #25A55F;
  color: white;
  
  &:hover {
    background-color: #1c8048;
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

// Générateur de calendrier simplifié
const CalendarGenerator = ({ onClose, onGenerate }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    matchTimeSlots: ['18:00', '20:00'],
    selectedFields: ['Terrain 1', 'Terrain 2', 'Terrain 3'],
    homeAndAway: true,
    generateImmediately: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Liste des terrains disponibles (à adapter selon vos besoins)
  const fields = ['Terrain 1', 'Terrain 2', 'Terrain 3'];

  // Charger les équipes
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const teamsData = await teamService.getAllEquipes();
        setTeams(teamsData);
      } catch (error) {
        console.error('Erreur lors du chargement des équipes:', error);
        setError('Impossible de charger les équipes. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gérer les sélections multiples (terrains)
  const handleFieldToggle = (field) => {
    setFormData(prev => {
      const fields = [...prev.selectedFields];

      if (fields.includes(field)) {
        return {
          ...prev,
          selectedFields: fields.filter(f => f !== field)
        };
      } else {
        return {
          ...prev,
          selectedFields: [...fields, field]
        };
      }
    });
  };

  // Gérer la sélection des équipes
  const toggleTeamSelection = (teamId) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  };

  // Gérer les créneaux horaires
  const handleAddTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      matchTimeSlots: [...prev.matchTimeSlots, '']
    }));
  };

  const handleTimeSlotChange = (index, value) => {
    setFormData(prev => {
      const slots = [...prev.matchTimeSlots];
      slots[index] = value;
      return {
        ...prev,
        matchTimeSlots: slots
      };
    });
  };

  const handleRemoveTimeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      matchTimeSlots: prev.matchTimeSlots.filter((_, i) => i !== index)
    }));
  };

  // Valider le formulaire
  const validateForm = () => {
    setError(null);

    if (selectedTeams.length < 2) {
      setError('Veuillez sélectionner au moins 2 équipes');
      return false;
    }

    if (!formData.startDate) {
      setError('La date de début est requise');
      return false;
    }

    if (!formData.endDate) {
      setError('La date de fin est requise');
      return false;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('La date de fin doit être postérieure à la date de début');
      return false;
    }

    if (formData.selectedFields.length === 0) {
      setError('Veuillez sélectionner au moins un terrain');
      return false;
    }

    if (formData.matchTimeSlots.some(slot => !slot)) {
      setError('Tous les créneaux horaires doivent être remplis');
      return false;
    }

    return true;
  };

  // Générer le calendrier
  const handleGenerate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Préparer les paramètres
      const params = {
        teams: selectedTeams,
        startDate: formData.startDate,
        endDate: formData.endDate,
        timeSlots: formData.matchTimeSlots,
        fields: formData.selectedFields,
        homeAndAway: formData.homeAndAway,
        generateImmediately: formData.generateImmediately
      };

      // Simuler la génération du calendrier
      // Dans une implémentation réelle, vous appelleriez un service
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Créer les matchs en fonction des équipes sélectionnées
      const generatedMatches = [];

      // Si l'utilisateur veut des matchs aller-retour
      const shouldCreateReturnMatches = formData.homeAndAway;

      // Pour chaque paire d'équipes
      for (let i = 0; i < selectedTeams.length; i++) {
        for (let j = i + 1; j < selectedTeams.length; j++) {
          // Générer une date aléatoire entre début et fin
          const start = new Date(formData.startDate);
          const end = new Date(formData.endDate);
          const matchDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

          // Formater la date
          const year = matchDate.getFullYear();
          const month = String(matchDate.getMonth() + 1).padStart(2, '0');
          const day = String(matchDate.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;

          // Choisir un créneau horaire aléatoire
          const timeSlot = formData.matchTimeSlots[Math.floor(Math.random() * formData.matchTimeSlots.length)];

          // Choisir un terrain aléatoire
          const field = formData.selectedFields[Math.floor(Math.random() * formData.selectedFields.length)];

          // Créer le match aller
          const team1 = teams.find(t => t.id === selectedTeams[i]);
          const team2 = teams.find(t => t.id === selectedTeams[j]);

          if (formData.generateImmediately) {
            // Créer le match dans la base de données
            const matchData = {
              equipeDomicileId: team1.id,
              equipeExterieurId: team2.id,
              dateMatch: `${formattedDate}T${timeSlot}:00`,
              terrain: field,
              isTournoi: false
            };

            const createdMatch = await matchService.createMatch(matchData);
            generatedMatches.push(createdMatch);

            // Créer le match retour si nécessaire
            if (shouldCreateReturnMatches) {
              // Générer une autre date pour le match retour
              const returnMatchDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

              // Formater la date
              const returnYear = returnMatchDate.getFullYear();
              const returnMonth = String(returnMatchDate.getMonth() + 1).padStart(2, '0');
              const returnDay = String(returnMatchDate.getDate()).padStart(2, '0');
              const returnFormattedDate = `${returnYear}-${returnMonth}-${returnDay}`;

              // Créer le match retour
              const returnMatchData = {
                equipeDomicileId: team2.id,
                equipeExterieurId: team1.id,
                dateMatch: `${returnFormattedDate}T${timeSlot}:00`,
                terrain: field,
                isTournoi: false
              };

              const createdReturnMatch = await matchService.createMatch(returnMatchData);
              generatedMatches.push(createdReturnMatch);
            }
          } else {
            // Juste simuler pour l'aperçu
            generatedMatches.push({
              id: `preview-${i}-${j}`,
              equipeDomicileId: team1.id,
              equipeDomicileNom: team1.nom,
              equipeExterieurId: team2.id,
              equipeExterieurNom: team2.nom,
              dateMatch: `${formattedDate}T${timeSlot}:00`,
              terrain: field,
              statut: 'PLANIFIE'
            });

            // Ajouter le match retour simulé si nécessaire
            if (shouldCreateReturnMatches) {
              // Générer une autre date pour le match retour
              const returnMatchDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

              // Formater la date
              const returnYear = returnMatchDate.getFullYear();
              const returnMonth = String(returnMatchDate.getMonth() + 1).padStart(2, '0');
              const returnDay = String(returnMatchDate.getDate()).padStart(2, '0');
              const returnFormattedDate = `${returnYear}-${returnMonth}-${returnDay}`;

              generatedMatches.push({
                id: `preview-${j}-${i}`,
                equipeDomicileId: team2.id,
                equipeDomicileNom: team2.nom,
                equipeExterieurId: team1.id,
                equipeExterieurNom: team1.nom,
                dateMatch: `${returnFormattedDate}T${timeSlot}:00`,
                terrain: field,
                statut: 'PLANIFIE'
              });
            }
          }
        }
      }

      // Retourner les matchs générés
      if (onGenerate) {
        onGenerate(generatedMatches);
      }

      // Fermer la modale
      onClose();
    } catch (error) {
      console.error('Erreur lors de la génération du calendrier:', error);
      setError('Une erreur est survenue lors de la génération du calendrier.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <ModalBackdrop>
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>Générer un calendrier de matchs</ModalTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </ModalHeader>

          <ModalBody>
            {loading && <LoadingIndicator>Chargement en cours...</LoadingIndicator>}

            {!loading && (
                <Form>
                  <FormGroup>
                    <Label>Sélectionnez les équipes participantes:</Label>
                    <div style={{ marginBottom: '5px' }}>
                      Sélectionnez au moins 2 équipes pour générer des matchs entre elles.
                    </div>

                    <TeamsList>
                      {teams.map(team => (
                          <TeamItem
                              key={team.id}
                              selected={selectedTeams.includes(team.id)}
                              onClick={() => toggleTeamSelection(team.id)}
                          >
                            <input
                                type="checkbox"
                                checked={selectedTeams.includes(team.id)}
                                onChange={() => toggleTeamSelection(team.id)}
                            />
                            {team.nom}
                          </TeamItem>
                      ))}
                    </TeamsList>

                    <div style={{ marginTop: '10px' }}>
                      {selectedTeams.length} équipe(s) sélectionnée(s) sur {teams.length}
                    </div>
                  </FormGroup>

                  <FormRow>
                    <FormGroup>
                      <Label htmlFor="startDate">Date de début:</Label>
                      <Input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="endDate">Date de fin:</Label>
                      <Input
                          type="date"
                          id="endDate"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                      />
                    </FormGroup>
                  </FormRow>

                  <FormGroup>
                    <Label>Créneaux horaires des matchs:</Label>
                    {formData.matchTimeSlots.map((slot, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                          <Input
                              type="time"
                              value={slot}
                              onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                          />
                          {index > 0 && (
                              <button
                                  type="button"
                                  onClick={() => handleRemoveTimeSlot(index)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f44336' }}
                              >
                                ✕
                              </button>
                          )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddTimeSlot}
                        style={{
                          background: 'none',
                          border: '1px dashed #ccc',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          marginTop: '5px',
                          cursor: 'pointer'
                        }}
                    >
                      + Ajouter un créneau
                    </button>
                  </FormGroup>

                  <FormGroup>
                    <Label>Terrains disponibles:</Label>
                    <FieldsList>
                      {fields.map(field => (
                          <Checkbox key={field}>
                            <input
                                type="checkbox"
                                id={`field-${field}`}
                                checked={formData.selectedFields.includes(field)}
                                onChange={() => handleFieldToggle(field)}
                            />
                            <label htmlFor={`field-${field}`}>{field}</label>
                          </Checkbox>
                      ))}
                    </FieldsList>
                  </FormGroup>

                  <FormGroup>
                    <Checkbox>
                      <input
                          type="checkbox"
                          id="homeAndAway"
                          name="homeAndAway"
                          checked={formData.homeAndAway}
                          onChange={handleChange}
                      />
                      <label htmlFor="homeAndAway">Créer des matchs aller-retour</label>
                    </Checkbox>

                    <Checkbox>
                      <input
                          type="checkbox"
                          id="generateImmediately"
                          name="generateImmediately"
                          checked={formData.generateImmediately}
                          onChange={handleChange}
                      />
                      <label htmlFor="generateImmediately">Générer les matchs directement (sans aperçu)</label>
                    </Checkbox>
                  </FormGroup>

                  {error && <ErrorMessage>{error}</ErrorMessage>}
                </Form>
            )}
          </ModalBody>

          <ModalFooter>
            <CancelButton onClick={onClose} disabled={loading}>
              Annuler
            </CancelButton>
            <GenerateButton onClick={handleGenerate} disabled={loading}>
              {loading ? 'Génération...' : 'Générer le calendrier'}
            </GenerateButton>
          </ModalFooter>
        </ModalContainer>
      </ModalBackdrop>
  );
};

export default CalendarGenerator;