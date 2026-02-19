// src/components/team/MembersTable.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Avatar from '../common/Avatar';
import theme from '../../styles/theme';
import MemberRow from './MemberRow';

const TableContainer = styled.div`
    width: 100%;
    border-radius: ${theme.borderRadius.medium};
    overflow: hidden;
    background-color: ${theme.colors.background};
    box-shadow: ${theme.shadows.small};
    border: 1px solid ${theme.colors.border};
`;

const TableTitle = styled.div`
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.fontSizes.lg};
  font-weight: ${theme.typography.fontWeights.medium};
  color: ${theme.colors.textPrimary};
  border-bottom: 1px solid ${theme.colors.border};
`;

const StyledTable = styled.table`
  width: 100%;
  
  th {
    padding: ${theme.spacing.md};
    text-align: left;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.textOnPrimary};
    font-weight: ${theme.typography.fontWeights.medium};
  }
  
  tr:nth-child(even) {
    background-color: ${theme.colors.cardBackground};
  }
  
  tr:hover {
    background-color: ${theme.colors.lightPrimary};
  }
`;

const EmptyStateMessage = styled.div`
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.textSecondary};
`;

// Composant pour le menu d'actions
const ActionMenu = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.small};
  box-shadow: ${theme.shadows.medium};
  z-index: 10;
  min-width: 120px;
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
`;

const ActionMenuItem = styled.button`
  width: 100%;
  text-align: left;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  background-color: transparent;
  cursor: pointer;
  
  &:hover {
    background-color: ${theme.colors.lightPrimary};
  }
  
  &.delete {
    color: ${theme.colors.negative};
    
    &:hover {
      background-color: rgba(211, 84, 0, 0.1);
    }
  }
`;

const MembersTable = ({
                        members = [],
                        onPromote,
                        onEditMember,
                        onRemoveMember
                      }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (memberId) => {
    setActiveMenu(activeMenu === memberId ? null : memberId);
  };

  const handleActionClick = (action, member) => {
    setActiveMenu(null);

    switch(action) {
      case 'edit':
        onEditMember(member);
        break;
      case 'promote':
        onPromote(member);
        break;
      case 'remove':
        onRemoveMember(member);
        break;
      default:
        break;
    }
  };

  return (
      <TableContainer>
        <TableTitle>Team Members</TableTitle>

        {members.length > 0 ? (
            <StyledTable>
              <thead>
              <tr>
                <th style={{ width: '50px' }}></th>
                <th>Name</th>
                <th>Position</th>
                <th>Role</th>
                <th>Goals</th>
                <th>Email</th>
                <th style={{ width: '60px' }}>Actions</th>
              </tr>
              </thead>
              <tbody>
              {members.map(member => (
                  <MemberRow
                      key={member.id}
                      member={member}
                      isMenuOpen={activeMenu === member.id}
                      onToggleMenu={() => toggleMenu(member.id)}
                      onActionClick={(action) => handleActionClick(action, member)}
                  />
              ))}
              </tbody>
            </StyledTable>
        ) : (
            <EmptyStateMessage>No team members yet. Add your first player!</EmptyStateMessage>
        )}
      </TableContainer>
  );
};

export default MembersTable;