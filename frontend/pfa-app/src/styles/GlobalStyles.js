// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${theme.typography.fontFamily};
    background-color: ${theme.colors.background};
    color: ${theme.colors.textPrimary};
    font-size: ${theme.typography.fontSizes.md};
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${theme.colors.textPrimary};
    margin-bottom: ${theme.spacing.md};
    font-weight: ${theme.typography.fontWeights.medium};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.hover.primary};
    }
  }

  button {
    cursor: pointer;
    font-family: ${theme.typography.fontFamily};
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    text-align: left;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.textOnPrimary};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }

  td {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-bottom: 1px solid ${theme.colors.border};
  }

  tr:nth-child(even) {
    background-color: ${theme.colors.cardBackground};
  }

  .card {
    background-color: ${theme.colors.background};
    border-radius: ${theme.borderRadius.medium};
    box-shadow: ${theme.shadows.small};
    padding: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.lg};
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: ${theme.spacing.lg};
  }
`;

export default GlobalStyles;