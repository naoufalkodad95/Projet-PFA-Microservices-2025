// src/components/common/FloatingActionButton.jsx
import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

const FABContainer = styled.button`
    position: fixed;
    bottom: ${theme.spacing.xl};
    right: ${theme.spacing.xl};
    width: 56px;
    height: 56px;
    border-radius: ${theme.borderRadius.round};
    background-color: ${props => props.secondary ? theme.colors.secondary : theme.colors.primary};
    color: ${theme.colors.textOnPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    box-shadow: ${theme.shadows.medium};
    cursor: pointer;
    transition: all ${theme.transitions.medium};
    z-index: 1000;

    &:hover {
        transform: scale(1.1);
        box-shadow: ${theme.shadows.large};
        background-color: ${props => props.secondary ? theme.colors.hover.secondary : theme.colors.hover.primary};
    }

    &:active {
        transform: scale(0.95);
    }
`;

const IconWrapper = styled.span`
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FloatingActionButton = ({
                                icon = '+',
                                onClick,
                                secondary = false,
                                ariaLabel = 'Add',
                                ...props
                              }) => {
  return (
      <FABContainer
          onClick={onClick}
          secondary={secondary}
          aria-label={ariaLabel}
          {...props}
      >
        <IconWrapper>{icon}</IconWrapper>
      </FABContainer>
  );
};

export default FloatingActionButton;