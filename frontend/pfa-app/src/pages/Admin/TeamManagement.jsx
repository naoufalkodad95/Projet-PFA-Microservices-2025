// src/pages/TeamManagement.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainLayout from '../../components/layout/MainLayout';
import TeamLogo from '../../components/team/TeamLogo';
import TeamStats from '../../components/team/TeamStats';
import MembersTable from '../../components/team/MembersTable';
import RequestsTable from '../../components/team/RequestsTable';
import Tabs from '../../components/common/Tabs';
import FloatingActionButton from '../../components/common/FloatingActionButton';
import AddPlayerModal from '../../components/team/AddPlayerModal';
import EditTeamModal from '../../components/team/EditTeamModal';
import { useTeam } from '../../context/TeamContext';
import theme from '../../styles/theme';
import teamService from '../../services/teamService'; // Assurez-vous que ce service est correctement configuré

const TeamHeader = styled.div`
    display: flex;
    gap: ${theme.spacing.xl};
    margin-bottom: ${theme.spacing.xl};

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;

const StyledTeamManagement = styled.div`
  width: 100%;
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: ${theme.typography.fontSizes.lg};
  color: ${theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  padding: ${theme.spacing.lg};
  margin: ${theme.spacing.md} 0;
  background-color: rgba(211, 84, 0, 0.1);
  border-left: 4px solid ${theme.colors.negative};
  color: ${theme.colors.textSecondary};
  border-radius: ${theme.borderRadius.small};
`;

// Composant EditTeamModal (si vous n'avez pas créé le fichier séparé)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.large};
  width: 90%;
  max-width: 500px;
  padding: ${theme.spacing.lg};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.textPrimary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${theme.colors.textSecondary};
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: ${theme.typography.fontWeights.medium};
  color: ${theme.colors.textPrimary};
`;

const Input = styled.input`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(37, 165, 95, 0.2);
  }
`;

const ImagePreview = styled.div`
  display: ${props => props.hasImage ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  margin-top: ${theme.spacing.sm};
`;

const PreviewImage = styled.img`
  max-width: 150px;
  max-height: 150px;
  object-fit: contain;
  margin-bottom: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.small};
  padding: ${theme.spacing.xs};
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`;

// Composant du Modal d'Édition d'Équipe
const TeamEditModal = ({ isOpen, onClose, team, onSave }) => {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    logo: null
  });
  const [previewURL, setPreviewURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Convertir l'image binaire en URL si elle existe
  React.useEffect(() => {
    if (team?.logo) {
      // Si logo est déjà un Blob ou une URL
      if (typeof team.logo === 'string' && team.logo.startsWith('blob:')) {
        setPreviewURL(team.logo);
      }
      // Si logo est un tableau d'octets (Uint8Array)
      else if (team.logo instanceof Uint8Array || (Array.isArray(team.logo) && team.logo.every(item => typeof item === 'number'))) {
        const blob = new Blob([new Uint8Array(team.logo)], { type: 'image/png' });
        setPreviewURL(URL.createObjectURL(blob));
      }
    }
  }, [team]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));

      // Créer une URL pour la prévisualisation
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    setPreviewURL(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convertir le logo en tableau d'octets si nécessaire
      let logoBytes = null;
      if (formData.logo && formData.logo instanceof File) {
        const arrayBuffer = await formData.logo.arrayBuffer();
        logoBytes = Array.from(new Uint8Array(arrayBuffer));
      }

      // Créer l'objet à envoyer au service
      const teamData = {
        name: formData.name,
        logo: logoBytes
      };

      await onSave(teamData);
      onClose();
    } catch (error) {
      console.error('Error saving team:', error);
      // Vous pourriez ajouter un état d'erreur et l'afficher ici
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
      <ModalOverlay onClick={onClose}>
        <ModalContainer onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Modifier l'équipe</ModalTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Nom de l'équipe</Label>
              <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="logo">Logo de l'équipe</Label>
              <Input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
              />

              <ImagePreview hasImage={previewURL}>
                <PreviewImage src={previewURL} alt="Aperçu du logo" />
                <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: theme.colors.secondary,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                >
                  Supprimer l'image
                </button>
              </ImagePreview>
            </FormGroup>

            <ButtonsContainer>
              <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '8px 16px',
                    background: 'white',
                    border: `1px solid ${theme.colors.primary}`,
                    borderRadius: '4px',
                    color: theme.colors.primary,
                    cursor: 'pointer'
                  }}
              >
                Annuler
              </button>
              <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '8px 16px',
                    background: theme.colors.primary,
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1
                  }}
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </ButtonsContainer>
          </Form>
        </ModalContainer>
      </ModalOverlay>
  );
};

const TeamManagement = () => {
  // État pour gérer les modales
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
  const [isEditPlayerModalOpen, setIsEditPlayerModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // État local si vous n'utilisez pas le contexte
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Charger les données depuis l'API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Définir un ID d'équipe par défaut (à adapter selon votre logique)
        const teamId = 1;

        // Charger les données de l'équipe
        const teamData = await teamService.getTeamById(teamId);
        setTeam(teamData);

        // Charger les membres
        const membersData = await teamService.getTeamMembers(teamId);
        setMembers(membersData);

        // Charger les demandes
        const requestsData = await teamService.getTeamMembershipRequests(teamId);
        setRequests(requestsData);

      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les données. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [refreshTrigger]);

  // Fonctions de gestion des actions
  const handleEditTeam = () => {
    setIsEditTeamModalOpen(true);
  };

  const handleSaveTeam = async (teamData) => {
    try {
      await teamService.updateEquipe(team.id, teamData);
      // Rafraîchir les données
      setRefreshTrigger(prev => prev + 1);
      alert('Équipe mise à jour avec succès!');
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'équipe:", error);
      setError("Impossible de mettre à jour les informations de l'équipe. Veuillez réessayer.");
    }
  };

  const handleAddPlayer = () => {
    setIsAddPlayerModalOpen(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setIsEditPlayerModalOpen(true);
  };

  const handlePromoteToCaptain = async (member) => {
    try {
      await teamService.promoteToCaptain(team.id, member.id);
      // Rafraîchir les données
      setRefreshTrigger(prev => prev + 1);
      alert(`${member.name} est maintenant le capitaine de l'équipe!`);
    } catch (error) {
      console.error("Erreur lors de la promotion du capitaine:", error);
      setError("Impossible de nommer ce joueur capitaine. Veuillez réessayer.");
    }
  };

  const handleRemoveMember = async (member) => {
    if (window.confirm(`Êtes-vous sûr de vouloir retirer ${member.name} de l'équipe ?`)) {
      try {
        await teamService.removeMember(team.id, member.id);
        // Rafraîchir les données
        setRefreshTrigger(prev => prev + 1);
        alert(`${member.name} a été retiré de l'équipe.`);
      } catch (error) {
        console.error("Erreur lors du retrait du membre:", error);
        setError("Impossible de retirer ce joueur de l'équipe. Veuillez réessayer.");
      }
    }
  };

  const handleAcceptRequest = async (request) => {
    try {
      await teamService.acceptMembershipRequest(team.id, request.id);
      // Rafraîchir les données
      setRefreshTrigger(prev => prev + 1);
      alert(`La demande de ${request.name} a été acceptée!`);
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande:", error);
      setError("Impossible d'accepter cette demande. Veuillez réessayer.");
    }
  };

  const handleRejectRequest = async (request) => {
    if (window.confirm(`Êtes-vous sûr de vouloir rejeter la demande de ${request.name} ?`)) {
      try {
        await teamService.rejectMembershipRequest(team.id, request.id);
        // Rafraîchir les données
        setRefreshTrigger(prev => prev + 1);
        alert(`La demande de ${request.name} a été rejetée.`);
      } catch (error) {
        console.error("Erreur lors du rejet de la demande:", error);
        setError("Impossible de rejeter cette demande. Veuillez réessayer.");
      }
    }
  };

  const handlePlayerAdded = () => {
    // Rafraîchir les données après l'ajout d'un joueur
    setRefreshTrigger(prev => prev + 1);
  };

  // Contenu des onglets
  const tabsContent = [
    {
      label: 'Membres',
      content: (
          <MembersTable
              members={members}
              onEditMember={handleEditMember}
              onPromote={handlePromoteToCaptain}
              onRemoveMember={handleRemoveMember}
          />
      )
    },
    {
      label: 'Demandes d\'adhésion',
      badge: requests.length || null,
      content: (
          <RequestsTable
              requests={requests}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
              onAddPlayer={handleAddPlayer}
          />
      )
    }
  ];

  // Affichage du chargement
  if (loading) {
    return (
        <MainLayout>
          <LoadingMessage>Chargement des informations de l'équipe...</LoadingMessage>
        </MainLayout>
    );
  }

  // Affichage des erreurs
  if (error || !team) {
    return (
        <MainLayout>
          <ErrorMessage>
            {error || "Impossible de charger les informations de l'équipe. Veuillez réessayer plus tard."}
          </ErrorMessage>
        </MainLayout>
    );
  }

  return (
      <MainLayout>
        <StyledTeamManagement>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <TeamHeader>
            <TeamLogo name={team.name} logo={team.logo} />
            <TeamStats
                stats={team.stats}
                onEditClick={handleEditTeam}
            />
          </TeamHeader>

          <Tabs tabs={tabsContent} />

          <FloatingActionButton
              secondary
              onClick={handleAddPlayer}
              ariaLabel="Ajouter un joueur"
          />

          {/* Modales */}
          <AddPlayerModal
              isOpen={isAddPlayerModalOpen}
              onClose={() => setIsAddPlayerModalOpen(false)}
              teamId={team.id}
              onPlayerAdded={handlePlayerAdded}
          />

          {/* Modal d'édition d'équipe */}
          <TeamEditModal
              isOpen={isEditTeamModalOpen}
              onClose={() => setIsEditTeamModalOpen(false)}
              team={team}
              onSave={handleSaveTeam}
          />

          {/* Vous pourriez ajouter d'autres modales ici selon vos besoins */}
        </StyledTeamManagement>
      </MainLayout>
  );
};

export default TeamManagement;