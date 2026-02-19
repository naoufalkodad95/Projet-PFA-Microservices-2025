// src/components/layout/MainLayout.jsx
import React from 'react';
import styled from 'styled-components';
import Header from '../../pages/Utilisateurs/Capitaine/Header';
import theme from '../../styles/theme';

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: ${theme.colors.background || '#f8f9ff'};
    position: relative;
`;

const ContentContainer = styled.main`
    flex: 1;
    padding: ${theme.spacing.xxl || '2rem'} ${theme.spacing.xl || '1.5rem'};
    max-width: 1440px;
    margin: 0 auto;
    width: 100%;
    position: relative;

    @media (max-width: 1024px) {
        padding: ${theme.spacing.xl || '1.5rem'} ${theme.spacing.lg || '1rem'};
    }

    @media (max-width: 768px) {
        padding: ${theme.spacing.lg || '1rem'} ${theme.spacing.md || '0.75rem'};
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        height: 4px;
        width: 80%;
        background: linear-gradient(
                90deg,
                transparent,
                ${theme.colors.primary || '#4a90e2'},
                transparent
        );
        opacity: 0.2;
    }
`;

const MainLayout = ({ children }) => {
  return (
      <MainContainer>
        <Header />
        <ContentContainer>
          {children}
        </ContentContainer>
      </MainContainer>
  );
};

export default MainLayout;