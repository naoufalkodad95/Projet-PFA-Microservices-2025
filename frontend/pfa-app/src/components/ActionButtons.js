import React from 'react';
import styled from 'styled-components';

// Composant de bouton d'action stylisé
const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  color: ${props => props.color || '#333'};
  border: 1px solid ${props => props.color || '#e0e0e0'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 4px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: ${props => props.color || '#f5f5f5'};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 6px;
`;

// Composant pour afficher les boutons d'action ensemble
export const ActionButtons = ({ onView, onEdit, onDelete,onDeleteUtilisateur,  item }) => {
  return (
    <ButtonContainer>
      {onView && (
        <ActionButton
          title="Voir les détails"
          color="#4caf50"
          onClick={() => onView(item)}
        >
          👁️
        </ActionButton>
      )}
      {onEdit && (
        <ActionButton
          title="Modifier"
          color="#2196f3"
          onClick={() => onEdit(item)}
        >
          ✎
        </ActionButton>
      )}
      {onDelete && (
        <ActionButton
          title="Supprimer"
          color="#f44336"
          onClick={() => onDelete(item.id)}
        >
          ✕
        </ActionButton>
      )}
       {onDeleteUtilisateur && (
        <ActionButton
          title="Supprimer"
          color="#f44336"
          onClick={() => onDeleteUtilisateur(item.iD_Utilisateur)}
        >
          ✕
        </ActionButton>
      )}
    </ButtonContainer>
  );
};

// Export individuel du bouton d'action pour utilisation personnalisée
export { ActionButton };

export default ActionButtons;