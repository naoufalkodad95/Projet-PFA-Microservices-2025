import React, { useState } from 'react';
import styled from 'styled-components';

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

const WarningIcon = styled.div`
  font-size: 3rem;
  color: #FF6B35;
  text-align: center;
  margin-bottom: 15px;
`;

const ConfirmationText = styled.p`
  margin: 0 0 15px;
  text-align: center;
  font-size: 1.1rem;
  color: #333;
`;

const MatchDetails = styled.div`
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 15px;
  margin-top: 15px;
`;

const MatchDetail = styled.p`
  margin: 5px 0;
  font-size: 0.9rem;
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

const DeleteButton = styled(Button)`
  background-color: #FF6B35;
  color: white;
  
  &:hover {
    background-color: #e05a2b;
  }
`;

const MatchDeleteModal = ({ match, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);

    try {
      await onConfirm();
    } catch (error) {
      console.error('Erreur lors de la suppression du match:', error);
    } finally {
      setLoading(false);
    }
  };

  // Formatage de la date et de l'heure
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
      <ModalBackdrop>
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>Confirmer la suppression</ModalTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </ModalHeader>

          <ModalBody>
            <WarningIcon>⚠️</WarningIcon>

            <ConfirmationText>
              Êtes-vous sûr de vouloir supprimer ce match ?
            </ConfirmationText>

            <MatchDetails>
              <MatchDetail>
                <strong>Date:</strong> {formatDate(match.dateMatch)} à {formatTime(match.dateMatch)}
              </MatchDetail>
              <MatchDetail>
                <strong>Match:</strong> {match.equipeDomicileNom} vs {match.equipeExterieurNom}
              </MatchDetail>
              <MatchDetail>
                <strong>Terrain:</strong> {match.terrain}
              </MatchDetail>
            </MatchDetails>

            <p style={{ color: '#d32f2f', fontSize: '0.9rem', marginTop: '15px' }}>
              Cette action ne peut pas être annulée. Les équipes seront notifiées de l'annulation.
            </p>
          </ModalBody>

          <ModalFooter>
            <CancelButton onClick={onClose}>Annuler</CancelButton>
            <DeleteButton onClick={handleConfirm} disabled={loading}>
              {loading ? 'Suppression...' : 'Supprimer'}
            </DeleteButton>
          </ModalFooter>
        </ModalContainer>
      </ModalBackdrop>
  );
};

export default MatchDeleteModal;