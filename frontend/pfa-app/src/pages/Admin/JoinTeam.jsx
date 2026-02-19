import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import HeaderJ from '../../components/layout/HeaderJ';
import { Link } from 'react-router-dom';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
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

const SearchContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SearchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SearchTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const FiltersToggle = styled.button`
  background: none;
  border: none;
  color: #25A55F;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SearchInputContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: ${props => props.showFilters ? '1rem' : '0'};
`;

const SearchInput = styled.input`
  flex: 1;
  height: 44px;
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

const SearchButton = styled.button`
  background-color: #25A55F;
  color: white;
  border: none;
  border-radius: 8px;
  height: 44px;
  padding: 0 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1e8f4e;
  }
`;

const FiltersContainer = styled.div`
  display: ${props => props.show ? 'grid' : 'none'};
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.5rem;
`;

const FilterSelect = styled.select`
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0 0.5rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #25A55F;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const TeamCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const TeamHeader = styled.div`
  position: relative;
  height: 100px;
  background-color: #25A55F;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
  }
`;

const TeamLogo = styled.div`
  position: absolute;
  bottom: -30px;
  left: 20px;
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
  border: 3px solid white;
  color: #25A55F;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TeamDivision = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  z-index: 1;
`;

const TeamContent = styled.div`
  padding: 2rem 1.5rem 1.5rem;
`;

const TeamName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const TeamLocation = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
  
  svg {
    margin-right: 5px;
  }
`;

const TeamStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  padding: 0.7rem;
  border-radius: 8px;
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const TeamDescription = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TeamFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RosterStatus = styled.div`
  font-size: 0.85rem;
  color: ${props => props.full ? '#ff5252' : '#25A55F'};
  font-weight: 500;
`;

const JoinButton = styled.button`
  background-color: ${props => props.full ? '#f0f0f0' : '#25A55F'};
  color: ${props => props.full ? '#999' : 'white'};
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: ${props => props.full ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.full ? '#f0f0f0' : '#1e8f4e'};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  height: 36px;
  min-width: 36px;
  border: 1px solid ${props => props.active ? '#25A55F' : '#ddd'};
  background-color: ${props => props.active ? '#25A55F' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 6px;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#25A55F' : '#f5f5f5'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const ModalContent = styled.div`
  background-color: white;
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  font-size: 1.3rem;
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

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const TeamPreview = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
`;

const TeamLogoLarge = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-color: #25A55F;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-right: 1rem;
`;

const TeamInfo = styled.div`
  flex: 1;
`;

const TeamNameLarge = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.3rem 0;
`;

const TeamLocationSmall = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  width: 100%;
  height: 44px;
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

const FormTextarea = styled.textarea`
  width: 100%;
  height: 120px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #25A55F;
    box-shadow: 0 0 0 3px rgba(37, 165, 95, 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #25A55F;
  color: white;
  border: none;
  border-radius: 8px;
  height: 44px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1e8f4e;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: #666;
`;

const NoResultsIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #ccc;
`;

const NoResultsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
`;

const NoResultsText = styled.p`
  font-size: 1rem;
  color: #666;
  max-width: 400px;
  margin: 0 auto;
`;

// Main Component
const JoinTeam = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    region: '',
    division: '',
    availability: ''
  });

  // Fetch teams from API (mock data for now)
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockTeams = [
        {
          id: 4,
          name: "Union Sportive Ahfir",
          logo: "USA",
          logoColor: "#9b59b6",
          coverImage: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          division: "Division 3",
          location: "Ahfir",
          region: "Ahfir-Aghbal",
          players: 6,
          maxPlayers: 10,
          winRate: 40,
          played: 10,
          description: "Nouvelle équipe en développement. Nous cherchons des joueurs de tous niveaux pour grandir ensemble.",
          needs: ["Gardien", "Défenseur", "Milieu"]
        },
        {
          id: 1,
          name: "Mouloudia Futsal",
          logo: "MC",
          logoColor: "#e74c3c",
          coverImage: "https://images.unsplash.com/photo-1577213534073-a3661370825e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          division: "Division 2",
          location: "Oujda",
          region: "Oujda-Angad",
          players: 10,
          maxPlayers: 10,
          winRate: 60,
          played: 15,
          description: "Équipe amicale et passionnée. Nous jouons pour le plaisir mais nous aimons aussi gagner!",
          needs: ["Gardien"]
        },
        {
          id: 6,
          name: "RS Berkane",
          logo: "RSB",
          logoColor: "#d35400",
          coverImage: "https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          division: "Division 2",
          location: "Berkane",
          region: "Berkane-Madagh",
          players: 8,
          maxPlayers: 10,
          winRate: 65,
          played: 20,
          description: "Équipe avec un style de jeu offensif. Notre objectif est la montée en Division 1 cette saison.",
          needs: ["Défenseur", "Milieu"]
        },
        {
          id: 1,
          name: "FC Atlas",
          logo: "A",
          logoColor: "#3498db",
          coverImage: "https://images.unsplash.com/photo-1521056787327-245c61b56d43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          division: "Division 1",
          location: "Casablanca",
          region: "Casa-Settat",
          players: 8,
          maxPlayers: 12,
          winRate: 75,
          played: 20,
          description: "Équipe compétitive basée à Casablanca. Nous recherchons des joueurs techniques et rapides pour compléter notre effectif.",
          needs: ["Attaquant", "Défenseur"]
        },
        {
          id: 1,
          name: "Les Panthers",
          logo: "P",
          logoColor: "#e74c3c",
          coverImage: "https://images.unsplash.com/photo-1577213534073-a3661370825e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          division: "Division 2",
          location: "Rabat",
          region: "Rabat-Salé-Kénitra",
          players: 10,
          maxPlayers: 10,
          winRate: 60,
          played: 15,
          description: "Équipe amicale et passionnée. Nous jouons pour le plaisir mais nous aimons aussi gagner!",
          needs: ["Gardien"]
        },
        {
          id: 3,
          name: "Étoiles du Sahara",
          logo: "ES",
          logoColor: "#f39c12",
          coverImage: "https://images.unsplash.com/photo-1577130330447-ad9a8bd0ca3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          division: "Division 1",
          location: "Marrakech",
          region: "Marrakech-Safi",
          players: 7,
          maxPlayers: 12,
          winRate: 80,
          played: 25,
          description: "Équipe fondée en 2018, spécialisée dans le jeu de possession. Nous recherchons des joueurs techniques.",
          needs: ["Milieu", "Attaquant"]
        },

      ];

      setTeams(mockTeams);
      setSearchResults(mockTeams);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Search function
  const handleSearch = () => {
    const results = teams.filter(team => {
      // Search by name or location
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by region
      const matchesRegion = filters.region === '' || team.region === filters.region;

      // Filter by division
      const matchesDivision = filters.division === '' || team.division === filters.division;

      // Filter by availability
      const isAvailable = team.players < team.maxPlayers;
      const matchesAvailability = filters.availability === '' ||
          (filters.availability === 'available' && isAvailable) ||
          (filters.availability === 'full' && !isAvailable);

      return matchesSearch && matchesRegion && matchesDivision && matchesAvailability;
    });

    setSearchResults(results);
    setCurrentPage(1);
  };

  // Handle join team button click
  const handleJoinClick = (team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the data to your API
    alert(`Votre demande pour rejoindre ${selectedTeam.name} a été envoyée !`);
    setShowModal(false);
  };

  // Pagination
  const teamsPerPage = 6;
  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = searchResults.slice(indexOfFirstTeam, indexOfLastTeam);
  const totalPages = Math.ceil(searchResults.length / teamsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
      <PageContainer>
        <HeaderJ />
        <ContentContainer>
          <PageTitle>Rejoindre une équipe</PageTitle>
          <PageDescription>
            Trouvez l'équipe parfaite pour vous et envoyez votre candidature en quelques clics.
          </PageDescription>

          {/* Search and Filters */}
          <SearchContainer>
            <SearchHeader>
              <SearchTitle>Rechercher des équipes</SearchTitle>
              <FiltersToggle onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'} {showFilters ? '▲' : '▼'}
              </FiltersToggle>
            </SearchHeader>

            <SearchInputContainer showFilters={showFilters}>
              <SearchInput
                  type="text"
                  placeholder="Rechercher par nom ou ville..."
                  value={searchQuery}
                  onChange={handleSearchChange}
              />
              <SearchButton onClick={handleSearch}>Rechercher</SearchButton>
            </SearchInputContainer>

            <FiltersContainer show={showFilters}>
              <FilterGroup>
                <FilterLabel>Région</FilterLabel>
                <FilterSelect name="region" value={filters.region} onChange={handleFilterChange}>
                  <option value="">Toutes les régions</option>
                  <option value="Casa-Settat">Casa-Settat</option>
                  <option value="Rabat-Salé-Kénitra">Rabat-Salé-Kénitra</option>
                  <option value="Marrakech-Safi">Marrakech-Safi</option>
                  <option value="Fès-Meknès">Fès-Meknès</option>
                  <option value="Tanger-Tétouan-Al Hoceïma">Tanger-Tétouan-Al Hoceïma</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Division</FilterLabel>
                <FilterSelect name="division" value={filters.division} onChange={handleFilterChange}>
                  <option value="">Toutes les divisions</option>
                  <option value="Division 1">Division 1</option>
                  <option value="Division 2">Division 2</option>
                  <option value="Division 3">Division 3</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Disponibilité</FilterLabel>
                <FilterSelect name="availability" value={filters.availability} onChange={handleFilterChange}>
                  <option value="">Toutes les équipes</option>
                  <option value="available">Places disponibles</option>
                  <option value="full">Équipes complètes</option>
                </FilterSelect>
              </FilterGroup>
            </FiltersContainer>
          </SearchContainer>

          {/* Teams Grid */}
          {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                Chargement des équipes...
              </div>
          ) : searchResults.length > 0 ? (
              <>
                <TeamGrid>
                  {currentTeams.map(team => (
                      <TeamCard key={team.id}>
                        <TeamHeader image={team.coverImage}>
                          <TeamLogo style={{ backgroundColor: team.logoColor, color: 'white' }}>
                            {team.logo}
                          </TeamLogo>
                          <TeamDivision>{team.division}</TeamDivision>
                        </TeamHeader>

                        <TeamContent>
                          <TeamName>{team.name}</TeamName>
                          <TeamLocation>📍 {team.location}</TeamLocation>

                          <TeamStats>
                            <StatItem>
                              <StatValue>{team.players}/{team.maxPlayers}</StatValue>
                              <StatLabel>Joueurs</StatLabel>
                            </StatItem>
                            <StatItem>
                              <StatValue>{team.winRate}%</StatValue>
                              <StatLabel>Victoires</StatLabel>
                            </StatItem>
                            <StatItem>
                              <StatValue>{team.played}</StatValue>
                              <StatLabel>Matchs</StatLabel>
                            </StatItem>
                          </TeamStats>

                          <TeamDescription>{team.description}</TeamDescription>

                          <TeamFooter>
                            <RosterStatus full={team.players >= team.maxPlayers}>
                              {team.players >= team.maxPlayers ? 'Équipe complète' : `${team.maxPlayers - team.players} places disponibles`}
                            </RosterStatus>

                            <JoinButton
                                full={team.players >= team.maxPlayers}
                                disabled={team.players >= team.maxPlayers}
                                onClick={() => handleJoinClick(team)}
                            >
                              Rejoindre
                            </JoinButton>
                          </TeamFooter>
                        </TeamContent>
                      </TeamCard>
                  ))}
                </TeamGrid>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination>
                      <PageButton
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                      >
                        &laquo;
                      </PageButton>

                      {Array.from({ length: totalPages }, (_, i) => (
                          <PageButton
                              key={i + 1}
                              active={currentPage === i + 1}
                              onClick={() => paginate(i + 1)}
                          >
                            {i + 1}
                          </PageButton>
                      ))}

                      <PageButton
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                      >
                        &raquo;
                      </PageButton>
                    </Pagination>
                )}
              </>
          ) : (
              <NoResults>
                <NoResultsIcon>🔍</NoResultsIcon>
                <NoResultsTitle>Aucune équipe trouvée</NoResultsTitle>
                <NoResultsText>
                  Nous n'avons trouvé aucune équipe correspondant à vos critères. Essayez de modifier vos filtres ou de rechercher d'autres termes.
                </NoResultsText>
              </NoResults>
          )}
        </ContentContainer>

        {/* Join Team Modal */}
        <Modal show={showModal}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Rejoindre l'équipe</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            </ModalHeader>

            <ModalBody>
              {selectedTeam && (
                  <>
                    <TeamPreview>
                      <TeamLogoLarge style={{ backgroundColor: selectedTeam.logoColor, color: 'white' }}>
                        {selectedTeam.logo}
                      </TeamLogoLarge>
                      <TeamInfo>
                        <TeamNameLarge>{selectedTeam.name}</TeamNameLarge>
                        <TeamLocationSmall>📍 {selectedTeam.location}</TeamLocationSmall>
                      </TeamInfo>
                    </TeamPreview>

                    <form onSubmit={handleSubmit}>
                      <FormGroup>
                        <FormLabel>Quelle position jouez-vous ?</FormLabel>
                        <FormInput type="text" placeholder="Ex: Attaquant, Défenseur, Gardien..." required />
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>Votre expérience</FormLabel>
                        <FormInput type="text" placeholder="Ex: 5 ans de futsal, 3 ans en club..." required />
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>Message pour l'équipe</FormLabel>
                        <FormTextarea
                            placeholder="Présentez-vous et expliquez pourquoi vous souhaitez rejoindre cette équipe..."
                            required
                        ></FormTextarea>
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>Disponibilités</FormLabel>
                        <FormInput type="text" placeholder="Ex: Soirs en semaine, weekends..." required />
                      </FormGroup>

                      <SubmitButton type="submit">Envoyer ma candidature</SubmitButton>
                    </form>
                  </>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </PageContainer>
  );
};

export default JoinTeam;