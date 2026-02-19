// src/components/common/Avatar.jsx
import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

// Générer une couleur en fonction d'un identifiant
const getColorForId = (id) => {
  // Une liste de couleurs de bases pour les avatars
  const colors = [
    '#25A55F', // vert
    '#3498DB', // bleu
    '#FF6B35', // orange
    '#9B59B6', // violet
    '#F1C40F', // jaune
    '#1ABC9C', // turquoise
    '#E74C3C', // rouge
  ];

  // Utiliser l'ID pour choisir une couleur en faisant un modulo
  return colors[id % colors.length];
};

// Obtenir les initiales à partir d'un nom
const getInitials = (name) => {
  if (!name) return '?';

  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();

  return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
};

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size === 'small' ? '28px' :
    props.size === 'large' ? '48px' : '36px'};
  height: ${props => props.size === 'small' ? '28px' :
    props.size === 'large' ? '48px' : '36px'};
  border-radius: ${theme.borderRadius.round};
  background-color: ${props => props.color || getColorForId(props.id || 0)};
  color: ${theme.colors.textOnPrimary};
  font-weight: ${theme.typography.fontWeights.medium};
  font-size: ${props => props.size === 'small' ? theme.typography.fontSizes.xs :
    props.size === 'large' ? theme.typography.fontSizes.lg :
        theme.typography.fontSizes.sm};
  overflow: hidden;
  user-select: none;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Avatar = ({
                  name,
                  image,
                  id,
                  color,
                  size = 'medium',
                  ...props
                }) => {
  return (
      <AvatarContainer size={size} id={id} color={color} {...props}>
        {image ? (
            <AvatarImage src={image} alt={name || 'Avatar'} />
        ) : (
            getInitials(name)
        )}
      </AvatarContainer>
  );
};

export default Avatar;