import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  
  &:focus {
    border-color: #25A55F;
    outline: none;
  }
`;

const ErrorText = styled.div`
  color: #d32f2f;
  font-size: 0.75rem;
  margin-top: 3px;
`;

/**
 * Composant personnalisé pour l'entrée de date au format mm/dd/yyyy
 * @param {Object} props
 * @param {string} props.value - Valeur au format ISO (yyyy-mm-dd)
 * @param {Function} props.onChange - Callback appelé avec la nouvelle valeur au format ISO
 * @param {string} props.name - Nom du champ
 * @param {string} props.id - ID du champ
 * @param {Object} props.other - Autres propriétés à passer au composant input
 */
const DateInput = ({ value, onChange, name, id, ...other }) => {
  // État local pour la valeur formatée
  const [displayValue, setDisplayValue] = useState('');
  // État pour les erreurs de validation
  const [error, setError] = useState('');

  // Convertir la valeur ISO en valeur formatée lors du chargement
  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const year = date.getFullYear();
          setDisplayValue(`${month}/${day}/${year}`);
        }
      } catch (e) {
        console.error('Erreur lors de la conversion de la date:', e);
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  // Gestion de la saisie avec formatage automatique
  const handleInputChange = (e) => {
    let input = e.target.value;

    // Supprimer tout ce qui n'est pas un chiffre ou un slash
    input = input.replace(/[^\d/]/g, '');

    // Appliquer le masque MM/DD/YYYY
    let formatted = input;

    // Ajouter automatiquement les slashes
    if (input.length > 0) {
      // Formater pour MM/
      if (input.length === 2 && !input.includes('/')) {
        formatted = input + '/';
      }
      // Formater pour MM/DD/
      else if (input.length === 5 && input.indexOf('/', 3) === -1) {
        formatted = input + '/';
      }
      // Limiter à MM/DD/YYYY (10 caractères)
      else if (input.length > 10) {
        formatted = input.slice(0, 10);
      }
    }

    setDisplayValue(formatted);

    // Validation et conversion en ISO pour le stockage
    if (formatted.length === 10) {
      const [month, day, year] = formatted.split('/');

      // Vérification minimale de validité
      if (parseInt(month) > 12 || parseInt(month) < 1) {
        setError('Mois invalide (1-12)');
        return;
      }

      if (parseInt(day) > 31 || parseInt(day) < 1) {
        setError('Jour invalide (1-31)');
        return;
      }

      const date = new Date(`${year}-${month}-${day}`);

      if (isNaN(date.getTime())) {
        setError('Date invalide');
        return;
      }

      // Date valide, effacer l'erreur et appeler le callback
      setError('');

      // Formater en ISO pour l'API
      const isoDate = `${year}-${month}-${day}`;
      onChange({ target: { name, value: isoDate } });
    } else if (formatted.length === 0) {
      // Effacer la valeur si le champ est vide
      onChange({ target: { name, value: '' } });
      setError('');
    }
  };

  return (
      <div>
        <StyledInput
            type="text"
            placeholder="MM/DD/YYYY"
            value={displayValue}
            onChange={handleInputChange}
            name={name}
            id={id}
            {...other}
        />
        {error && <ErrorText>{error}</ErrorText>}
      </div>
  );
};

export default DateInput;