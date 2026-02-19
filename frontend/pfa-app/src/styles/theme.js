// src/styles/theme.js
const theme = {
  colors: {
    backgroundGradient: 'linear-gradient(175deg, #f8f9ff 0%, #f1f3fa 100%)',
    primary: '#25A55F',         // Vert principal
    secondary: '#FF6B35',       // Orange
    background: '#FFFFFF',      // Blanc
    cardBackground: '#F8F9FA',  // Gris très clair pour les cartes
    textPrimary: '#1E844A',     // Vert foncé pour texte principal
    textSecondary: '#555555',   // Gris foncé pour texte secondaire
    textOnPrimary: '#FFFFFF',   // Blanc pour texte sur fond coloré
    negative: '#D35400',        // Orange foncé pour éléments négatifs
    border: '#E6E6E6',          // Gris clair pour bordures
    success: '#2ECC71',         // Vert vif pour succès
    lightPrimary: '#E6F4EB',    // Vert très clair pour hover et fond subtil
    hover: {
      primary: '#1E844A',       // Vert foncé pour hover
      secondary: '#D35400',     // Orange foncé pour hover
    },
    breakpoints: {
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
  },

  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.05)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.15)'
  },

  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%'
  },

  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem'
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700
    }
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },

  transitions: {
    fast: '0.15s ease-in-out',
    medium: '0.3s ease-in-out',
    slow: '0.5s ease-in-out'
  }
};

export default theme;