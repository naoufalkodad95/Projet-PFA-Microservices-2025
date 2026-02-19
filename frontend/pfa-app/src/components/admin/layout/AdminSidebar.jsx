import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  width: 220px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  padding: 20px 0;
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 5px;
`;

const StyledNavLink = styled(NavLink)`
  display: block;
  padding: 10px 15px;
  color: #333333;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: all 0.3s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &.active {
    background-color: #f0f0f0;
    border-left-color: #25A55F;
    font-weight: bold;
  }
`;

const SectionTitle = styled.h3`
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  padding: 15px 15px 5px;
  margin: 0;
`;

const AdminSidebar = () => {
  return (
      <SidebarContainer>
        <NavMenu>
          <SectionTitle>Général</SectionTitle>
          <NavItem>
            <StyledNavLink to="/admin" end>Tableau de bord</StyledNavLink>
          </NavItem>

          <SectionTitle>Matchs</SectionTitle>
          <NavItem>
            <StyledNavLink to="/admin/matches">Planification</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/admin/results">Saisie des résultats</StyledNavLink>
          </NavItem>

          <SectionTitle>Tournois</SectionTitle>
          <NavItem>
            <StyledNavLink to="/admin/tournaments">Gestion des tournois</StyledNavLink>
          </NavItem>

          <SectionTitle>Configuration</SectionTitle>
          <NavItem>
            <StyledNavLink to="/admin/teams">Équipes</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/admin/fields">Terrains</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/admin/users">Utilisateurs</StyledNavLink>
          </NavItem>
        </NavMenu>
      </SidebarContainer>
  );
};

export default AdminSidebar;