// src/components/matches/ScoreUpdateModal.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import theme from '../../styles/theme';

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
  max-width: 500px;
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

const TeamsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const TeamSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45%;
`;

const TeamName = styled.h3`
  margin: ${theme.spacing.xs} 0;
  text-align: center;
  font-size: ${theme.typography.fontSizes.md};
  color: ${theme.colors.textPrimary};
`;

const ScoreInput = styled.input`
  width: 60px;
  height: 60px;
  text-align: center;
  font-size: ${theme.typography.fontSizes.xl};
  font-weight: ${theme.typography.fontWeights.bold};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.small};
  padding: ${theme.spacing.sm};
  
  &:focus {
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

const Separator = styled.div`
  font-size: ${theme.typography.fontSizes.xl};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.textSecondary};
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

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSizes.md};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

const ErrorMessage = styled.div`
  margin-top: ${theme.spacing.sm};
  color: ${theme.colors.negative};
  font-size: ${theme.typography.fontSizes.sm};
`;

const ScoreUpdateModal = ({ match, onClose, onSubmit }) => {
  const [scoreHome, setScoreHome] = useState(match.scoreEquipeInitiatrice || 0);
  const [scoreAway, setScoreAway] = useState(match.scoreEquipeAdverse || 0);
  const [notes, setNotes] = useState(match.notes || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreChange = (e, team) => {
    const value = parseInt(e.target.value) || 0;

    if (value < 0) {
      return;
    }

    if (team === 'home') {
      setScoreHome(value);
    } else {
      setScoreAway(value);
    }

    // Clear any error
    if (errors.score) {
      setErrors(prev => ({ ...prev, score: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Scores must be non-negative integers
    if (scoreHome < 0 || !Number.isInteger(Number(scoreHome))) {
      newErrors.score = 'Les scores doivent être des nombres entiers positifs';
    }

    if (scoreAway < 0 || !Number.isInteger(Number(scoreAway))) {
      newErrors.score = 'Les scores doivent être des nombres entiers positifs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true);

        const scoreData = {
          scoreEquipeInitiatrice: parseInt(scoreHome),
          scoreEquipeAdverse: parseInt(scoreAway),
          notes: notes.trim() || null
        };

        await onSubmit(scoreData);
        setIsSubmitting(false);
      } catch (error) {
        console.error('Error submitting score:', error);
        setIsSubmitting(false);
        setErrors(prev => ({ ...prev, submit: 'Erreur lors de la mise à jour du score. Veuillez réessayer.' }));
      }
    }
  };

  return (
      <ModalOverlay>
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>Mise à jour du score</ModalTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </ModalHeader>

          <ModalBody>
            <TeamsContainer>
              <TeamSection>
                <TeamName>{match.equipeInitiatrice.nom}</TeamName>
                <ScoreInput
                    type="number"
                    min="0"
                    value={scoreHome}
                    onChange={(e) => handleScoreChange(e, 'home')}
                />
              </TeamSection>

              <Separator>-</Separator>

              <TeamSection>
                <TeamName>{match.equipeAdverse.nom}</TeamName>
                <ScoreInput
                    type="number"
                    min="0"
                    value={scoreAway}
                    onChange={(e) => handleScoreChange(e, 'away')}
                />
              </TeamSection>
            </TeamsContainer>

            {errors.score && <ErrorMessage>{errors.score}</ErrorMessage>}

            <FormGroup>
              <Label htmlFor="notes">Notes du match (optionnel)</Label>
              <TextArea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Entrez des notes ou commentaires sur le match..."
                  maxLength={1000}
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
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>
  );
};

export default ScoreUpdateModal;