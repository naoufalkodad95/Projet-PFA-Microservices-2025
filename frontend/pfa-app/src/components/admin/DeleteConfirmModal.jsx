import React from 'react';
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
  padding: 0;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  background-color: #f44336;
  color: white;
  padding: 15px 20px;
  font-weight: bold;
  font-size: 1.2rem;
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const MatchInfo = styled.div`
  background-color: #f8f8f8;
  border-radius: 4px;
  padding: 15px;
  margin: 15px 0;
`;

const InfoRow = styled.div`
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;

const WarningText = styled.p`
  color: #d32f2f;
  font-size: 0.9rem;
  margin-top: 15px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
`;

const CancelButton = styled.button`
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ccc;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #e5e5e5;
  }
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const DeleteConfirmModal = ({ match, onCancel, onConfirm }) => {
  // Formatage de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Formatage de l'heure
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
          <ModalHeader>Confirmer la suppression</ModalHeader>

          <ModalBody>
            <p>Êtes-vous sûr de vouloir supprimer ce match ?</p>

            <MatchInfo>
              <InfoRow>
                <InfoLabel>Date:</InfoLabel> {formatDate(match.dateMatch)}
              </InfoRow>
              <InfoRow>
                <InfoLabel>Heure:</InfoLabel> {formatTime(match.dateMatch)}
              </InfoRow>
              <InfoRow>
                <InfoLabel>Match:</InfoLabel> {match.equipeDomicileNom} vs {match.equipeExterieurNom}
              </InfoRow>
              <InfoRow>
                <InfoLabel>Terrain:</InfoLabel> {match.terrain}
              </InfoRow>
            </MatchInfo>

            <WarningText>
              Cette action est irréversible et ne peut pas être annulée.
              Les équipes concernées seront notifiées de l'annulation du match.
            </WarningText>
          </ModalBody>

          <ModalFooter>
            <CancelButton onClick={onCancel}>Annuler</CancelButton>
            <DeleteButton onClick={onConfirm}>Supprimer</DeleteButton>
          </ModalFooter>
        </ModalContainer>
      </ModalBackdrop>
  );
};

export default DeleteConfirmModal;