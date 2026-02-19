import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Dropdown, Image, NavDropdown } from 'react-bootstrap';
import { logout } from '../services/AuthentificationService';

const UserNavbar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');
  const PhotoProfil = localStorage.getItem("PhotoProfil");
  const userRole = localStorage.getItem("role");

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
  const imageUrl = PhotoProfil ? `http://localhost:5021${PhotoProfil}` : '/path/to/default/image.jpg';

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="{../../Acceuil">
          <img
            src="/photo-1552667466-07770ae110d0.jpeg"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            {/* Liens pour les réservations */}
            
               <Nav.Link href="/Utilisateur/list">Gestion Utilisateurs</Nav.Link>
               <Nav.Link href="/admin/reservations">Gestion Réservations</Nav.Link>
             
            

            {/* Menu utilisateur */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="dropdown-user" className="d-flex align-items-center">
                <Image 
                  src={imageUrl} 
                  alt="Profile" 
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }} 
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Header>
                  <div className="fw-bold">{firstName} {lastName}</div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item href={`/modifier-profil/${userId}`}>
                  <i className="bi bi-person me-2"></i>Mon Profil
                </Dropdown.Item>
               
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Déconnexion
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;