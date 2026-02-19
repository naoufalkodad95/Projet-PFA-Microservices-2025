// src/components/team/RequestsTable.jsx
import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import RequestRow from './RequestRow';

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

const AddPlayerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  margin: ${theme.spacing.md} auto;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background-color: transparent;
  border: 1px dashed ${theme.colors.primary};
  border-radius: ${theme.borderRadius.small};
  color: ${theme.colors.primary};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.lightPrimary};
  }
`;

const RequestsTable = ({
                         requests = [],
                         onAccept,
                         onReject,
                         onAddPlayer
                       }) => {
  return (
      <TableContainer>
        <TableTitle>Membership Requests</TableTitle>

        {requests.length > 0 ? (
            <StyledTable>
              <thead>
              <tr>
                <th style={{ width: '50px' }}></th>
                <th>Name</th>
                <th>Position</th>
                <th>Goals scored</th>
                <th>Email</th>
                <th style={{ width: '180px' }}>Actions</th>
              </tr>
              </thead>
              <tbody>
              {requests.map(request => (
                  <RequestRow
                      key={request.id}
                      request={request}
                      onAccept={() => onAccept(request)}
                      onReject={() => onReject(request)}
                  />
              ))}
              </tbody>
            </StyledTable>
        ) : (
            <EmptyStateMessage>No pending membership requests.</EmptyStateMessage>
        )}

        <AddPlayerButton onClick={onAddPlayer}>
          + Add a player
        </AddPlayerButton>
      </TableContainer>
  );
};

export default RequestsTable;