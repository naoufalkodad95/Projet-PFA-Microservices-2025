// src/components/common/Button.jsx
import React from 'react';
import styled, { css } from 'styled-components';
import theme from '../../styles/theme';

// Styles de base partagés par toutes les variantes de boutons
const baseButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.small};
  font-weight: ${theme.typography.fontWeights.medium};
  transition: all ${theme.transitions.fast};
  padding: ${props =>
    props.size === "small" ? `${theme.spacing.xs} ${theme.spacing.sm}` :
        props.size === "large" ? `${theme.spacing.md} ${theme.spacing.lg}` :
            `${theme.spacing.sm} ${theme.spacing.md}`
};
  font-size: ${props =>
    props.size === "small" ? theme.typography.fontSizes.sm :
        props.size === "large" ? theme.typography.fontSizes.lg :
            theme.typography.fontSizes.md
};
  gap: ${theme.spacing.sm};
  cursor: pointer;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Style de bouton plein (rempli)
const FilledButton = styled.button`
  ${baseButtonStyles}
  background-color: ${props =>
    props.variant === "secondary" ? theme.colors.secondary :
        props.variant === "negative" ? theme.colors.negative :
            theme.colors.primary
};
  color: ${theme.colors.textOnPrimary};
  border: none;

  &:hover:not(:disabled) {
    background-color: ${props =>
    props.variant === "secondary" ? theme.colors.hover.secondary :
        props.variant === "negative" ? theme.colors.hover.secondary :
            theme.colors.hover.primary
};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.small};
  }
`;

// Style de bouton avec contour
const OutlinedButton = styled.button`
  ${baseButtonStyles}
  background-color: transparent;
  color: ${props =>
    props.variant === "secondary" ? theme.colors.secondary :
        props.variant === "negative" ? theme.colors.negative :
            theme.colors.primary
};
  border: 1px solid ${props =>
    props.variant === "secondary" ? theme.colors.secondary :
        props.variant === "negative" ? theme.colors.negative :
            theme.colors.primary
};

  &:hover:not(:disabled) {
    background-color: ${props =>
    props.variant === "secondary" ? `${theme.colors.secondary}10` :
        props.variant === "negative" ? `${theme.colors.negative}10` :
            `${theme.colors.primary}10`
};
    transform: translateY(-2px);
  }
`;

// Style de bouton texte (sans bordure ni fond)
const TextButton = styled.button`
  ${baseButtonStyles}
  background-color: transparent;
  color: ${props =>
    props.variant === "secondary" ? theme.colors.secondary :
        props.variant === "negative" ? theme.colors.negative :
            theme.colors.primary
};
  border: none;
  padding: ${theme.spacing.xs};

  &:hover:not(:disabled) {
    background-color: ${props =>
    props.variant === "secondary" ? `${theme.colors.secondary}10` :
        props.variant === "negative" ? `${theme.colors.negative}10` :
            `${theme.colors.primary}10`
};
  }
`;

const Button = ({
                  children,
                  variant = "primary",
                  buttonType = "filled",
                  size = "medium",
                  icon = null,
                  iconPosition = "left",
                  ...props
                }) => {
  // Sélectionner le composant de bouton en fonction du type
  const ButtonComponent =
      buttonType === "outlined" ? OutlinedButton :
          buttonType === "text" ? TextButton :
              FilledButton;

  return (
      <ButtonComponent
          variant={variant}
          size={size}
          {...props}
      >
        {icon && iconPosition === "left" && <span className="button-icon">{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span className="button-icon">{icon}</span>}
      </ButtonComponent>
  );
};

export default Button;