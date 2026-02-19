// src/components/match/MatchCancelModal.jsx
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
  
  &:focus {
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

const WarningMessage = styled.div`
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  background-color: rgba(211, 84, 0, 0.1);
  border-radius: ${theme.borderRadius.small};
  color: ${theme.colors.negative};
  font-weight: ${theme.typography.fontWeights.medium};
`;

const ErrorMessage = styled.div`
  margin-top: ${theme.spacing.sm};
  color: ${theme.colors.negative};
  font-size: ${theme.typography.fontSizes.sm};
`;

const MatchCancelModal = ({ onClose, onSubmit }) => {
  // États du formulaire
  const [motif, setMotif] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!motif.trim()) {
      newErrors.motif = 'Veuillez indiquer le motif d\'annulation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        await onSubmit(motif.trim());
        setIsSubmitting(false);
      } catch (error) {
        console.error('Error in match cancellation:', error);
        setIsSubmitting(false);
        setErrors(prev => ({ ...prev, submit: 'Erreur lors de l\'annulation du match. Veuillez réessayer.' }));
      }
    }
  };

  return (
      <ModalOverlay>
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>Annuler le match</ModalTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </ModalHeader>

          <ModalBody>
            <WarningMessage>
              Attention : L'annulation d'un match est définitive et sera notifiée aux équipes concernées.
            </WarningMessage>

            <FormGroup>
              <Label htmlFor="motif">Motif d'annulation *</Label>
              <TextArea
                  id="motif"
                  value={motif}
                  onChange={(e) => {
                    setMotif(e.target.value);
                    // Réinitialiser l'erreur
                    if (errors.motif) {
                      setErrors(prev => ({ ...prev, motif: null }));
                    }
                  }}
                  placeholder="Veuillez indiquer la raison de l'annulation du match..."
              />
              {errors.motif && <ErrorMessage>{errors.motif}</ErrorMessage>}
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
                variant="negative"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
              {isSubmitting ? 'Annulation...' : 'Annuler le match'}
            </Button>
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>
  );
};

export default MatchCancelModal;