import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import { logout } from '../../../services/AuthentificationService';
import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';




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
  width: 500%;
  height: 36px;
  background: #f5f5f5;
  border: 1px solid #f0f0f0;
  border-radius: 18px;
  padding: 0 16px 0 36px;
  font-size: 0.9rem;
  color: #333;
  transition: all 0.2s ease;
    border:1px solid black;
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
const ProfileImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.5);
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
const QuickActions = styled.div`
  display: flex;
  gap: 10px;
  margin-left: 15px;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const Navigation = styled.nav`
    display: flex;
    align-items: center;

    gap: 32px;

    @media (max-width: 768px) {
        display: none;
    }
`;
const CenterSection = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left:50%

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

const Header = ({ toggleSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
         {/* Scroll detection */}
         useEffect(() => {
          const onScroll = () => setScrolled(window.scrollY > 50);
          window.addEventListener('scroll', onScroll);
          return () => window.removeEventListener('scroll', onScroll);
        }, []);

  const userData = {
    userId : localStorage.getItem("userId"),
    firstName: localStorage.getItem("firstName"),
    lastName: localStorage.getItem("lastName"),
    photoProfil: localStorage.getItem("PhotoProfil"),
    role: localStorage.getItem("role")
  };


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

   const handleLogout = async () => {
     try {
       await logout();
       localStorage.clear();
       navigate("/login");
       window.location.reload(); // Pour s'assurer que tout l'état est réinitialisé
     } catch (error) {
       console.error("Erreur lors de la déconnexion:", error);
     }
   };

  const profileImageUrl = userData.photoProfil 
    ? `http://localhost:5021${userData.photoProfil}`
    : 'https://via.placeholder.com/150';

  return (
      <HeaderContainer>
        <LeftSection>
          <MenuButton onClick={toggleSidebar}>
            ≡
          </MenuButton>

          <BrandLogo to="/admin">
            <Logo>⚽</Logo>
            FUTSAL 
          </BrandLogo>


          <SearchBar>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput placeholder="Rechercher..." />
          </SearchBar>
          <CenterSection>
          <Navigation>
            <NavLink to="/team" scrolled={scrolled}>Équipe</NavLink>
            <NavLink to="/challenges" scrolled={scrolled}>Défis</NavLink>
            <NavLink to="/matches" scrolled={scrolled}>Matchs</NavLink>
            <NavLink to="/reservations" scrolled={scrolled}>Réservation</NavLink>
          </Navigation>
        </CenterSection>

        
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
          <ProfileImage 
                  src={profileImageUrl} 
                  alt="Profile"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
                            <UserInfo>

              <UserName>{userData.firstName} {userData.lastName}</UserName>
              <UserRole>Capitan</UserRole>
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
              <NotificationItem as={Link} to={`/modifier-profil-Utilisateur/${userData.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              

                <NotificationIcon>👤</NotificationIcon>
                <NotificationContent>
                  <NotificationTitle>Mon profil</NotificationTitle>
                </NotificationContent>
              </NotificationItem>
              <NotificationItem style={{ cursor: 'pointer' }} onClick={handleLogout}>
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

export default Header;