import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import HeaderJ from '../../components/layout/HeaderJ';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const ContentContainer = styled.div`
  max-width: 10000px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const TabsContainer = styled.div`
  margin-bottom: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#25A55F' : 'transparent'};
  color: ${props => props.active ? '#25A55F' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: #25A55F;
  }
`;

const TabContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
  padding: 2rem;
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SearchInput = styled.input`
  height: 48px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 1rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #25A55F;
    box-shadow: 0 0 0 3px rgba(37, 165, 95, 0.1);
  }
`;

const SelectInput = styled.select`
  height: 48px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 1rem;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #25A55F;
  }
`;

const SearchButton = styled.button`
  height: 48px;
  background-color: #25A55F;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1e8f4e;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: #666;
`;

const PlayersList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const PlayerCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const PlayerHeader = styled.div`
  background-color: #25A55F;
  padding: 1.5rem;
  color: white;
  position: relative;
`;

const PlayerName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const PlayerPosition = styled.div`
  font-size: 0.9rem;
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
`;

const PlayerContent = styled.div`
  padding: 1.5rem;
`;

const PlayerStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.8rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.2rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const ContactButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #25A55F;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #1e8f4e;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  
  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-weight: 500;
  color: #333;
`;

const FormInput = styled.input`
  height: 48px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 1rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #25A55F;
    box-shadow: 0 0 0 3px rgba(37, 165, 95, 0.1);
  }
`;

const TextArea = styled.textarea`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #25A55F;
    box-shadow: 0 0 0 3px rgba(37, 165, 95, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background-color: #25A55F;
    color: white;
    border: none;
    
    &:hover {
      background-color: #1e8f4e;
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const NoResultsIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ddd;
`;

const NoResultsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;

const NoResultsText = styled.p`
  color: #666;
  max-width: 500px;
  margin: 0 auto;
`;

// Données exemple
const samplePlayers = [
  {
    id: 1,
    name: 'Hamza Amara',
    position: 'Gardien',
    age: 25,
    matches: 45,
    goals: 0,
    level: 4,
    location: 'Casablanca',
    email: 'hamza.amara@gmail.com'
  },
  {
    id: 2,
    name: 'Abdel Malik',
    position: 'Défenseur',
    age: 28,
    matches: 62,
    goals: 4,
    level: 3,
    location: 'Rabat',
    email: 'abdel.malik@gmail.com'
  },
  {
    id: 3,
    name: 'Moufid Petit',
    position: 'Attaquant',
    age: 23,
    matches: 38,
    goals: 12,
    level: 5,
    location: 'Casablanca',
    email: 'moufid.petit@gmail.com'
  },
  {
    id: 4,
    name: 'Wail Guerrouj',
    position: 'Milieu',
    age: 26,
    matches: 57,
    goals: 6,
    level: 4,
    location: 'Marrakech',
    email: 'wail.guerrouj@gmail.com'
  },
  {
    id: 5,
    name: 'Abdo Maldini',
    position: 'Défenseur',
    age: 30,
    matches: 72,
    goals: 5,
    level: 4,
    location: 'Tanger',
    email: 'abdo.maldini@gmail.com'
  },
  {
    id: 6,
    name: 'Walid Walid',
    position: 'Milieu',
    age: 24,
    matches: 42,
    goals: 5,
    level: 3,
    location: 'Fès',
    email: 'walid.walid@gmail.com'
  },
  {
    id: 7,
    name: 'Ayoub Zaoui',
    position: 'Gardien',
    age: 27,
    matches: 51,
    goals: 0,
    level: 5,
    location: 'Casablanca',
    email: 'ayoub.zaoui@gmail.com'
  },
  {
    id: 8,
    name: 'Karim Bennani',
    position: 'Attaquant',
    age: 22,
    matches: 35,
    goals: 18,
    level: 4,
    location: 'Casablanca',
    email: 'karim.bennani@gmail.com'
  },
  {
    id: 9,
    name: 'Youssef Alami',
    position: 'Milieu',
    age: 29,
    matches: 65,
    goals: 8,
    level: 5,
    location: 'Rabat',
    email: 'youssef.alami@gmail.com'
  }
];

const FindPartners = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Simuler un chargement de données
    setTimeout(() => {
      setPlayers(samplePlayers);
      setFilteredPlayers(samplePlayers);
    }, 500);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();

    const filtered = players.filter(player => {
      const matchesName = player.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPosition = !positionFilter || player.position === positionFilter;
      const matchesLevel = !levelFilter || player.level >= parseInt(levelFilter);
      const matchesLocation = !locationFilter || player.location === locationFilter;

      return matchesName && matchesPosition && matchesLevel && matchesLocation;
    });

    setFilteredPlayers(filtered);
  };

  const handleContact = (player) => {
    setSelectedPlayer(player);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlayer(null);
    setMessage('');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    alert(`Message envoyé à ${selectedPlayer.name} !`);
    handleCloseModal();
  };

  const handleNewProfile = () => {
    alert("Cette fonctionnalité sera disponible prochainement !");
  };

  return (
      <PageContainer>
        <HeaderJ />
        <ContentContainer>
          <PageTitle>Chercher des partenaires</PageTitle>
          <PageDescription>
            Trouvez des partenaires de jeu pour compléter votre équipe ou pour des matchs occasionnels.
          </PageDescription>

          <TabsContainer>
            <TabList>
              <Tab
                  active={activeTab === 'search'}
                  onClick={() => setActiveTab('search')}
              >
                Recherche de joueurs
              </Tab>
              <Tab
                  active={activeTab === 'available'}
                  onClick={() => setActiveTab('available')}
              >
                Je suis disponible
              </Tab>
            </TabList>

            <TabContent active={activeTab === 'search'}>
              <SearchForm onSubmit={handleSearch}>
                <SearchInput
                    type="text"
                    placeholder="Rechercher par nom..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SelectInput
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value)}
                >
                  <option value="">Toutes positions</option>
                  <option value="Gardien">Gardien</option>
                  <option value="Défenseur">Défenseur</option>
                  <option value="Milieu">Milieu</option>
                  <option value="Attaquant">Attaquant</option>
                </SelectInput>
                <SearchButton type="submit">Rechercher</SearchButton>
              </SearchForm>

              <FilterContainer>
                <FilterGroup>
                  <FilterLabel>Niveau minimum:</FilterLabel>
                  <SelectInput
                      value={levelFilter}
                      onChange={(e) => {
                        setLevelFilter(e.target.value);
                        handleSearch();
                      }}
                  >
                    <option value="">Tous niveaux</option>
                    <option value="1">1 - Débutant</option>
                    <option value="2">2 - Intermédiaire</option>
                    <option value="3">3 - Confirmé</option>
                    <option value="4">4 - Avancé</option>
                    <option value="5">5 - Expert</option>
                  </SelectInput>
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Localisation:</FilterLabel>
                  <SelectInput
                      value={locationFilter}
                      onChange={(e) => {
                        setLocationFilter(e.target.value);
                        handleSearch();
                      }}
                  >
                    <option value="">Toutes les villes</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tanger">Tanger</option>
                    <option value="Fès">Fès</option>
                  </SelectInput>
                </FilterGroup>
              </FilterContainer>

              {filteredPlayers.length > 0 ? (
                  <PlayersList>
                    {filteredPlayers.map(player => (
                        <PlayerCard key={player.id}>
                          <PlayerHeader>
                            <PlayerName>{player.name}</PlayerName>
                            <PlayerPosition>{player.position}</PlayerPosition>
                          </PlayerHeader>

                          <PlayerContent>
                            <PlayerStats>
                              <StatItem>
                                <StatValue>{player.age}</StatValue>
                                <StatLabel>Âge</StatLabel>
                              </StatItem>
                              <StatItem>
                                <StatValue>{player.level}/5</StatValue>
                                <StatLabel>Niveau</StatLabel>
                              </StatItem>
                              <StatItem>
                                <StatValue>{player.goals}</StatValue>
                                <StatLabel>Buts</StatLabel>
                              </StatItem>
                            </PlayerStats>

                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{ marginBottom: '0.5rem' }}>
                                <strong>Localisation:</strong> {player.location}
                              </div>
                              <div>
                                <strong>Matchs joués:</strong> {player.matches}
                              </div>
                            </div>

                            <ContactButton onClick={() => handleContact(player)}>
                              Contacter
                            </ContactButton>
                          </PlayerContent>
                        </PlayerCard>
                    ))}
                  </PlayersList>
              ) : (
                  <NoResults>
                    <NoResultsIcon>🔍</NoResultsIcon>
                    <NoResultsTitle>Aucun joueur trouvé</NoResultsTitle>
                    <NoResultsText>
                      Aucun joueur ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres ou d'effectuer une recherche différente.
                    </NoResultsText>
                  </NoResults>
              )}
            </TabContent>

            <TabContent active={activeTab === 'available'}>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Signalez votre disponibilité</h2>
                <p style={{ maxWidth: '700px', margin: '0 auto 2rem' }}>
                  Indiquez que vous êtes disponible pour jouer et les autres utilisateurs pourront vous contacter.
                  Remplissez votre profil avec vos informations et vos disponibilités.
                </p>
                <Button className="primary" onClick={handleNewProfile}>
                  Créer mon profil de disponibilité
                </Button>
              </div>
            </TabContent>
          </TabsContainer>
        </ContentContainer>

        {/* Contact Modal */}
        <Modal show={showModal}>
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>Contacter {selectedPlayer?.name}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSendMessage}>
              <FormGroup>
                <FormLabel>Votre message:</FormLabel>
                <TextArea
                    placeholder="Présentez-vous et expliquez pourquoi vous souhaitez entrer en contact..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Vos disponibilités:</FormLabel>
                <FormInput
                    type="text"
                    placeholder="Ex: Soirs en semaine, weekends..."
                    required
                />
              </FormGroup>

              <ButtonGroup>
                <Button
                    type="button"
                    className="secondary"
                    onClick={handleCloseModal}
                >
                  Annuler
                </Button>
                <Button
                    type="submit"
                    className="primary"
                >
                  Envoyer
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContainer>
        </Modal>
      </PageContainer>
  );
};

export default FindPartners;