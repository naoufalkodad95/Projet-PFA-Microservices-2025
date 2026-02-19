import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  height: 64px;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const BrandLogo = styled(Link)`
  font-size: 1.25rem;
  font-weight: 700;
  color: #25A55F;
  text-decoration: none;
  display: flex;
  align-items: center;
  margin-right: 24px;
  
  svg {
    margin-right: 8px;
  }
`;

const Logo = styled.div`
  width: 32px;
  height: 32px;
  background-color: #25A55F;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  margin-right: 10px;
`;

const PageTitle = styled.h1`
  font-size: 1.1rem;
  color: #333;
  margin: 0;
  font-weight: 500;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-left: 20px;
  width: 280px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 36px;
  background: #f5f5f5;
  border: 1px solid #f0f0f0;
  border-radius: 18px;
  padding: 0 16px 0 36px;
  font-size: 0.9rem;
  color: #333;
  transition: all 0.2s ease;
  
  &:focus {
    background: #fff;
    border-color: #25A55F;
    box-shadow: 0 0 0 3px rgba(37, 165, 95, 0.1);
    outline: none;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 1rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #666;
  cursor: pointer;
  margin-left: 8px;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ff5252;
  color: white;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e6f7ef;
  color: #25A55F;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 500;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
`;

const UserRole = styled.span`
  font-size: 0.75rem;
  color: #888;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 250px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
  margin-top: 8px;
  display: ${props => props.show ? 'block' : 'none'};
`;

const DropdownHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const DropdownTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  color: #999;
  font-weight: 500;
`;

const DropdownList = styled.div`
  max-height: 350px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e6f7ef;
  color: #25A55F;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-right: 12px;
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.p`
  margin: 0 0 2px 0;
  font-size: 0.85rem;
  color: #333;
`;

const NotificationTime = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #999;
`;

const DropdownFooter = styled.div`
  padding: 12px 16px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
`;

const ViewAllLink = styled(Link)`
  font-size: 0.85rem;
  color: #25A55F;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  width: 40px;
  height: 40px;
  font-size: 1.25rem;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 16px;
  
  &:hover {
    background: #f5f5f5;
  }
  
  @media (max-width: 992px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 10px;
  margin-left: 15px;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const ActionLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: ${props => props.primary ? '#25A55F' : '#f5f5f5'};
  color: ${props => props.primary ? 'white' : '#333'};
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#1c8048' : '#e0e0e0'};
  }
  
  span {
    margin-right: 6px;
  }
`;

// AdminHeader Component
const AdminHeader = ({ toggleSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  // Fonction pour obtenir le titre de la page en fonction de l'URL
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === '/admin') return 'Tableau de bord';
    if (path.includes('/admin/matches')) return 'Planification des matchs';
    if (path.includes('/admin/results')) return 'Saisie des résultats';
    if (path.includes('/admin/teams')) return 'Gestion des équipes';
    if (path.includes('/admin/fields')) return 'Gestion des terrains';
    if (path.includes('/admin/tournaments')) return 'Gestion des tournois';
    if (path.includes('/admin/users')) return 'Gestion des utilisateurs';

    return 'Administration';
  };

  // Simuler des notifications
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: 'Nouveau match planifié',
        message: 'Les Tigres vs Les Panthers',
        time: 'Il y a 10 min',
        icon: '📅',
        read: false
      },
      {
        id: 2,
        title: 'Résultat saisi',
        message: 'Les Lions 3 - 2 Les Aigles',
        time: 'Il y a 2h',
        icon: '🏆',
        read: false
      },
      {
        id: 3,
        title: 'Nouveau joueur inscrit',
        message: 'Martin Dupont a rejoint la plateforme',
        time: 'Il y a 3h',
        icon: '👤',
        read: true
      },
      {
        id: 4,
        title: 'Défi accepté',
        message: 'Les Dragons vs Les Loups',
        time: 'Il y a 5h',
        icon: '🤝',
        read: true
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  // Fermer les dropdowns quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications || showUserMenu) {
        if (!event.target.closest('.dropdown-container')) {
          setShowNotifications(false);
          setShowUserMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showUserMenu]);

  // Nombre de notifications non lues
  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
      <HeaderContainer>
        <LeftSection>
          <MenuButton onClick={toggleSidebar}>
            ≡
          </MenuButton>

          <BrandLogo to="/admin">
            <Logo>⚽</Logo>
            FUTSAL Admin
          </BrandLogo>

          <PageTitle>{getPageTitle()}</PageTitle>

          <SearchBar>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput placeholder="Rechercher..." />
          </SearchBar>

          <QuickActions>
            <ActionLink to="/admin/matches" primary>
              <span>+</span> Nouveau match
            </ActionLink>
            <ActionLink to="/admin/results">
              <span>✓</span> Saisir résultat
            </ActionLink>
          </QuickActions>
        </LeftSection>

        <RightSection>
          <ActionButtons>
            <ActionButton
                className="dropdown-container"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
            >
              🔔
              {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
            </ActionButton>

            <ActionButton onClick={() => window.location.reload()}>
              🔄
            </ActionButton>

            <ActionButton as={Link} to="/" title="Voir le site">
              🌐
            </ActionButton>
          </ActionButtons>

          <UserProfile
              className="dropdown-container"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
          >
            <Avatar>A</Avatar>
            <UserInfo>
              <UserName>Admin</UserName>
              <UserRole>Administrateur</UserRole>
            </UserInfo>
          </UserProfile>

          {/* Dropdown Notifications */}
          <Dropdown show={showNotifications} className="dropdown-container">
            <DropdownHeader>
              <DropdownTitle>Notifications</DropdownTitle>
            </DropdownHeader>

            <DropdownList>
              {notifications.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
                    Aucune notification
                  </div>
              ) : (
                  notifications.map(notification => (
                      <NotificationItem key={notification.id}>
                        <NotificationIcon>{notification.icon}</NotificationIcon>
                        <NotificationContent>
                          <NotificationTitle>{notification.title}</NotificationTitle>
                          <NotificationTime>{notification.time}</NotificationTime>
                        </NotificationContent>
                      </NotificationItem>
                  ))
              )}
            </DropdownList>

            <DropdownFooter>
              <ViewAllLink to="/admin/notifications">Voir toutes les notifications</ViewAllLink>
            </DropdownFooter>
          </Dropdown>

          {/* Dropdown Menu Utilisateur */}
          <Dropdown show={showUserMenu} className="dropdown-container">
            <DropdownList>
              <NotificationItem as={Link} to="/admin/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                <NotificationIcon>👤</NotificationIcon>
                <NotificationContent>
                  <NotificationTitle>Mon profil</NotificationTitle>
                </NotificationContent>
              </NotificationItem>

              <NotificationItem style={{ cursor: 'pointer' }} onClick={() => alert('Déconnexion')}>
                <NotificationIcon style={{ background: '#ffebee', color: '#f44336' }}>🚪</NotificationIcon>
                <NotificationContent>
                  <NotificationTitle>Déconnexion</NotificationTitle>
                </NotificationContent>
              </NotificationItem>
            </DropdownList>
          </Dropdown>
        </RightSection>
      </HeaderContainer>
  );
};

export default AdminHeader;