// src/pages/TournamentDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import HeaderJ from '../../components/layout/HeaderJ';

// Styled Components avec un design plus moderne
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const ContentContainer = styled.div`
  max-width: 11000px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #718096;
`;

const BreadcrumbLink = styled(Link)`
  color: #25A55F;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 8px;
`;

const TournamentHeader = styled.div`
  border-radius: 16px;
  margin-bottom: 24px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  position: relative;
`;

const HeaderImage = styled.div`
  height: 180px;
    image:"ramadan.jpg";
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(37,165,95,0.8));
  }
`;

const TournamentBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #25A55F;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  z-index: 5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    font-size: 12px;
  }
`;

const TournamentContent = styled.div`
  padding: 25px;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const TournamentTitle = styled.h1`
  font-size: 32px;
  margin: 0 0 10px 0;
  color: #1A202C;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background-color: #25A55F;
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const TournamentDescription = styled.p`
  font-size: 16px;
  color: #4A5568;
  line-height: 1.6;
  margin: 20px 0;
`;

const MetaInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin: 25px 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MetaInfoCard = styled.div`
  background-color: #F9FAFB;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
`;

const MetaIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgba(37, 165, 95, 0.1);
  color: #25A55F;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
`;

const MetaContent = styled.div`
  flex: 1;
`;

const MetaLabel = styled.div`
  font-size: 12px;
  color: #718096;
  margin-bottom: 2px;
`;

const MetaValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #2D3748;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 25px;
  
  @media (max-width: 991px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

const SideContent = styled.div`
  width: 320px;
  
  @media (max-width: 991px) {
    width: 100%;
  }
`;

const StatsCard = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const StatsCardHeader = styled.div`
  background-color: #25A55F;
  color: white;
  padding: 15px 20px;
  font-weight: 600;
  font-size: 16px;
`;

const StatsCardContent = styled.div`
  padding: 5px 0;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #EDF2F7;
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #718096;
`;

const StatValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2D3748;
`;

const ActionButton = styled.button`
  width: 100%;
  background-color: #25A55F;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 15px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 20px;
  box-shadow: 0 4px 10px rgba(37, 165, 95, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #1e8d4e;
  }
  
  &:disabled {
    background-color: #A0AEC0;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const TabsContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-top: 25px;
`;

const TabsHeader = styled.div`
  display: flex;
  background-color: #F7FAFC;
  border-bottom: 1px solid #EDF2F7;
  
  @media (max-width: 576px) {
    overflow-x: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const TabButton = styled.button`
  flex: 1;
  padding: 16px 5px;
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.active ? '#25A55F' : '#718096'};
  position: relative;
  cursor: pointer;
  min-width: 100px;
  transition: color 0.2s;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.active ? '#25A55F' : 'transparent'};
    transition: background-color 0.2s;
  }
  
  &:hover {
    color: ${props => props.active ? '#25A55F' : '#4A5568'};
  }
`;

const TabContent = styled.div`
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const RankingsTable = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 650px;
`;

const TableHeader = styled.thead`
    tr {
        background: linear-gradient(90deg, #f8fafc, #edf2f7);
        border-radius: 8px;
        overflow: hidden;

        th {
            padding: 14px 8px;
            text-align: center;
            position: relative;

            &:first-child {
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
            }

            &:last-child {
                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;
            }

            &:not(:last-child)::after {
                content: '';
                position: absolute;
                right: 0;
                top: 25%;
                height: 50%;
                width: 1px;
                background-color: rgba(0,0,0,0.05);
            }
        }
    }
`;
const HeaderText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.color || '#4A5568'};
  text-align: ${props => props.align || 'center'};
  display: block;
  transition: color 0.2s;
  
  &:hover {
    color: #25A55F;
  }
`;
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 18px;
    height: 18px;
    color: #4A5568;
  }
`;

const TrophyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.1601 16.74C14.9601 16.74 17.3201 14.55 17.3201 11.04L17.3201 5.86002L7.00007 5.86002L7.00007 11.04C7.00007 14.55 9.36007 16.74 12.1601 16.74Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.38013 9.60001C4.93013 9.12001 4.06013 7.80001 4.06013 6.15001L4.06013 5.86001L7.00013 5.86001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.9396 9.60001C19.3896 9.12001 20.2596 7.80001 20.2596 6.15001L20.2596 5.86001L17.3196 5.86001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.5 16.74L8.5 19.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.7998 16.74L15.7998 19.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.1604 19.24C10.6404 19.24 9.41039 20.06 9.41039 21.9L14.9104 21.9C14.9104 20.06 13.6804 19.24 12.1604 19.24Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const HeaderDot = styled.div`
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #25A55F, #1e8d4e);
  border-radius: 50%;
  margin: 0 auto;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(37, 165, 95, 0.2);
  
  &::after {
    content: 'Pts';
  }
`;

const HeaderTooltip = styled.div`
  position: relative;
  cursor: help;
  
  &::before {
    content: '${props => props.content}';
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%) scale(0.8);
    background-color: #2D3748;
    color: white;
    border-radius: 4px;
    padding: 5px 8px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s;
    z-index: 10;
    pointer-events: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%) scale(0.8);
    border-width: 5px;
    border-style: solid;
    border-color: #2D3748 transparent transparent transparent;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s;
    pointer-events: none;
  }
  
  &:hover::before, &:hover::after {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
  }
`;
const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #EDF2F7;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #F7FAFC;
    }
    
    &:last-child {
      border-bottom: none;
    }
    
    td {
      padding: 12px 15px;
      font-size: 14px;
      color: #2D3748;
    }
  }
`;

const RankCell = styled.td`
  font-weight: 700;
  width: 40px;
  
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: ${props => {
  if (props.rank === 1) return 'rgba(237, 137, 54, 0.1)';
  if (props.rank === 2) return 'rgba(160, 174, 192, 0.1)';
  if (props.rank === 3) return 'rgba(221, 107, 32, 0.1)';
  return 'transparent';
}};
    color: ${props => {
  if (props.rank === 1) return '#ED8936';
  if (props.rank === 2) return '#718096';
  if (props.rank === 3) return '#DD6B20';
  return 'inherit';
}};
  }
`;

const TeamCell = styled.td`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TeamLogo = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #25A55F;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(37, 165, 95, 0.2);
`;

const TeamName = styled.div`
  font-weight: 600;
  color: #2D3748;
`;

const PointsCell = styled.td`
  font-weight: 700;
  color: #25A55F;
`;

const MatchesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const MatchCard = styled.div`
  background-color: #F7FAFC;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const MatchCardHeader = styled.div`
  background-color: #25A55F;
  color: white;
  padding: 10px 15px;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MatchDate = styled.span`
  font-weight: 500;
`;

const MatchStatus = styled.span`
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => {
  if (props.status === 'completed') return 'rgba(255, 255, 255, 0.2)';
  if (props.status === 'live') return '#E53E3E';
  return 'rgba(255, 255, 255, 0.2)';
}};
`;

const MatchCardContent = styled.div`
  padding: 15px;
`;

const MatchTeams = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MatchTeam = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
`;

const MatchTeamLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #25A55F;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 8px;
  box-shadow: 0 3px 8px rgba(37, 165, 95, 0.2);
`;

const MatchTeamName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2D3748;
  text-align: center;
`;

const MatchScoreContainer = styled.div`
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MatchScore = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 8px 15px;
  font-size: 18px;
  font-weight: 700;
  color: #2D3748;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const MatchTime = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #25A55F;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px;
  color: #718096;
  font-size: 15px;
`;

// Icons components pour une touche visuelle
const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 13.5C11.45 13.5 11 13.95 11 14.5C11 15.05 11.45 15.5 12 15.5C12.55 15.5 13 15.05 13 14.5C13 13.95 12.55 13.5 12 13.5ZM12 13.5H12.01M16 13.5C15.45 13.5 15 13.95 15 14.5C15 15.05 15.45 15.5 16 15.5C16.55 15.5 17 15.05 17 14.5C17 13.95 16.55 13.5 16 13.5ZM16 13.5H16.01M8 13.5C7.45 13.5 7 13.95 7 14.5C7 15.05 7.45 15.5 8 15.5C8.55 15.5 9 15.05 9 14.5C9 13.95 8.55 13.5 8 13.5ZM8 13.5H8.01M12 17.5C11.45 17.5 11 17.95 11 18.5C11 19.05 11.45 19.5 12 19.5C12.55 19.5 13 19.05 13 18.5C13 17.95 12.55 17.5 12 17.5ZM12 17.5H12.01M16 17.5C15.45 17.5 15 17.95 15 18.5C15 19.05 15.45 19.5 16 19.5C16.55 19.5 17 19.05 17 18.5C17 17.95 16.55 17.5 16 17.5ZM16 17.5H16.01M8 17.5C7.45 17.5 7 17.95 7 18.5C7 19.05 7.45 19.5 8 19.5C8.55 19.5 9 19.05 9 18.5C9 17.95 8.55 17.5 8 17.5ZM8 17.5H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const TeamIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 7.16C17.94 7.15 17.87 7.15 17.81 7.16M18.2 4.5C19.97 4.5 21.5 6 21.5 7.75C21.5 9.5 19.97 11 18.2 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 7.16C17.94 7.15 17.87 7.15 17.81 7.16M18.2 4.5C19.97 4.5 21.5 6 21.5 7.75C21.5 9.5 19.97 11 18.2 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 7.16C6.06 7.15 6.13 7.15 6.19 7.16M5.8 4.5C4.03 4.5 2.5 6 2.5 7.75C2.5 9.5 4.03 11 5.8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 11C13.933 11 15.5 9.433 15.5 7.5C15.5 5.567 13.933 4 12 4C10.067 4 8.5 5.567 8.5 7.5C8.5 9.433 10.067 11 12 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.5 19.5V18.8C15.5 16.58 13.71 14.8 11.5 14.8H12.5C14.71 14.8 16.5 16.58 16.5 18.8V19.5M8.5 19.5V18.8C8.5 16.58 6.71 14.8 4.5 14.8H5.5C7.71 14.8 9.5 16.58 9.5 18.8V19.5M19.5 19.5V18.8C19.5 16.58 17.71 14.8 15.5 14.8H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const MoneyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.67188 14.3298C8.67188 15.6198 9.66188 16.6598 10.8919 16.6598H13.4019C14.4719 16.6598 15.3419 15.7498 15.3419 14.6298C15.3419 13.4098 14.8119 12.9798 14.0219 12.6998L9.99187 11.2998C9.20187 11.0198 8.67188 10.5898 8.67188 9.36984C8.67188 8.24984 9.54187 7.33984 10.6119 7.33984H13.1219C14.3519 7.33984 15.3419 8.37984 15.3419 9.66984M12 6V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const LocationIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 13.4299C13.7231 13.4299 15.12 12.0331 15.12 10.3099C15.12 8.58681 13.7231 7.18994 12 7.18994C10.2769 7.18994 8.88 8.58681 8.88 10.3099C8.88 12.0331 10.2769 13.4299 12 13.4299Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3.62 8.49C5.59 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
);

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 12H18M12 18V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// Main Component
const TournamentDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('rankings');
  const [tournamentData, setTournamentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simuler le chargement des données du tournoi
  useEffect(() => {
    // Normalement, vous feriez un appel API ici
    setTimeout(() => {
      setTournamentData({
        id: 4,
        title: "TOURNOI DE RAMADAN",
        description: "Un tournoi spécial organisé pendant le mois sacré de Ramadan avec des matchs en nocturne après la rupture du jeûne. Une ambiance exceptionnelle et fraternelle pour ce tournoi qui rassemble les meilleures équipes de la région.",
        date: "15-30 Mars 2025",
        equipes: 11,
        equipes_inscrites: 11,
        prix: "1800 MAD/équipe",
        lieu: "Complexe Sportif AHFIR",
        status: " Prochaine session le 18/2/2026",
        date_limite_inscription: "10 Mars 2025",
        organisateur: "Association Sportive AHFIR",
        label: "Spécial Ramadan",
        matchs_joues: 12,
        matchs_restants: 54,
        // Classement simulé des équipes
        rankings: [
          { rank: 1, team: "FC Atlas", played: 4, won: 4, drawn: 0, lost: 0, goalsFor: 12, goalsAgainst: 2, points: 12 },
          { rank: 2, team: "Étoiles du Sahara", played: 4, won: 3, drawn: 1, lost: 0, goalsFor: 10, goalsAgainst: 3, points: 10 },
          { rank: 3, team: "Raja Futsal", played: 4, won: 3, drawn: 0, lost: 1, goalsFor: 9, goalsAgainst: 4, points: 9 },
          { rank: 4, team: "Les Aigles", played: 4, won: 2, drawn: 2, lost: 0, goalsFor: 8, goalsAgainst: 5, points: 8 },
          { rank: 5, team: "Wydad Futsal", played: 4, won: 2, drawn: 1, lost: 1, goalsFor: 7, goalsAgainst: 5, points: 7 },
          { rank: 6, team: "Lions de l'Atlas", played: 4, won: 2, drawn: 0, lost: 2, goalsFor: 6, goalsAgainst: 6, points: 6 },
          { rank: 7, team: "Casablanca Stars", played: 4, won: 1, drawn: 2, lost: 1, goalsFor: 5, goalsAgainst: 6, points: 5 },
          { rank: 8, team: "Faucons du Maroc", played: 4, won: 1, drawn: 1, lost: 2, goalsFor: 4, goalsAgainst: 7, points: 4 },
          { rank: 9, team: "Olympique Futsal", played: 4, won: 1, drawn: 0, lost: 3, goalsFor: 3, goalsAgainst: 8, points: 3 },
          { rank: 10, team: "Phoenix FC", played: 4, won: 0, drawn: 1, lost: 3, goalsFor: 2, goalsAgainst: 9, points: 1 },
          { rank: 11, team: "Dragons de Fès", played: 4, won: 0, drawn: 0, lost: 4, goalsFor: 1, goalsAgainst: 12, points: 0 }
        ],
        // Matchs à venir et terminés
        matches: [
          {
            id: 1,
            date: "15 Mars 2025",
            time: "21:30",
            homeTeam: "FC Atlas",
            awayTeam: "Dragons de Fès",
            homeScore: 4,
            awayScore: 0,
            status: "completed"
          },
          {
            id: 2,
            date: "16 Mars 2025",
            time: "21:30",
            homeTeam: "Étoiles du Sahara",
            awayTeam: "Phoenix FC",
            homeScore: 3,
            awayScore: 1,
            status: "completed"
          },
          {
            id: 3,
            date: "17 Mars 2025",
            time: "22:00",
            homeTeam: "Raja Futsal",
            awayTeam: "Olympique Futsal",
            homeScore: 2,
            awayScore: 0,
            status: "completed"
          },
          {
            id: 4,
            date: "20 Mars 2025",
            time: "21:30",
            homeTeam: "FC Atlas",
            awayTeam: "Étoiles du Sahara",
            homeScore: null,
            awayScore: null,
            status: "upcoming"
          },
          {
            id: 5,
            date: "21 Mars 2025",
            time: "22:00",
            homeTeam: "Lions de l'Atlas",
            awayTeam: "Raja Futsal",
            homeScore: null,
            awayScore: null,
            status: "upcoming"
          },
          {
            id: 6,
            date: "22 Mars 2025",
            time: "21:00",
            homeTeam: "Wydad Futsal",
            awayTeam: "Faucons du Maroc",
            homeScore: null,
            awayScore: null,
            status: "upcoming"
          }
        ]
      });
      setIsLoading(false);
    }, 800);
  }, [id]);

  if (isLoading) {
    return (
        <PageContainer>
          <HeaderJ />
          <ContentContainer>
            <div style={{ textAlign: 'center', padding: '50px' }}>
              Chargement des informations du tournoi...
            </div>
          </ContentContainer>
        </PageContainer>
    );
  }

  if (!tournamentData) {
    return (
        <PageContainer>
          <HeaderJ />
          <ContentContainer>
            <div style={{ textAlign: 'center', padding: '50px' }}>
              Tournoi non trouvé
            </div>
          </ContentContainer>
        </PageContainer>
    );
  }

  return (
      <PageContainer>
        <HeaderJ />
        <ContentContainer>
          {/* Fil d'Ariane */}
          <BreadcrumbNav>
            <BreadcrumbLink to="/">Accueil</BreadcrumbLink>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbLink to="/tournois">Tournois</BreadcrumbLink>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            {tournamentData.title}
          </BreadcrumbNav>

          {/* Header du tournoi */}
          <TournamentHeader>
            <HeaderImage />
            <TournamentBadge>{tournamentData.label}</TournamentBadge>
            <TournamentContent>
              <TournamentTitle>{tournamentData.title}</TournamentTitle>
              <TournamentDescription>{tournamentData.description}</TournamentDescription>

              <MetaInfoGrid>
                <MetaInfoCard>
                  <MetaIcon><CalendarIcon /></MetaIcon>
                  <MetaContent>
                    <MetaLabel>Date</MetaLabel>
                    <MetaValue>{tournamentData.date}</MetaValue>
                  </MetaContent>
                </MetaInfoCard>

                <MetaInfoCard>
                  <MetaIcon><TeamIcon /></MetaIcon>
                  <MetaContent>
                    <MetaLabel>Équipes</MetaLabel>
                    <MetaValue>{tournamentData.equipes_inscrites}/{tournamentData.equipes}</MetaValue>
                  </MetaContent>
                </MetaInfoCard>

                <MetaInfoCard>
                  <MetaIcon><MoneyIcon /></MetaIcon>
                  <MetaContent>
                    <MetaLabel>Prix</MetaLabel>
                    <MetaValue>{tournamentData.prix}</MetaValue>
                  </MetaContent>
                </MetaInfoCard>

                <MetaInfoCard>
                  <MetaIcon><LocationIcon /></MetaIcon>
                  <MetaContent>
                    <MetaLabel>Lieu</MetaLabel>
                    <MetaValue>{tournamentData.lieu}</MetaValue>
                  </MetaContent>
                </MetaInfoCard>
              </MetaInfoGrid>
            </TournamentContent>
          </TournamentHeader>

          <FlexContainer>
            <MainContent>
              <TabsContainer>
                <TabsHeader>
                  <TabButton
                      active={activeTab === 'rankings'}
                      onClick={() => setActiveTab('rankings')}
                  >
                    Classement
                  </TabButton>
                  <TabButton
                      active={activeTab === 'matches'}
                      onClick={() => setActiveTab('matches')}
                  >
                    Matchs
                  </TabButton>

                </TabsHeader>

                <TabContent>
                  {activeTab === 'rankings' && (
                      <RankingsTable>
                        <Table>
                          <TableHeader>
                            <tr>
                              <th>
                                <HeaderTooltip content="Position">
                                  <IconWrapper>
                                    <TrophyIcon />
                                  </IconWrapper>
                                </HeaderTooltip>
                              </th>
                              <th>
                                <HeaderText align="left">Équipe</HeaderText>
                              </th>
                              <th>
                                <HeaderTooltip content="Matchs Joués">
                                  <HeaderText>J</HeaderText>
                                </HeaderTooltip>
                              </th>
                              <th>
                                <HeaderTooltip content="Victoires">
                                  <HeaderText color="#00c4ff">V</HeaderText>
                                </HeaderTooltip>
                              </th>
                              <th>
                                <HeaderTooltip content="Matchs Nuls">
                                  <HeaderText color="#F6AD55">N</HeaderText>
                                </HeaderTooltip>
                              </th>
                              <th>
                                <HeaderTooltip content="Défaites">
                                  <HeaderText color="#F56565">D</HeaderText>
                                </HeaderTooltip>
                              </th>
                              <th>
                                <HeaderTooltip content="Buts Pour">
                                  <HeaderText>BP</HeaderText>
                                </HeaderTooltip>
                              </th>
                              <th>
                                <HeaderTooltip content="Buts Contre">
                                  <HeaderText>BC</HeaderText>
                                </HeaderTooltip>
                              </th>
                              <th>
                                <HeaderTooltip content="Différence de buts">
                                  <HeaderText>+/-</HeaderText>
                                </HeaderTooltip>
                              </th>
                              <th>
                                <HeaderTooltip content="Points">
                                  <HeaderDot />
                                </HeaderTooltip>
                              </th>
                            </tr>
                          </TableHeader>
                          <TableBody>
                            {tournamentData.rankings.map((team) => (
                                <tr key={team.rank}>
                                  <RankCell rank={team.rank}>
                                    <span>{team.rank}</span>
                                  </RankCell>
                                  <TeamCell>
                                    <TeamLogo>{team.team.charAt(0)}</TeamLogo>
                                    <TeamName>{team.team}</TeamName>
                                  </TeamCell>
                                  <td>{team.played}</td>
                                  <td>{team.won}</td>
                                  <td>{team.drawn}</td>
                                  <td>{team.lost}</td>
                                  <td>{team.goalsFor}</td>
                                  <td>{team.goalsAgainst}</td>
                                  <td>{team.goalsFor - team.goalsAgainst}</td>
                                  <PointsCell>{team.points}</PointsCell>
                                </tr>
                            ))}
                          </TableBody>
                        </Table>
                      </RankingsTable>
                  )}

                  {activeTab === 'matches' && (
                      <MatchesContainer>
                        {tournamentData.matches.map((match) => (
                            <MatchCard key={match.id}>
                              <MatchCardHeader>
                                <MatchDate>{match.date}</MatchDate>
                                <MatchStatus status={match.status}>
                                  {match.status === 'completed' ? 'Terminé' :
                                      match.status === 'live' ? 'En direct' : 'À venir'}
                                </MatchStatus>
                              </MatchCardHeader>
                              <MatchCardContent>
                                <MatchTeams>
                                  <MatchTeam>
                                    <MatchTeamLogo>{match.homeTeam.charAt(0)}</MatchTeamLogo>
                                    <MatchTeamName>{match.homeTeam}</MatchTeamName>
                                  </MatchTeam>

                                  <MatchScoreContainer>
                                    {match.status === 'completed' ? (
                                        <MatchScore>
                                          {match.homeScore} - {match.awayScore}
                                        </MatchScore>
                                    ) : (
                                        <MatchTime>{match.time}</MatchTime>
                                    )}
                                  </MatchScoreContainer>

                                  <MatchTeam>
                                    <MatchTeamLogo>{match.awayTeam.charAt(0)}</MatchTeamLogo>
                                    <MatchTeamName>{match.awayTeam}</MatchTeamName>
                                  </MatchTeam>
                                </MatchTeams>
                              </MatchCardContent>
                            </MatchCard>
                        ))}
                      </MatchesContainer>
                  )}

                  {activeTab === 'teams' && (
                      <EmptyState>
                        Information sur les équipes participantes à venir...
                      </EmptyState>
                  )}

                  {activeTab === 'info' && (
                      <EmptyState>
                        Plus d'informations sur le tournoi à venir...
                      </EmptyState>
                  )}
                </TabContent>
              </TabsContainer>
            </MainContent>

            <SideContent>
              <StatsCard>
                <StatsCardHeader>
                  Informations du tournoi
                </StatsCardHeader>
                <StatsCardContent>
                  <StatItem>
                    <StatLabel>Statut</StatLabel>
                    <StatValue>{tournamentData.status}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Organisateur</StatLabel>
                    <StatValue>{tournamentData.organisateur}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Équipes inscrites</StatLabel>
                    <StatValue>{tournamentData.equipes_inscrites}/{tournamentData.equipes}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Matchs joués</StatLabel>
                    <StatValue>{tournamentData.matchs_joues}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Matchs restants</StatLabel>
                    <StatValue>{tournamentData.matchs_restants}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Inscription jusqu'au</StatLabel>
                    <StatValue>{tournamentData.date_limite_inscription}</StatValue>
                  </StatItem>
                </StatsCardContent>
              </StatsCard>

              <ActionButton
                  disabled={tournamentData.equipes_inscrites >= tournamentData.equipes}
              >
                <PlusIcon /> Inscrire mon équipe
              </ActionButton>
            </SideContent>
          </FlexContainer>
        </ContentContainer>
      </PageContainer>
  );
};

export default TournamentDetails;