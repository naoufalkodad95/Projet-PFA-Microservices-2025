// src/components/team/RequestRow.jsx
import React from 'react';
import styled from 'styled-components';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import theme from '../../styles/theme';

const TableRow = styled.tr`
    &:hover {
        background-color: ${theme.colors.lightPrimary};
    }
`;

const TableCell = styled.td`
  padding: ${theme.spacing.md};
  vertical-align: middle;
`;

const AvatarCell = styled(TableCell)`
  text-align: center;
`;

const GoalsCell = styled(TableCell)`
  font-weight: ${theme.typography.fontWeights.medium};
  color: ${theme.colors.textPrimary};
`;

const ActionsCell = styled(TableCell)`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const ActionButton = styled(Button)`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.typography.fontSizes.sm};
`;

const RequestRow = ({
                      request,
                      onAccept,
                      onReject
                    }) => {
  return (
      <TableRow>
        <AvatarCell>
          <Avatar id={request.id} name={request.name} image={request.avatar} size="small" />
        </AvatarCell>
        <TableCell>{request.name}</TableCell>
        <TableCell>{request.position}</TableCell>
        <GoalsCell>{request.goals}</GoalsCell>
        <TableCell>{request.email}</TableCell>
        <ActionsCell>
          <ActionButton
              buttonType="filled"
              variant="primary"
              onClick={onAccept}
              size="small"
          >
            Accept
          </ActionButton>
          <ActionButton
              buttonType="outlined"
              variant="secondary"
              onClick={onReject}
              size="small"
          >
            Reject
          </ActionButton>
        </ActionsCell>
      </TableRow>
  );
};

export default RequestRow;