// src/components/common/Tabs.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

const TabsContainer = styled.div`
    width: 100%;
    margin-bottom: ${theme.spacing.lg};
`;

const TabsList = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.border};
`;

const TabButton = styled.button`
  flex: 1;
  padding: ${theme.spacing.md};
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.background};
  color: ${props => props.active ? theme.colors.textOnPrimary : theme.colors.textPrimary};
  border: none;
  border-bottom: 3px solid transparent;
  border-bottom-color: ${props => props.active ? theme.colors.primary : 'transparent'};
  border-top-left-radius: ${theme.borderRadius.small};
  border-top-right-radius: ${theme.borderRadius.small};
  font-weight: ${theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  position: relative;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.active ? theme.colors.primary : theme.colors.lightPrimary};
    color: ${props => props.active ? theme.colors.textOnPrimary : theme.colors.primary};
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.secondary};
  color: ${theme.colors.textOnPrimary};
  border-radius: ${theme.borderRadius.round};
  font-size: ${theme.typography.fontSizes.xs};
  min-width: 20px;
  height: 20px;
  margin-left: ${theme.spacing.sm};
  padding: 0 ${theme.spacing.xs};
`;

const TabContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
  padding: ${theme.spacing.lg} 0;
`;

const Tabs = ({ tabs = [], defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
      <TabsContainer>
        <TabsList>
          {tabs.map((tab, index) => (
              <TabButton
                  key={index}
                  active={activeTab === index}
                  onClick={() => setActiveTab(index)}
              >
                {tab.label}
                {tab.badge && <Badge>{tab.badge}</Badge>}
              </TabButton>
          ))}
        </TabsList>

        {tabs.map((tab, index) => (
            <TabContent key={index} active={activeTab === index}>
              {tab.content}
            </TabContent>
        ))}
      </TabsContainer>
  );
};

export default Tabs;