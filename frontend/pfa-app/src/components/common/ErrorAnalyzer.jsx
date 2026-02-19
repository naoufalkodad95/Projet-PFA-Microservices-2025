// src/components/common/ErrorAnalyzer.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

const ErrorContainer = styled.div`
  padding: ${theme.spacing.lg};
  margin: ${theme.spacing.md} 0;
  background-color: rgba(211, 84, 0, 0.1);
  border-left: 4px solid ${theme.colors.negative};
  color: ${theme.colors.textSecondary};
  border-radius: ${theme.borderRadius.small};
`;

const ErrorTitle = styled.div`
  font-weight: ${theme.typography.fontWeights.medium};
  margin-bottom: ${theme.spacing.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ErrorMessage = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const DetailToggle = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  cursor: pointer;
  font-size: ${theme.typography.fontSizes.sm};
  
  &:hover {
    text-decoration: underline;
  }
`;

const DetailSection = styled.div`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: ${theme.borderRadius.small};
  font-family: monospace;
  font-size: ${theme.typography.fontSizes.sm};
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
`;

const ActionButton = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  cursor: pointer;
  margin-right: ${theme.spacing.sm};
  
  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

/**
 * Composant pour analyser et afficher les erreurs avec des options de débogage
 *
 * @param {Object} props - Les props du composant
 * @param {string} props.message - Le message d'erreur
 * @param {Object} props.error - L'objet d'erreur (optionnel)
 * @param {Object} props.context - Données de contexte supplémentaires (optionnel)
 * @param {Function} props.onRetry - Fonction à appeler pour réessayer (optionnel)
 */
const ErrorAnalyzer = ({ message, error, context, onRetry }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Formatter les détails de l'erreur pour l'affichage
  const getErrorDetails = () => {
    let details = [];

    if (error) {
      details.push(`Error: ${error.message || 'Unknown error'}`);

      if (error.response) {
        details.push(`Status: ${error.response.status}`);
        details.push(`Status Text: ${error.response.statusText}`);
        details.push(`URL: ${error.response.config.url}`);
        details.push(`Method: ${error.response.config.method.toUpperCase()}`);
        details.push('Response Data:');
        details.push(JSON.stringify(error.response.data, null, 2));
      }

      if (error.stack) {
        details.push('Stack Trace:');
        details.push(error.stack);
      }
    }

    if (context) {
      details.push('Context:');
      details.push(JSON.stringify(context, null, 2));
    }

    return details.join('\n');
  };

  return (
      <ErrorContainer>
        <ErrorTitle>
          <span>⚠️ Erreur</span>
          <DetailToggle onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Masquer les détails' : 'Afficher les détails'}
          </DetailToggle>
        </ErrorTitle>

        <ErrorMessage>{message}</ErrorMessage>

        <div>
          {onRetry && (
              <ActionButton onClick={onRetry}>
                Réessayer
              </ActionButton>
          )}
        </div>

        {showDetails && (
            <DetailSection>
              {getErrorDetails()}
            </DetailSection>
        )}
      </ErrorContainer>
  );
};

export default ErrorAnalyzer