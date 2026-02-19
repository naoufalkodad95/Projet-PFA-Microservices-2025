import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import theme from '../../styles/theme';

// Add subtle shimmer animation
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${props => props.hasLogo ? 'transparent' : `linear-gradient(135deg, ${theme.colors.background}, white)`};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.md};
  box-sizing: border-box;
  width: 90px;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    
    .logo-symbol {
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      animation: ${pulse} 1.5s ease infinite;
    }
    
    .team-name {
      color: ${theme.colors.primary};
    }
  }
`;

const LogoSymbol = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSizes.xxl};
  font-weight: ${theme.typography.fontWeights.bold};
  color: white;
  background: ${props =>
    props.hasLogo
        ? 'transparent'
        : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
};
  border-radius: 50%;
  margin-bottom: ${theme.spacing.sm};
  position: relative;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: ${props => props.hasLogo ? 'none' :
    `linear-gradient(90deg, 
        rgba(255,255,255,0) 0%, 
        rgba(255,255,255,0.15) 50%, 
        rgba(255,255,255,0) 100%)`
};
    background-size: 400px 100%;
    animation: ${shimmer} 2s infinite linear;
    z-index: -1;
    border-radius: 50%;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: linear-gradient(135deg, 
      rgba(255,255,255,0.5), 
      rgba(255,255,255,0.1), 
      rgba(0,0,0,0.1)
    );
    z-index: -1;
    opacity: ${props => props.hasLogo ? 0 : 0.7};
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
`;

const TeamName = styled.h3`
  font-size: ${theme.typography.fontSizes.md};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.textPrimary};
  text-align: center;
  margin: ${theme.spacing.sm} 0 0;
  transition: color 0.3s ease;
  background: linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.textPrimary});
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    height: 2px;
    width: 0;
    background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary});
    transition: width 0.3s ease;
  }
  
  ${LogoContainer}:hover &::after {
    width: 70%;
  }
`;


const TeamLogo = ({
                    name = 'The Tigers',
                    logo = null,
                    symbol = 'F5',
                    active = true
                  }) => {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    // Handle logo data conversion
    if (logo) {
      try {
        // If logo is already a URL
        if (typeof logo === 'string' && (logo.startsWith('http') || logo.startsWith('data:'))) {
          setLogoUrl(logo);
          return;
        }

        // Handle byte array or Uint8Array
        let binaryData;
        if (Array.isArray(logo)) {
          binaryData = new Uint8Array(logo);
        } else if (logo instanceof Uint8Array) {
          binaryData = logo;
        } else if (typeof logo === 'object') {
          console.log("Unknown logo format:", typeof logo, logo);
          binaryData = null;
        }

        if (binaryData) {
          const blob = new Blob([binaryData], { type: 'image/png' });
          const url = URL.createObjectURL(blob);
          setLogoUrl(url);

          // Clean up the URL when component unmounts
          return () => URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error("Error processing logo:", error);
        setLogoUrl(null);
      }
    } else {
      setLogoUrl(null);
    }
  }, [logo]);

  // Generate initial letters if only one word is provided
  const getInitials = () => {
    if (!name) return symbol;
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
  };

  return (
      <LogoContainer hasLogo={!!logoUrl}>
        <LogoSymbol className="logo-symbol" hasLogo={!!logoUrl}>
          {logoUrl ? (
              <LogoImage src={logoUrl} alt={`${name} logo`} />
          ) : (
              getInitials()
          )}
        </LogoSymbol>
        <TeamName className="team-name">{name}</TeamName>
      </LogoContainer>
  );
};

export default TeamLogo;