import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import React, { useState, useEffect } from 'react';

const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f8f9fa;
`;

const ContentContainer = styled.div`
    display: flex;
    flex: 1;
`;

const Sidebar = styled.aside`
    width: ${props => props.collapsed ? '70px' : '240px'};
    background-color: #fff;
    box-shadow: 1px 0 5px rgba(0, 0, 0, 0.05);
    overflow-y: auto;
    overflow-x: hidden;
    transition: width 0.3s ease;
    z-index: 90;
    height: calc(100vh - 64px);
    position: sticky;
    top: 64px;

    @media (max-width: 992px) {
        position: fixed;
        top: 64px;
        bottom: 0;
        left: ${props => props.open ? '0' : '-240px'};
        width: 240px;
        z-index: 100;
        transition: left 0.3s ease;
    }
`;

const SidebarNav = styled.nav`
    display: flex;
    flex-direction: column;
    padding: ${props => props.collapsed ? '16px 12px' : '16px 0'};
`;

const SidebarSection = styled.div`
    margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
    font-size: ${props => props.collapsed ? '0' : '0.75rem'};
    text-transform: uppercase;
    color: #9e9e9e;
    padding: ${props => props.collapsed ? '0' : '0 24px 8px'};
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    letter-spacing: 0.5px;
    transition: font-size 0.3s ease;
`;

const SidebarLink = styled(NavLink)`
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #555;
    padding: ${props => props.collapsed ? '10px' : '10px 24px'};
    border-radius: ${props => props.collapsed ? '8px' : '0'};
    margin-bottom: 2px;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
        background-color: #f5f5f5;
        color: #333;
    }

    &.active {
        background-color: ${props => props.collapsed ? '#e8f5e9' : 'transparent'};
        color: #25A55F;
        border-left: ${props => props.collapsed ? 'none' : '3px solid #25A55F'};

        svg, .icon {
            color: #25A55F;
        }
    }
`;

const SidebarIcon = styled.div`
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    margin-right: ${props => props.collapsed ? '0' : '12px'};
    color: #666;
`;

const SidebarText = styled.span`
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    transition: opacity 0.3s ease;
    opacity: ${props => props.collapsed ? '0' : '1'};
    width: ${props => props.collapsed ? '0' : 'auto'};
`;

const MainContent = styled.main`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    min-height: calc(100vh - 64px);
`;

const CollapseButton = styled.button`
    position: absolute;
    bottom: 20px;
    ${props => props.collapsed ? 'right: 50%' : 'right: 20px'};
    transform: ${props => props.collapsed ? 'translateX(50%)' : 'none'};
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f0f0f0;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #666;
    font-size: 1rem;

    &:hover {
        background: #e0e0e0;
    }

    @media (max-width: 992px) {
        display: none;
    }
`;

const Overlay = styled.div`
    display: ${props => props.show ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 95;
`;

const Footer = styled.footer`
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
    padding: 12px 24px;
    text-align: center;
    font-size: 0.8rem;
    color: #666;
`;

// AdminLayout Component
const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    // Sur mobile, ouvrir/fermer la sidebar
    if (window.innerWidth <= 992) {
      setSidebarOpen(!sidebarOpen);
    }
    // Sur desktop, réduire/étendre la sidebar
    else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Fermer le sidebar sur mobile quand on change de page
  useEffect(() => {
    if (window.innerWidth <= 992) {
      setSidebarOpen(false);
    }
  }, [location]);

  return (
      <LayoutContainer>
        <AdminHeader toggleSidebar={toggleSidebar} />

        <ContentContainer>
          {/* Overlay pour fermer la sidebar en mobile */}
          <Overlay
              show={sidebarOpen}
              onClick={() => setSidebarOpen(false)}
          />

          <Sidebar collapsed={sidebarCollapsed} open={sidebarOpen}>
            <SidebarNav collapsed={sidebarCollapsed}>
              <SidebarSection>
                <SectionTitle collapsed={sidebarCollapsed}>Principal</SectionTitle>
                <SidebarLink
                    to="/admin"
                    collapsed={sidebarCollapsed ? 1 : 0}
                    end
                >
                  <SidebarIcon collapsed={sidebarCollapsed ? 1 : 0}>📊</SidebarIcon>
                  <SidebarText collapsed={sidebarCollapsed ? 1 : 0}>Tableau de bord</SidebarText>
                </SidebarLink>
              </SidebarSection>

              <SidebarSection>
                <SectionTitle collapsed={sidebarCollapsed ? 1 : 0}>Planification</SectionTitle>
                <SidebarLink
                    to="/admin/matches"
                    collapsed={sidebarCollapsed ? 1 : 0}
                >
                  <SidebarIcon collapsed={sidebarCollapsed ? 1 : 0}>📅</SidebarIcon>
                  <SidebarText collapsed={sidebarCollapsed ? 1 : 0}>Planifier des matchs</SidebarText>
                </SidebarLink>
                <SidebarLink
                    to="/admin/results"
                    collapsed={sidebarCollapsed ? 1 : 0}
                >
                  <SidebarIcon collapsed={sidebarCollapsed ? 1 : 0}>📝</SidebarIcon>
                  <SidebarText collapsed={sidebarCollapsed ? 1 : 0}>Saisir des résultats</SidebarText>
                </SidebarLink>
                <SidebarLink
                    to="/tournois"
                    collapsed={sidebarCollapsed ? 1 : 0}
                >
                  <SidebarIcon collapsed={sidebarCollapsed ? 1 : 0}>🏆</SidebarIcon>
                  <SidebarText collapsed={sidebarCollapsed ? 1 : 0}>Tournois</SidebarText>
                </SidebarLink>
              </SidebarSection>

              <SidebarSection>
                <SectionTitle collapsed={sidebarCollapsed ? 1 : 0}>Gestion</SectionTitle>
                <SidebarLink
                    to="/equipes"
                    collapsed={sidebarCollapsed ? 1 : 0}
                >
                  <SidebarIcon collapsed={sidebarCollapsed ? 1 : 0}>👥</SidebarIcon>
                  <SidebarText collapsed={sidebarCollapsed ? 1 : 0}>Équipes</SidebarText>
                </SidebarLink>
                <SidebarLink
                    to="/admin/Reservation/Terrains"
                    collapsed={sidebarCollapsed ? 1 : 0}
                >
                  <SidebarIcon collapsed={sidebarCollapsed ? 1 : 0}>🏟️</SidebarIcon>
                  <SidebarText collapsed={sidebarCollapsed ? 1 : 0}>Terrains</SidebarText>
                </SidebarLink>
                <SidebarLink
                    to="/admin/Utilisateur/list"
                    collapsed={sidebarCollapsed ? 1 : 0}
                >
                  <SidebarIcon collapsed={sidebarCollapsed ? 1 : 0}>👤</SidebarIcon>
                  <SidebarText collapsed={sidebarCollapsed ? 1 : 0}>Utilisateurs</SidebarText>
                </SidebarLink>
                <SidebarLink
                    to="/admin/Reservation/ReservationManagement"
                    collapsed={sidebarCollapsed ? 1 : 0}
                >
                  <SidebarIcon collapsed={sidebarCollapsed ? 1 : 0}>🎫</SidebarIcon>
                  <SidebarText collapsed={sidebarCollapsed ? 1 : 0}>Reservations</SidebarText>
                </SidebarLink>
                

                <SidebarLink
                    to="/admin/payments/verify"
                    collapsed={sidebarCollapsed ? 1 : 0}
                >
                  <SidebarIcon collapsed={sidebarCollapsed ? 1 : 0}>💰</SidebarIcon>
                  <SidebarText collapsed={sidebarCollapsed ? 1 : 0}>Validé paiements</SidebarText>
                </SidebarLink>

                <SidebarLink
                    to="/admin/notifications"
                    collapsed={sidebarCollapsed ? 1 : 0}
                >
                  <SidebarIcon collapsed={sidebarCollapsed ? 1 : 0}>🔔</SidebarIcon>
                  <SidebarText collapsed={sidebarCollapsed ? 1 : 0}>notifications</SidebarText>
                </SidebarLink>

              </SidebarSection>


            </SidebarNav>

            <CollapseButton
                collapsed={sidebarCollapsed ? 1 : 0}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? 'Déplier' : 'Replier'}
            >
              {sidebarCollapsed ? '→' : '←'}
            </CollapseButton>
          </Sidebar>

          <MainContent>
            {children}
          </MainContent>
        </ContentContainer>

        <Footer>
          © 2025 Futsal Center - Administration • Tous droits réservés
        </Footer>
      </LayoutContainer>
  );
};

export default AdminLayout;