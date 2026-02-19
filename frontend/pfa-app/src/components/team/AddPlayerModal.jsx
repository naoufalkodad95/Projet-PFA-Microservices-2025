// // src/components/team/AddPlayerModal.jsx
// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import Button from '../common/Button';
// import theme from '../../styles/theme';
// import teamService from '../../services/teamService';
//
// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 1000;
// `;
//
// const ModalContainer = styled.div`
//   background-color: ${theme.colors.background};
//   border-radius: ${theme.borderRadius.medium};
//   padding: ${theme.spacing.lg};
//   width: 90%;
//   max-width: 600px;
//   box-shadow: ${theme.shadows.large};
//   max-height: 90vh;
//   overflow-y: auto;
// `;
//
// const ModalHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: ${theme.spacing.md};
// `;
//
// const ModalTitle = styled.h2`
//   font-size: ${theme.typography.fontSizes.xl};
//   color: ${theme.colors.textPrimary};
//   margin: 0;
// `;
//
// const CloseButton = styled.button`
//   background: none;
//   border: none;
//   font-size: ${theme.typography.fontSizes.xl};
//   color: ${theme.colors.textSecondary};
//   cursor: pointer;
//
//   &:hover {
//     color: ${theme.colors.primary};
//   }
// `;
//
// const TabsContainer = styled.div`
//   margin-bottom: ${theme.spacing.md};
// `;
//
// const TabList = styled.div`
//   display: flex;
//   border-bottom: 1px solid ${theme.colors.border};
// `;
//
// const Tab = styled.button`
//   padding: ${theme.spacing.sm} ${theme.spacing.md};
//   background: none;
//   border: none;
//   border-bottom: 2px solid ${props => props.active ? theme.colors.primary : 'transparent'};
//   color: ${props => props.active ? theme.colors.primary : theme.colors.textSecondary};
//   font-weight: ${props => props.active ? theme.typography.fontWeights.bold : theme.typography.fontWeights.regular};
//   cursor: pointer;
//   transition: all ${theme.transitions.fast};
//
//   &:hover {
//     color: ${theme.colors.primary};
//   }
// `;
//
// const TabContent = styled.div`
//   display: ${props => props.active ? 'block' : 'none'};
//   padding: ${theme.spacing.md} 0;
// `;
//
// const SearchForm = styled.form`
//   margin-bottom: ${theme.spacing.md};
//   display: flex;
//   gap: ${theme.spacing.sm};
// `;
//
// const SearchInput = styled.input`
//   flex: 1;
//   padding: ${theme.spacing.sm};
//   border: 1px solid ${theme.colors.border};
//   border-radius: ${theme.borderRadius.small};
//   font-size: ${theme.typography.fontSizes.md};
//
//   &:focus {
//     outline: none;
//     border-color: ${theme.colors.primary};
//   }
// `;
//
// const SelectInput = styled.select`
//   padding: ${theme.spacing.sm};
//   border: 1px solid ${theme.colors.border};
//   border-radius: ${theme.borderRadius.small};
//   font-size: ${theme.typography.fontSizes.md};
//
//   &:focus {
//     outline: none;
//     border-color: ${theme.colors.primary};
//   }
// `;
//
// const PlayersList = styled.div`
//   max-height: 300px;
//   overflow-y: auto;
//   border: 1px solid ${theme.colors.border};
//   border-radius: ${theme.borderRadius.small};
// `;
//
// const PlayerItem = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: ${theme.spacing.sm} ${theme.spacing.md};
//   border-bottom: 1px solid ${theme.colors.border};
//
//   &:last-child {
//     border-bottom: none;
//   }
//
//   &:hover {
//     background-color: ${theme.colors.lightPrimary};
//   }
// `;
//
// const PlayerInfo = styled.div`
//   display: flex;
//   flex-direction: column;
// `;
//
// const PlayerName = styled.span`
//   font-weight: ${theme.typography.fontWeights.medium};
// `;
//
// const PlayerDetails = styled.span`
//   font-size: ${theme.typography.fontSizes.sm};
//   color: ${theme.colors.textSecondary};
// `;
//
// const ManualForm = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: ${theme.spacing.md};
// `;
//
// const FormGroup = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: ${theme.spacing.xs};
// `;
//
// const FormLabel = styled.label`
//   font-weight: ${theme.typography.fontWeights.medium};
//   color: ${theme.colors.textPrimary};
// `;
//
// const FormInput = styled.input`
//   padding: ${theme.spacing.sm};
//   border: 1px solid ${theme.colors.border};
//   border-radius: ${theme.borderRadius.small};
//   font-size: ${theme.typography.fontSizes.md};
//
//   &:focus {
//     outline: none;
//     border-color: ${theme.colors.primary};
//   }
// `;
//
// const ButtonGroup = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   gap: ${theme.spacing.sm};
//   margin-top: ${theme.spacing.md};
// `;
//
// const LoadingContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   padding: ${theme.spacing.lg};
//   color: ${theme.colors.textSecondary};
// `;
//
// const ErrorMessage = styled.div`
//   padding: ${theme.spacing.sm};
//   background-color: rgba(211, 84, 0, 0.1);
//   border-left: 3px solid ${theme.colors.secondary};
//   color: ${theme.colors.textSecondary};
//   margin-bottom: ${theme.spacing.md};
// `;
//
// const AddPlayerModal = ({ isOpen, onClose, teamId, onPlayerAdded }) => {
//   const [activeTab, setActiveTab] = useState('search');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [positionFilter, setPositionFilter] = useState('');
//   const [niveauMin, setNiveauMin] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//
//   // État pour le formulaire manuel
//   const [newPlayer, setNewPlayer] = useState({
//     nom: '',
//     prenom: '',
//     email: '',
//     position: '',
//     niveau: 1
//   });
//
//   // Effectuer une recherche lorsque les filtres changent
//   useEffect(() => {
//     if (activeTab === 'search' && isOpen) {
//       handleSearch();
//     }
//   }, [activeTab, isOpen]);
//
//   // Fermer le modal lorsque l'utilisateur clique à l'extérieur
//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };
//
//   // Rechercher des joueurs
//   const handleSearch = async (e) => {
//     if (e) e.preventDefault();
//
//     setLoading(true);
//     setError('');
//
//     try {
//       const searchParams = {
//         nom: searchQuery,
//         position: positionFilter || undefined,
//         niveauMin: niveauMin ? parseInt(niveauMin) : undefined
//       };
//
//       const results = await teamService.searchJoueurs(searchParams);
//       setSearchResults(results);
//     } catch (error) {
//       setError('Erreur lors de la recherche de joueurs. Veuillez réessayer.');
//       console.error('Search error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // Ajouter un joueur existant à l'équipe
//   const handleAddExistingPlayer = async (playerId) => {
//     try {
//       setLoading(true);
//       setError('');
//
//       await teamService.addJoueurToEquipe(teamId, playerId);
//       onPlayerAdded();
//       onClose();
//     } catch (error) {
//       setError('Erreur lors de l\'ajout du joueur à l\'équipe. Veuillez réessayer.');
//       console.error('Add player error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // Gérer les changements dans le formulaire manuel
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewPlayer({
//       ...newPlayer,
//       [name]: value
//     });
//   };
//
// // Modifiez la fonction handleCreatePlayer dans AddPlayerModal.jsx
//
// // Créer un nouveau joueur
//   const handleCreatePlayer = async (e) => {
//     e.preventDefault();
//
//     // Validation simple
//     if (!newPlayer.nom || !newPlayer.prenom || !newPlayer.email) {
//       setError('Veuillez remplir tous les champs obligatoires.');
//       return;
//     }
//
//     try {
//       setLoading(true);
//       setError('');
//
//       console.log('Création du joueur avec les données:', newPlayer);
//
//       // Étape 1: Créer le joueur
//       let createdPlayer;
//       try {
//         createdPlayer = await teamService.createJoueur(newPlayer);
//         console.log('Joueur créé avec succès:', createdPlayer);
//       } catch (createError) {
//         console.error('Erreur lors de la création du joueur:', createError);
//         setError('Erreur lors de la création du joueur. Veuillez réessayer.');
//         setLoading(false);
//         return;
//       }
//
//       // Étape 2: Ajouter le joueur à l'équipe
//       try {
//         console.log(`Tentative d'ajout du joueur (ID: ${createdPlayer.id}) à l'équipe (ID: ${teamId})`);
//         await teamService.addJoueurToEquipe(teamId, createdPlayer.id);
//         console.log('Joueur ajouté à l\'équipe avec succès');
//       } catch (addError) {
//         console.error('Erreur lors de l\'ajout du joueur à l\'équipe:', addError);
//         setError('Le joueur a été créé mais n\'a pas pu être ajouté à l\'équipe. Veuillez réessayer manuellement.');
//         setLoading(false);
//         // On ne ferme pas le modal pour permettre à l'utilisateur de voir le message d'erreur
//         return;
//       }
//
//       // Si tout s'est bien passé
//       onPlayerAdded();
//       onClose();
//     } catch (error) {
//       console.error('Erreur générale:', error);
//       setError('Erreur lors de la création du joueur. Veuillez réessayer.');
//     } finally {
//       setLoading(false);
//     }
//   };
//   if (!isOpen) return null;
//
//   return (
//       <ModalOverlay onClick={handleOverlayClick}>
//         <ModalContainer onClick={e => e.stopPropagation()}>
//           <ModalHeader>
//             <ModalTitle>Ajouter un joueur</ModalTitle>
//             <CloseButton onClick={onClose}>×</CloseButton>
//           </ModalHeader>
//
//           {error && <ErrorMessage>{error}</ErrorMessage>}
//
//           <TabsContainer>
//             <TabList>
//               <Tab
//                   active={activeTab === 'search'}
//                   onClick={() => setActiveTab('search')}
//               >
//                 Rechercher un joueur
//               </Tab>
//               <Tab
//                   active={activeTab === 'manual'}
//                   onClick={() => setActiveTab('manual')}
//               >
//                 Création manuelle
//               </Tab>
//             </TabList>
//
//             <TabContent active={activeTab === 'search'}>
//               <SearchForm onSubmit={handleSearch}>
//                 <SearchInput
//                     type="text"
//                     placeholder="Rechercher par nom..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//
//                 <SelectInput
//                     value={positionFilter}
//                     onChange={(e) => setPositionFilter(e.target.value)}
//                 >
//                   <option value="">Toutes positions</option>
//                   <option value="Forward">Attaquant</option>
//                   <option value="Midfield">Milieu</option>
//                   <option value="Defender">Défenseur</option>
//                   <option value="Goalkeeper">Gardien</option>
//                 </SelectInput>
//
//                 <SelectInput
//                     value={niveauMin}
//                     onChange={(e) => setNiveauMin(e.target.value)}
//                 >
//                   <option value="">Tout niveau</option>
//                   <option value="1">Niveau 1+</option>
//                   <option value="2">Niveau 2+</option>
//                   <option value="3">Niveau 3+</option>
//                   <option value="4">Niveau 4+</option>
//                   <option value="5">Niveau 5+</option>
//                 </SelectInput>
//
//                 <Button type="submit" variant="primary" size="small">
//                   Rechercher
//                 </Button>
//               </SearchForm>
//
//               {loading ? (
//                   <LoadingContainer>Chargement...</LoadingContainer>
//               ) : searchResults.length > 0 ? (
//                   <PlayersList>
//                     {searchResults.map(player => (
//                         <PlayerItem key={player.id}>
//                           <PlayerInfo>
//                             <PlayerName>{player.name}</PlayerName>
//                             <PlayerDetails>
//                               {player.position} • {player.goals} buts • {player.email}
//                             </PlayerDetails>
//                           </PlayerInfo>
//                           <Button
//                               variant="primary"
//                               size="small"
//                               onClick={() => handleAddExistingPlayer(player.id)}
//                           >
//                             Ajouter
//                           </Button>
//                         </PlayerItem>
//                     ))}
//                   </PlayersList>
//               ) : (
//                   <p>Aucun joueur trouvé. Essayez d'autres critères de recherche.</p>
//               )}
//             </TabContent>
//
//             <TabContent active={activeTab === 'manual'}>
//               <ManualForm onSubmit={handleCreatePlayer}>
//                 <FormGroup>
//                   <FormLabel htmlFor="nom">Nom*</FormLabel>
//                   <FormInput
//                       type="text"
//                       id="nom"
//                       name="nom"
//                       value={newPlayer.nom}
//                       onChange={handleInputChange}
//                       required
//                   />
//                 </FormGroup>
//
//                 <FormGroup>
//                   <FormLabel htmlFor="prenom">Prénom*</FormLabel>
//                   <FormInput
//                       type="text"
//                       id="prenom"
//                       name="prenom"
//                       value={newPlayer.prenom}
//                       onChange={handleInputChange}
//                       required
//                   />
//                 </FormGroup>
//
//                 <FormGroup>
//                   <FormLabel htmlFor="email">Email*</FormLabel>
//                   <FormInput
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={newPlayer.email}
//                       onChange={handleInputChange}
//                       required
//                   />
//                 </FormGroup>
//
//                 <FormGroup>
//                   <FormLabel htmlFor="position">Position</FormLabel>
//                   <SelectInput
//                       id="position"
//                       name="position"
//                       value={newPlayer.position}
//                       onChange={handleInputChange}
//                   >
//                     <option value="">Sélectionner...</option>
//                     <option value="Forward">Attaquant</option>
//                     <option value="Midfield">Milieu</option>
//                     <option value="Defender">Défenseur</option>
//                     <option value="Goalkeeper">Gardien</option>
//                   </SelectInput>
//                 </FormGroup>
//
//                 <FormGroup>
//                   <FormLabel htmlFor="niveau">Niveau (1-5)</FormLabel>
//                   <SelectInput
//                       id="niveau"
//                       name="niveau"
//                       value={newPlayer.niveau}
//                       onChange={handleInputChange}
//                   >
//                     <option value="1">1 - Débutant</option>
//                     <option value="2">2 - Intermédiaire</option>
//                     <option value="3">3 - Confirmé</option>
//                     <option value="4">4 - Avancé</option>
//                     <option value="5">5 - Expert</option>
//                   </SelectInput>
//                 </FormGroup>
//
//                 <ButtonGroup>
//                   <Button
//                       type="button"
//                       buttonType="outlined"
//                       variant="secondary"
//                       onClick={onClose}
//                   >
//                     Annuler
//                   </Button>
//                   <Button
//                       type="submit"
//                       variant="primary"
//                       disabled={loading}
//                   >
//                     {loading ? 'Création...' : 'Créer et ajouter'}
//                   </Button>
//                 </ButtonGroup>
//               </ManualForm>
//             </TabContent>
//           </TabsContainer>
//         </ModalContainer>
//       </ModalOverlay>
//   );
// };
//
// export default AddPlayerModal;


import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import theme from '../../styles/theme';
import teamService from '../../services/teamService';

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background-color: ${theme.colors.background};
    border-radius: ${theme.borderRadius.medium};
    padding: ${theme.spacing.lg};
    width: 90%;
    max-width: 600px;
    box-shadow: ${theme.shadows.large};
    display: flex;
    flex-direction: column;
    max-height: 90vh;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.md};
`;

const ModalTitle = styled.h2`
    font-size: ${theme.typography.fontSizes.xl};
    color: ${theme.colors.textPrimary};
    margin: 0;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: ${theme.typography.fontSizes.xl};
    color: ${theme.colors.textSecondary};
    cursor: pointer;

    &:hover {
        color: ${theme.colors.primary};
    }
`;

const TabsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
`;

const TabList = styled.div`
    display: flex;
    border-bottom: 1px solid ${theme.colors.border};
`;

const Tab = styled.button`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    background: none;
    border: none;
    border-bottom: 2px solid ${props => props.active ? theme.colors.primary : 'transparent'};
    color: ${props => props.active ? theme.colors.primary : theme.colors.textSecondary};
    font-weight: ${props => props.active ? theme.typography.fontWeights.bold : theme.typography.fontWeights.regular};
    cursor: pointer;
    transition: all ${theme.transitions.fast};

    &:hover {
        color: ${theme.colors.primary};
    }
`;

const TabContent = styled.div`
    display: ${props => props.active ? 'flex' : 'none'};
    flex-direction: column;
    padding: ${theme.spacing.md} 0;
    flex: 1;
    overflow: hidden;
`;

const SearchForm = styled.form`
    margin-bottom: ${theme.spacing.md};
    display: grid;
    grid-template-columns: 1fr 120px 120px auto;
    gap: ${theme.spacing.sm};
    align-items: center;
`;

const SearchInput = styled.input`
    padding: ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.small};
    font-size: ${theme.typography.fontSizes.md};

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
    }
`;

const SelectInput = styled.select`
    padding: ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.small};
    font-size: ${theme.typography.fontSizes.md};

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
    }
`;

const PlayersList = styled.div`
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.small};
    flex: 1;
    overflow-y: auto;
    max-height: 400px;
`;

const PlayerItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-bottom: 1px solid ${theme.colors.border};

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: ${theme.colors.lightPrimary};
    }
`;

const PlayerInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const PlayerName = styled.span`
    font-weight: ${theme.typography.fontWeights.medium};
`;

const PlayerDetails = styled.span`
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.textSecondary};
`;

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
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    &:hover {
        background: ${props => props.color || '#f5f5f5'};
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;

const ManualForm = styled.form`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing.md};
    overflow-y: auto;
    padding-right: ${theme.spacing.sm};
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xs};
`;

const FormGroupFull = styled(FormGroup)`
    grid-column: 1 / span 2;
`;

const FormLabel = styled.label`
    font-weight: ${theme.typography.fontWeights.medium};
    color: ${theme.colors.textPrimary};
`;

const FormInput = styled.input`
    padding: ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.small};
    font-size: ${theme.typography.fontSizes.md};

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing.sm};
    margin-top: ${theme.spacing.md};
    grid-column: 1 / span 2;
`;

const ErrorMessage = styled.div`
    padding: ${theme.spacing.sm};
    background-color: rgba(211, 84, 0, 0.1);
    border-left: 3px solid ${theme.colors.secondary};
    color: ${theme.colors.textSecondary};
    margin-bottom: ${theme.spacing.md};
`;

// Données exemple en français
const samplePlayers = [
  { id: 1, name: 'Hamza Amara', position: 'Gardien', goals: 0, email: 'hamza.amara@gmail.com' },
  { id: 2, name: 'Abdel Malik', position: 'Défenseur', goals: 4, email: 'abdel.malik@gmail.com' },
  { id: 3, name: 'Moufid Petit', position: 'Attaquant', goals: 12, email: 'moufid.petit@gmail.com' },
  { id: 4, name: 'Wail Guerrouj', position: 'Milieu', goals: 6, email: 'Wail.Guerrouj@gmail.com' },
  { id: 3, name: 'Abdo Maldini', position: 'Défenseur', goals: 5, email: 'Abdo.Maldini@gmail.com' },
  { id: 3, name: 'Walid walid', position: 'Milieu', goals: 5, email: 'walid.walid@gmail.com' },
  { id: 3, name: 'Ayoub Zaoui', position: 'Gardien', goals: 0, email: 'Ayoub.Zaoui@gmail.com' },
];

const AddPlayerModal = ({ isOpen, onClose, teamId, onPlayerAdded }) => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [niveauMin, setNiveauMin] = useState('');
  const [searchResults, setSearchResults] = useState(samplePlayers);
  const [error, setError] = useState('');

  const [newPlayer, setNewPlayer] = useState({
    nom: '',
    prenom: '',
    email: '',
    position: '',
    niveau: 1
  });

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const filtered = samplePlayers.filter(player => {
      const matchesName = player.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPosition = !positionFilter || player.position === positionFilter;
      return matchesName && matchesPosition;
    });
    setSearchResults(filtered);
  };

  const handleAddExistingPlayer = (playerId) => {
    onPlayerAdded();
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer({ ...newPlayer, [name]: value });
  };

  const handleCreatePlayer = (e) => {
    e.preventDefault();
    if (!newPlayer.nom || !newPlayer.prenom || !newPlayer.email) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    onPlayerAdded();
    onClose();
  };

  if (!isOpen) return null;

  return (
      <ModalOverlay onClick={handleOverlayClick}>
        <ModalContainer onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Ajouter un joueur</ModalTitle>
            <CloseButton onClick={onClose}>×</CloseButton>
          </ModalHeader>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <TabsContainer>
            <TabList>
              <Tab active={activeTab === 'search'} onClick={() => setActiveTab('search')}>
                Rechercher un joueur
              </Tab>
              <Tab active={activeTab === 'manual'} onClick={() => setActiveTab('manual')}>
                Création manuelle
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

                <Button type="submit" variant="primary" size="small">
                  Rechercher
                </Button>
              </SearchForm>

              <PlayersList>
                {searchResults.map(player => (
                    <PlayerItem key={player.id}>
                      <PlayerInfo>
                        <PlayerName>{player.name}</PlayerName>
                        <PlayerDetails>
                          {player.position} • {player.goals} buts • {player.email}
                        </PlayerDetails>
                      </PlayerInfo>
                      <ActionButton
                          color="#4caf50"
                          onClick={() => handleAddExistingPlayer(player.id)}
                      >
                        +
                      </ActionButton>
                    </PlayerItem>
                ))}
                {searchResults.length === 0 && (
                    <PlayerItem>
                      <PlayerInfo>
                        <PlayerName>Aucun joueur trouvé</PlayerName>
                        <PlayerDetails>
                          Essayez d'autres critères de recherche
                        </PlayerDetails>
                      </PlayerInfo>
                    </PlayerItem>
                )}
              </PlayersList>
            </TabContent>

            <TabContent active={activeTab === 'manual'}>
              <ManualForm onSubmit={handleCreatePlayer}>
                <FormGroup>
                  <FormLabel htmlFor="nom">Nom*</FormLabel>
                  <FormInput
                      type="text"
                      id="nom"
                      name="nom"
                      value={newPlayer.nom}
                      onChange={handleInputChange}
                      required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="prenom">Prénom*</FormLabel>
                  <FormInput
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={newPlayer.prenom}
                      onChange={handleInputChange}
                      required
                  />
                </FormGroup>

                <FormGroupFull>
                  <FormLabel htmlFor="email">Email*</FormLabel>
                  <FormInput
                      type="email"
                      id="email"
                      name="email"
                      value={newPlayer.email}
                      onChange={handleInputChange}
                      required
                  />
                </FormGroupFull>

                <FormGroup>
                  <FormLabel htmlFor="position">Position</FormLabel>
                  <SelectInput
                      id="position"
                      name="position"
                      value={newPlayer.position}
                      onChange={handleInputChange}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Gardien">Gardien</option>
                    <option value="Défenseur">Défenseur</option>
                    <option value="Milieu">Milieu</option>
                    <option value="Attaquant">Attaquant</option>
                  </SelectInput>
                </FormGroup>

                <ButtonGroup>
                  <Button
                      type="button"
                      buttonType="outlined"
                      variant="secondary"
                      onClick={onClose}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" variant="primary">
                    Créer et ajouter
                  </Button>
                </ButtonGroup>
              </ManualForm>
            </TabContent>
          </TabsContainer>
        </ModalContainer>
      </ModalOverlay>
  );
};

export default AddPlayerModal;