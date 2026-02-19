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

const CenterSection = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
`;

const BrandLogo = styled(Link)`
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    font-weight: 700;
    color: #25A55F;
    text-decoration: none;
    margin-right: 24px;
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
    margin-right: 8px;
`;

const SearchBar = styled.div`
    position: relative;
    margin-left: 24px;
    width: 240px;

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

const Navigation = styled.nav`
    display: flex;
    align-items: center;
    gap: 32px;

    @media (max-width: 768px) {
        display: none;
    }
`;

const NavLink = styled(Link)`
    text-decoration: none;
    color: ${props => (props.scrolled ? '#333' : '#000')};
    font-weight: 500;
    transition: color 0.3s ease;
    position: relative;
    padding: 4px 0;

    &:hover {
        color: #25A55F;
    }

    &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: -5px;
        left: 0;
        background-color: #25A55F;
        transition: width 0.3s ease;
    }

    &:hover::after {
        width: 100%;
    }
`;

const ActionButtons = styled.div`
    display: flex;
    align-items: center;
    margin-right: 16px;
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

    &:hover {
        background: #f5f5f5;
        color: #333;
    }
`;

const NotificationBadge = styled.div`
    position: absolute;
    top: -4px;
    right: -4px;
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
    padding: 4px 8px;
    border-radius: 20px;

    &:hover {
        background: #f5f5f5;
    }
`;

const Avatar = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 8px;
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
    width: 220px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    margin-top: 8px;
    display: ${props => (props.show ? 'block' : 'none')};
`;

const DropdownHeader = styled.div`
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
`;

const DropdownTitle = styled.h4`
    margin: 0;
    font-size: 0.85rem;
    color: #999;
`;

const DropdownList = styled.div`
    max-height: 200px;
    overflow-y: auto;
`;

const NotificationItem = styled.div`
    padding: 10px 16px;
    display: flex;
    align-items: center;

    &:hover {
        background: #fafafa;
    }
`;

const NotificationIcon = styled.div`
    margin-right: 12px;
`;

const NotificationContent = styled.div`
    flex: 1;
`;

const NotificationTitle = styled.p`
    margin: 0;
    font-size: 0.85rem;
    color: #333;
`;

const NotificationTime = styled.span`
    font-size: 0.75rem;
    color: #999;
`;

const DropdownFooter = styled.div`
    padding: 8px 16px;
    border-top: 1px solid #f0f0f0;
    text-align: center;
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
  font-size: 1.5rem;
  margin-right: 16px;
  cursor: pointer;

  @media (max-width: 992px) {
    display: flex;
  }
`;

// Main Header Component
const Header = ({ toggleSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mock notifications
  useEffect(() => {
    setNotifications([
      { id: 1, title: 'Nouveau match planifié', time: '10 min' },
      { id: 2, title: 'Résultat saisi', time: '2 h' }
    ]);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = e => {
      if (!e.target.closest('.dropdown')) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unread = notifications.length;

  return (
      <HeaderContainer>
        <LeftSection>
          <MenuButton onClick={toggleSidebar}>≡</MenuButton>
          <BrandLogo to="/">
            <Logo>⚽</Logo>
            FUTSAL
          </BrandLogo>
          <SearchBar>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput placeholder="Rechercher..." />
          </SearchBar>
        </LeftSection>

        <CenterSection>
          <Navigation>
            <NavLink to="/team" scrolled={scrolled}>Équipe</NavLink>
            <NavLink to="/challenges" scrolled={scrolled}>Défis</NavLink>
            <NavLink to="/matches" scrolled={scrolled}>Matchs</NavLink>
            <NavLink to="/reservation" scrolled={scrolled}>Réservation</NavLink>
          </Navigation>
        </CenterSection>

        <RightSection>
          <ActionButtons>
            <ActionButton className="dropdown" onClick={() => setShowNotifications(!showNotifications)}>
              🔔{unread > 0 && <NotificationBadge>{unread}</NotificationBadge>}
            </ActionButton>
            <ActionButton onClick={() => window.location.reload()}>🔄</ActionButton>
            <ActionButton as={Link} to="/">🌐</ActionButton>
          </ActionButtons>

          <UserProfile className="dropdown" onClick={() => setShowUserMenu(!showUserMenu)}>
            <Avatar src="/bilal.jpeg" alt="Bilal Kanba" />
            <UserInfo>
              <UserName>Bilal Kanba</UserName>
              <UserRole>Capitaine</UserRole>
            </UserInfo>
          </UserProfile>

          <Dropdown show={showNotifications} className="dropdown">
            <DropdownHeader><DropdownTitle>Notifications</DropdownTitle></DropdownHeader>
            <DropdownList>
              {notifications.map(n => (
                  <NotificationItem key={n.id}>
                    <NotificationIcon>🔔</NotificationIcon>
                    <NotificationContent>
                      <NotificationTitle>{n.title}</NotificationTitle>
                      <NotificationTime>{n.time}</NotificationTime>
                    </NotificationContent>
                  </NotificationItem>
              ))}
            </DropdownList>
            <DropdownFooter><ViewAllLink to="/notifications">Voir tout</ViewAllLink></DropdownFooter>
          </Dropdown>

          <Dropdown show={showUserMenu} className="dropdown">
            <DropdownList>
              <NotificationItem as={Link} to="/profile">
                <NotificationIcon>👤</NotificationIcon>
                <NotificationContent><NotificationTitle>Mon profil</NotificationTitle></NotificationContent>
              </NotificationItem>
              <NotificationItem onClick={() => alert('Déconnexion')}>
                <NotificationIcon>🚪</NotificationIcon>
                <NotificationContent><NotificationTitle>Déconnexion</NotificationTitle></NotificationContent>
              </NotificationItem>
            </DropdownList>
          </Dropdown>
        </RightSection>
      </HeaderContainer>
  );
};

export default Header;
