// // src/components/team/MemberRow.jsx
// import React from 'react';
// import styled from 'styled-components';
// import Avatar from '../common/Avatar';
// import theme from '../../styles/theme';
//
// const TableRow = styled.tr`
//     &:hover {
//         background-color: ${theme.colors.lightPrimary};
//     }
// `;
//
// const TableCell = styled.td`
//     padding: ${theme.spacing.md};
//     vertical-align: middle;
// `;
//
// const AvatarCell = styled(TableCell)`
//   text-align: center;
// `;
//
// const RoleCell = styled(TableCell)`
//   font-weight: ${props => props.isCaptain ? theme.typography.fontWeights.bold : 'normal'};
//   color: ${props => props.isCaptain ? theme.colors.primary : theme.colors.textSecondary};
// `;
//
// const GoalsCell = styled(TableCell)`
//   font-weight: ${theme.typography.fontWeights.medium};
//   color: ${theme.colors.textPrimary};
// `;
//
// const ActionsCell = styled(TableCell)`
//   text-align: center;
//   position: relative;
// `;
//
// const ActionButton = styled.button`
//   background: none;
//   border: none;
//   cursor: pointer;
//   font-size: ${theme.typography.fontSizes.lg};
//   color: ${theme.colors.textSecondary};
//   height: 24px;
//   width: 24px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 0;
//
//   &:hover {
//     color: ${theme.colors.primary};
//   }
// `;
//
// const MenuContainer = styled.div`
//   position: absolute;
//   top: 100%;
//   right: ${theme.spacing.md};
//   background-color: ${theme.colors.background};
//   border: 1px solid ${theme.colors.border};
//   border-radius: ${theme.borderRadius.small};
//   box-shadow: ${theme.shadows.medium};
//   z-index: 10;
//   overflow: hidden;
// `;
//
// const MenuItem = styled.button`
//   width: 100%;
//   text-align: left;
//   padding: ${theme.spacing.sm} ${theme.spacing.md};
//   background: none;
//   border: none;
//   cursor: pointer;
//   white-space: nowrap;
//
//   &:hover {
//     background-color: ${theme.colors.lightPrimary};
//   }
//
//   &.danger {
//     color: ${theme.colors.negative};
//
//     &:hover {
//       background-color: rgba(211, 84, 0, 0.1);
//     }
//   }
// `;
//
// const MemberRow = ({
//                      member,
//                      isMenuOpen,
//                      onToggleMenu,
//                      onActionClick
//                    }) => {
//   const isCaptain = member.role === 'Captain';
//
//   return (
//       <TableRow>
//         <AvatarCell>
//           <Avatar id={member.id} name={member.name} image={member.avatar} size="small" />
//         </AvatarCell>
//         <TableCell>{member.name}</TableCell>
//         <TableCell>{member.position}</TableCell>
//         <RoleCell isCaptain={isCaptain}>
//           {isCaptain ? 'Captain' : 'Player'}
//         </RoleCell>
//         <GoalsCell>{member.goals}</GoalsCell>
//         <TableCell>{member.email}</TableCell>
//         <ActionsCell>
//           <ActionButton onClick={onToggleMenu} aria-label="Member actions">
//             ⋮
//           </ActionButton>
//
//           {isMenuOpen && (
//               <MenuContainer>
//                 {!isCaptain && (
//                     <MenuItem onClick={() => onActionClick('promote')}>
//                       Make Captain
//                     </MenuItem>
//                 )}
//                 <MenuItem onClick={() => onActionClick('edit')}>
//                   Edit
//                 </MenuItem>
//                 {!isCaptain && (
//                     <MenuItem
//                         className="danger"
//                         onClick={() => onActionClick('remove')}
//                     >
//                       Remove
//                     </MenuItem>
//                 )}
//               </MenuContainer>
//           )}
//         </ActionsCell>
//       </TableRow>
//   );
// };
//
// export default MemberRow;

import React from 'react';
import styled from 'styled-components';
import Avatar from '../common/Avatar';
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

const RoleCell = styled(TableCell)`
    font-weight: ${props => props.isCaptain ? theme.typography.fontWeights.bold : 'normal'};
    color: ${props => props.isCaptain ? theme.colors.primary : theme.colors.textSecondary};
`;

const GoalsCell = styled(TableCell)`
    font-weight: ${theme.typography.fontWeights.medium};
    color: ${theme.colors.textPrimary};
`;

const ActionsCell = styled(TableCell)`
    text-align: right;
`;

// Styled action buttons
const ActionButton = styled.button`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: white;
    color: ${props => props.color || '#333'};
    border: 1px solid ${props => props.color || '#e0e0e0'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    cursor: pointer;
    margin: 0 4px;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    &:hover {
        background: ${props => props.color || '#f5f5f5'};
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
        transform: translateY(0);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        &:hover {
            background: white;
            color: ${props => props.color || '#333'};
            transform: none;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 6px;
    justify-content: flex-end;
`;

const MemberRow = ({
                     member,
                     onActionClick
                   }) => {
  const isCaptain = member.role === 'Captain';

  return (
      <TableRow>
        <AvatarCell>
          <Avatar id={member.id} name={member.name} image={member.avatar} size="small" />
        </AvatarCell>
        <TableCell>{member.name}</TableCell>
        <TableCell>{member.position}</TableCell>
        <RoleCell isCaptain={isCaptain}>
          {isCaptain ? 'Captain' : 'Player'}
        </RoleCell>
        <GoalsCell>{member.goals}</GoalsCell>
        <TableCell>{member.email}</TableCell>
        <ActionsCell>
          <ButtonContainer>
            <ActionButton
                title="Voir les détails"
                color="#4caf50"
                onClick={() => onActionClick('view', member)}
            >
              👁️
            </ActionButton>
            <ActionButton
                title="Modifier"
                color="#2196f3"
                onClick={() => onActionClick('edit', member)}
            >
              ✎
            </ActionButton>
            {!isCaptain && (
                <ActionButton
                    title="Promouvoir Capitaine"
                    color="#ff9800"
                    onClick={() => onActionClick('promote', member)}
                >
                  ⭐
                </ActionButton>
            )}
            <ActionButton
                title="Supprimer"
                color="#f44336"
                onClick={() => onActionClick('remove', member)}
                disabled={isCaptain}
            >
              ✕
            </ActionButton>
          </ButtonContainer>
        </ActionsCell>
      </TableRow>
  );
};

export default MemberRow;