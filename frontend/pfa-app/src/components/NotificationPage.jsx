// NotificationPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AdminLayout from '../pages/Admin/AdminLayout';

// Styled Components améliorés
const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #333;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  margin-bottom: 24px;
  font-weight: 600;
`;

const TabsContainer = styled.div`
  display: flex;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const Tab = styled.div`
  flex: 1;
  padding: 14px 20px;
  text-align: center;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  background-color: ${props => props.active ? '#fff' : 'transparent'};
  color: ${props => props.active ? '#25A55F' : '#666'};
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#fff' : '#ebebeb'};
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#25A55F' : '#f5f5f5'};
  color: ${props => props.primary ? '#fff' : '#333'};
  border: none;
  border-radius: 8px;
  padding: 12px 18px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  box-shadow: ${props => props.primary ? '0 2px 4px rgba(37, 165, 95, 0.2)' : '0 1px 2px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    background-color: ${props => props.primary ? '#1c8048' : '#e0e0e0'};
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-grow: 1;
  max-width: 600px;
  gap: 12px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: #fff;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #25A55F;
    box-shadow: 0 0 0 3px rgba(37, 165, 95, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const NotificationList = styled.div`
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 60px 2fr 1fr 1fr 1fr 100px;
  padding: 16px;
  background-color: #f9f9f9;
  font-weight: 600;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ListItem = styled.div`
  display: grid;
  grid-template-columns: 60px 2fr 1fr 1fr 1fr 100px;
  padding: 16px;
  border-bottom: 1px solid #eee;
  transition: all 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 8px;
    padding: 16px;
  }
`;

const HeaderCell = styled.div`
  font-weight: 500;
  color: #666;
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    &:before {
      content: '${props => props.label}';
      font-weight: 500;
      color: #666;
      margin-right: 8px;
      min-width: 120px;
    }
  }
`;

const Status = styled.span`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    if (props.status === 'Envoyée') return '#e6f7ef';
    if (props.status === 'Programmée') return '#fff8e1';
    if (props.status === 'Brouillon') return '#f5f5f5';
    return '#f5f5f5';
  }};
  color: ${props => {
    if (props.status === 'Envoyée') return '#25A55F';
    if (props.status === 'Programmée') return '#ffa000';
    if (props.status === 'Brouillon') return '#757575';
    return '#757575';
  }};
`;

const ActionIcon = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
    color: #333;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  gap: 8px;
`;

const PageButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.active ? '#25A55F' : '#ddd'};
  background-color: ${props => props.active ? '#25A55F' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#25A55F' : '#f5f5f5'};
  }
`;

const FormContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 24px;
  font-weight: 600;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #25A55F;
    box-shadow: 0 0 0 3px rgba(37, 165, 95, 0.1);
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #999;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #25A55F;
    box-shadow: 0 0 0 3px rgba(37, 165, 95, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: #fff;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  
  &:focus {
    outline: none;
    border-color: #25A55F;
    box-shadow: 0 0 0 3px rgba(37, 165, 95, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const EmptyList = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: 0.95rem;
`;

// Date picker styled components
const DateInput = styled(Input)`
  background-color: #fff;
`;

// Animations
const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const AnimatedContainer = styled.div`
  animation: fadeIn 0.3s ease-out;
  ${fadeIn}
`;

// Mock data for notifications
const initialNotifications = [
  {
    id: '001',
    content: 'Maintenance des terrains prévue le 28/02/2025',
    date: '25/02/2025',
    recipients: 'Tous les joueurs',
    status: 'Envoyée'
  },
  {
    id: '002',
    content: 'Nouveau tournoi amateur le 15 mars 2025',
    date: '01/03/2025',
    recipients: 'Tous les utilisateurs',
    status: 'Programmée'
  },
  {
    id: '003',
    content: 'Rappel: Paiement des réservations à effectuer',
    date: '20/02/2025',
    recipients: 'Équipe "Les Tigres"',
    status: 'Envoyée'
  },
  {
    id: '004',
    content: "Modification des horaires d'ouverture",
    date: '05/03/2025',
    recipients: 'Tous les utilisateurs',
    status: 'Brouillon'
  },
  {
    id: '005',
    content: 'Confirmation de réservation terrain 3',
    date: '22/02/2025',
    recipients: 'Jean Dupont',
    status: 'Envoyée'
  }
];

// NotificationPage Component
const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentNotification, setCurrentNotification] = useState({
    id: '',
    title: '',
    content: '',
    date: '',
    recipients: 'Tous les utilisateurs'
  });

  // Filtrer les notifications en fonction de l'onglet actif et de la recherche
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    // Filtre par onglet
    if (activeTab === 'scheduled') {
      filtered = filtered.filter(notif => notif.status === 'Programmée');
    } else if (activeTab === 'history') {
      filtered = filtered.filter(notif => notif.status === 'Envoyée');
    }
    
    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(notif => 
        notif.content.toLowerCase().includes(query) ||
        notif.recipients.toLowerCase().includes(query) ||
        notif.id.includes(query)
      );
    }
    
    return filtered;
  };
  
  const filteredNotifications = getFilteredNotifications();

  // Fonction pour gérer la création/édition d'une notification
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formMode === 'create') {
      // Générer un ID unique
      const newId = String(notifications.length + 1).padStart(3, '0');
      
      // Ajouter la nouvelle notification
      const newNotification = {
        id: newId,
        content: currentNotification.title,
        date: currentNotification.date || formatDate(new Date()),
        recipients: currentNotification.recipients,
        status: 'Brouillon'
      };
      
      setNotifications([...notifications, newNotification]);
    } else {
      // Mettre à jour la notification existante
      const updatedNotifications = notifications.map(notif => 
        notif.id === currentNotification.id 
          ? {
              ...notif, 
              content: currentNotification.title,
              date: currentNotification.date,
              recipients: currentNotification.recipients
            } 
          : notif
      );
      
      setNotifications(updatedNotifications);
    }
    
    // Réinitialiser le formulaire
    resetForm();
  };

  // Fonction pour gérer l'envoi d'une notification
  const handleSend = (e) => {
    e.preventDefault();
    
    if (formMode === 'create') {
      // Générer un ID unique
      const newId = String(notifications.length + 1).padStart(3, '0');
      
      // Ajouter la nouvelle notification avec statut "Envoyée"
      const newNotification = {
        id: newId,
        content: currentNotification.title,
        date: currentNotification.date || formatDate(new Date()),
        recipients: currentNotification.recipients,
        status: 'Envoyée'
      };
      
      setNotifications([...notifications, newNotification]);
      
      // Afficher un message de confirmation
      alert(`Notification "${currentNotification.title}" envoyée avec succès à ${currentNotification.recipients}`);
    } else {
      // Mettre à jour la notification existante avec statut "Envoyée"
      const updatedNotifications = notifications.map(notif => 
        notif.id === currentNotification.id 
          ? {
              ...notif, 
              content: currentNotification.title,
              date: currentNotification.date,
              recipients: currentNotification.recipients,
              status: 'Envoyée'
            } 
          : notif
      );
      
      setNotifications(updatedNotifications);
      
      // Afficher un message de confirmation
      alert(`Notification "${currentNotification.title}" envoyée avec succès à ${currentNotification.recipients}`);
    }
    
    // Réinitialiser le formulaire
    resetForm();
  };

  // Fonction pour initialiser l'édition d'une notification
  const handleEdit = (id) => {
    const notificationToEdit = notifications.find(notif => notif.id === id);
    
    setCurrentNotification({
      id: notificationToEdit.id,
      title: notificationToEdit.content,
      content: notificationToEdit.content,
      date: notificationToEdit.date,
      recipients: notificationToEdit.recipients
    });
    
    setFormMode('edit');
    setShowForm(true);
    
    // Scroll to form
    setTimeout(() => {
      document.getElementById('notification-form').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Fonction pour supprimer une notification
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      const updatedNotifications = notifications.filter(notif => notif.id !== id);
      setNotifications(updatedNotifications);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setCurrentNotification({
      id: '',
      title: '',
      content: '',
      date: formatDate(new Date()),
      recipients: 'Tous les utilisateurs'
    });
    setShowForm(false);
    setFormMode('create');
  };

  // Fonction pour formater la date
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Initialiser la date à aujourd'hui au chargement
  useEffect(() => {
    setCurrentNotification(prev => ({
      ...prev,
      date: formatDate(new Date())
    }));
  }, []);

  // Fonction pour gérer la recherche
  const handleSearch = () => {
    setCurrentPage(1); // Réinitialiser à la page 1 lors d'une recherche
  };

  return (
    <AdminLayout>
    <Container>
      <Title>Gestion des Notifications</Title>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          Toutes les notifications
        </Tab>
        <Tab 
          active={activeTab === 'scheduled'} 
          onClick={() => setActiveTab('scheduled')}
        >
          Notifications programmées
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          Historique d'envoi
        </Tab>
      </TabsContainer>
      
      <ActionBar>
        <Button primary onClick={() => {
          setShowForm(true);
          setFormMode('create');
          setTimeout(() => {
            document.getElementById('notification-form').scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}>
          <span>+</span> Nouvelle notification
        </Button>
        
        <SearchContainer>
          <SearchInput 
            placeholder="Rechercher une notification..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>Rechercher</Button>
        </SearchContainer>
      </ActionBar>
      
      <NotificationList>
        <ListHeader>
          <HeaderCell>ID</HeaderCell>
          <HeaderCell>Contenu</HeaderCell>
          <HeaderCell>Date d'envoi</HeaderCell>
          <HeaderCell>Destinataires</HeaderCell>
          <HeaderCell>Statut</HeaderCell>
          <HeaderCell>Actions</HeaderCell>
        </ListHeader>
        
        {filteredNotifications.length === 0 ? (
          <EmptyList>
            {searchQuery 
              ? "Aucune notification ne correspond à votre recherche" 
              : "Aucune notification disponible"}
          </EmptyList>
        ) : (
          filteredNotifications.map((notification) => (
            <ListItem key={notification.id}>
              <Cell label="ID:">{notification.id}</Cell>
              <Cell label="Contenu:">{notification.content}</Cell>
              <Cell label="Date d'envoi:">{notification.date}</Cell>
              <Cell label="Destinataires:">{notification.recipients}</Cell>
              <Cell label="Statut:">
                <Status status={notification.status}>{notification.status}</Status>
              </Cell>
              <Cell style={{ gap: '5px' }} label="Actions:">
                <ActionIcon onClick={() => handleEdit(notification.id)} title="Modifier">
                  ✏️
                </ActionIcon>
                <ActionIcon onClick={() => handleDelete(notification.id)} title="Supprimer">
                  🗑️
                </ActionIcon>
              </Cell>
            </ListItem>
          ))
        )}
      </NotificationList>
      
      {filteredNotifications.length > 0 && (
        <Pagination>
          <PageButton onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
            ◀
          </PageButton>
          <PageButton active={currentPage === 1} onClick={() => setCurrentPage(1)}>1</PageButton>
          <PageButton active={currentPage === 2} onClick={() => setCurrentPage(2)}>2</PageButton>
          {currentPage > 3 && <PageButton>...</PageButton>}
          {currentPage >= 3 && (
            <PageButton active={true} onClick={() => setCurrentPage(currentPage)}>
              {currentPage}
            </PageButton>
          )}
          <PageButton onClick={() => setCurrentPage(currentPage + 1)}>
            ▶
          </PageButton>
        </Pagination>
      )}
      
      {showForm && (
        <AnimatedContainer>
          <FormContainer id="notification-form">
            <FormTitle>
              {formMode === 'create' ? 'Créer une notification' : 'Modifier une notification'}
            </FormTitle>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>ID Notification:</Label>
                <Input 
                  type="text" 
                  value={formMode === 'create' ? '[Auto]' : currentNotification.id} 
                  disabled 
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Titre:</Label>
                <Input 
                  type="text" 
                  placeholder="Entrez le titre de la notification..." 
                  value={currentNotification.title}
                  onChange={(e) => setCurrentNotification({...currentNotification, title: e.target.value})}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Contenu:</Label>
                <TextArea 
                  placeholder="Saisissez le contenu de la notification..." 
                  value={currentNotification.content}
                  onChange={(e) => setCurrentNotification({...currentNotification, content: e.target.value})}
                />
              </FormGroup>
              
              <FormRow>
                <FormGroup style={{ flex: 1 }}>
                  <Label>Date d'envoi:</Label>
                  <DateInput 
                    type="text" 
                    placeholder="JJ/MM/AAAA" 
                    value={currentNotification.date}
                    onChange={(e) => setCurrentNotification({...currentNotification, date: e.target.value})}
                  />
                </FormGroup>
                
                <FormGroup style={{ flex: 1 }}>
                  <Label>Destinataires:</Label>
                  <Select 
                    value={currentNotification.recipients}
                    onChange={(e) => setCurrentNotification({...currentNotification, recipients: e.target.value})}
                  >
                    <option value="Tous les utilisateurs">Tous les utilisateurs</option>
                    <option value="Tous les joueurs">Tous les joueurs</option>
                    <option value="Équipe &quot;Les Tigres&quot;">Équipe "Les Tigres"</option>
                    <option value="Équipe &quot;Les Lions&quot;">Équipe "Les Lions"</option>
                    <option value="Jean Dupont">Jean Dupont</option>
                  </Select>
                </FormGroup>
              </FormRow>
              
              <ButtonGroup>
                <Button primary type="button" onClick={handleSend}>
                  Envoyer maintenant
                </Button>
                <Button type="submit">
                  Enregistrer comme brouillon
                </Button>
                <Button type="button" onClick={resetForm}>
                  Annuler
                </Button>
              </ButtonGroup>
            </form>
          </FormContainer>
        </AnimatedContainer>
      )}
    </Container>
    </AdminLayout>

  );
};

export default NotificationPage;