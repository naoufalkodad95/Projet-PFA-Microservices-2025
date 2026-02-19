import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Spinner, Alert, Tab, Tabs, ListGroup, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import equipeService from '../../services/equipeService';
import { ActionButton } from '../../components/ActionButtons';
import AdminLayout from "../../pages/Admin/AdminLayout";

// Composants stylisés
const StyledCard = styled(Card)`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  border: none;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled(Card.Title)`
  font-size: 1.5rem;
  font-weight: 600;
  color: #25A55F;
  margin-bottom: 1rem;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #555;
`;

const MainTitle = styled.h2`
  color: #333;
  font-weight: 600;
  margin: 0;
`;

const StyledTabs = styled(Tabs)`
  border-bottom: 1px solid #dee2e6;
  
  .nav-link {
    color: #495057;
    font-weight: 500;
    border: none;
    padding: 0.75rem 1rem;
    position: relative;
    transition: all 0.2s;
    
    &:hover {
      color: #25A55F;
      background-color: transparent;
      border-color: transparent;
    }
    
    &.active {
      color: #25A55F;
      background-color: transparent;
      border-color: transparent;
      
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background-color: #25A55F;
      }
    }
  }
`;

const StyledBadge = styled(Badge)`
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
  font-weight: 500;
  border-radius: 6px;
`;

const InfoRow = styled(Row)`
  margin-bottom: 1.5rem;
  
  p {
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
  }
`;

const TournamentItem = styled(ListGroup.Item)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #666;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #25A55F;
  }
`;

const EquipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [equipe, setEquipe] = useState(null);
  const [tournois, setTournois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Utilisation de useCallback pour éviter les boucles infinies
  const fetchEquipe = useCallback(async () => {
    setLoading(true);
    try {
      const data = await equipeService.getById(id);
      setEquipe(data);

      // Récupérer les tournois de l'équipe
      try {
        const tournoiData = await equipeService.getTournoisByEquipeId(id);
        setTournois(tournoiData);
      } catch (tournoiError) {
        console.error('Erreur lors de la récupération des tournois:', tournoiError);
        // On ne définit pas d'erreur ici pour ne pas bloquer l'affichage de l'équipe
      }
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'équipe:', err);
      setError('Impossible de charger les données de l\'équipe. Veuillez réessayer plus tard.');
      toast.error('Erreur lors du chargement de l\'équipe');
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    fetchEquipe();
  }, [fetchEquipe]);
  
  // Fonction pour supprimer une équipe
  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'équipe "${equipe.nom}" ? Cette action est irréversible.`)) {
      try {
        await equipeService.delete(id);
        toast.success('Équipe supprimée avec succès');
        navigate('/equipes');
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'équipe:', err);
        
        // Gérer l'erreur spécifique si l'équipe participe à des tournois
        if (err.message && err.message.includes('participe à un ou plusieurs tournois')) {
          toast.error('Cette équipe participe à un ou plusieurs tournois et ne peut pas être supprimée');
        } else {
          toast.error('Erreur lors de la suppression de l\'équipe');
        }
      }
    }
  };
  
  // Fonction pour éditer une équipe
  const handleEdit = () => {
    navigate(`/equipes/edit/${id}`);
  };
  
  // Fonction pour revenir à la liste des équipes
  const handleBack = () => {
    navigate('/equipes');
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  
  // Rendu pendant le chargement
  if (loading) {
    return (
      <StyledCard>
        <Card.Body>
          <LoadingContainer>
            <Spinner animation="border" role="status" variant="primary" />
            <p className="mt-3 text-muted">Chargement des détails de l'équipe...</p>
          </LoadingContainer>
        </Card.Body>
      </StyledCard>
    );
  }
  
  // Rendu en cas d'erreur
  if (error) {
    return (
      <StyledCard>
        <Card.Body>
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
          <BackButton onClick={handleBack}>
            &larr; Retour à la liste
          </BackButton>
        </Card.Body>
      </StyledCard>
    );
  }
  
  // Rendu si l'équipe n'existe pas
  if (!equipe) {
    return (
      <StyledCard>
        <Card.Body>
          <Alert variant="warning" className="mb-3">
            L'équipe demandée n'existe pas ou a été supprimée.
          </Alert>
          <BackButton onClick={handleBack}>
            &larr; Retour à la liste
          </BackButton>
        </Card.Body>
      </StyledCard>
    );
  }
  
  return (
    <AdminLayout>
      <StyledCard>
        <Card.Header className="bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <BackButton onClick={handleBack}>
                &larr;
              </BackButton>
              <MainTitle className="ms-3">{equipe.nom}</MainTitle>
            </div>
            <ActionButtonsContainer>
              <ActionButton
                title="Modifier"
                color="#2196f3"
                onClick={handleEdit}
              >
                ✎
              </ActionButton>
              <ActionButton
                title="Supprimer"
                color="#f44336"
                onClick={handleDelete}
              >
                ✕
              </ActionButton>
            </ActionButtonsContainer>
          </div>
        </Card.Header>
        
        <Card.Body>
          <InfoRow>
            <Col md={6}>
              <p>
                <DetailLabel className="me-2">Date de création:</DetailLabel>
                <span>{formatDate(equipe.dateCreation)}</span>
              </p>
              <p>
                <DetailLabel className="me-2">Nombre de joueurs:</DetailLabel>
                <span>{equipe.nombreJoueurs || '—'}</span>
              </p>
            </Col>
            <Col md={6}>
              <p>
                <DetailLabel className="me-2">Capitaine:</DetailLabel>
                <span>{equipe.capitaine || 'Non défini'}</span>
              </p>
            </Col>
          </InfoRow>
        </Card.Body>
      </StyledCard>
      
      <StyledCard>
        <Card.Header className="bg-white py-3">
          <h4 className="m-0">Tournois</h4>
        </Card.Header>
        <Card.Body>
          {tournois && tournois.length > 0 ? (
            <ListGroup variant="flush">
              {tournois.map((tournoi) => (
                <TournamentItem key={tournoi.iD_Tournoi}>
                  <div>
                    <h5 className="mb-1">{tournoi.nom}</h5>
                    <div className="text-muted">
                      Du {formatDate(tournoi.dateDebut)} au {formatDate(tournoi.dateFin)}
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <StyledBadge 
                      bg={
                        tournoi.statut?.toLowerCase() === 'en cours' ? 'primary' :
                        tournoi.statut?.toLowerCase() === 'terminé' || tournoi.statut?.toLowerCase() === 'termine' ? 'success' :
                        tournoi.statut?.toLowerCase() === 'à venir' || tournoi.statut?.toLowerCase() === 'a venir' ? 'info' :
                        tournoi.statut?.toLowerCase() === 'annulé' || tournoi.statut?.toLowerCase() === 'annule' ? 'danger' :
                        'secondary'
                      }
                      className="me-2"
                    >
                      {tournoi.statut || 'Non défini'}
                    </StyledBadge>
                    <ActionButton
                      title="Voir le tournoi"
                      color="#4caf50"
                      onClick={() => navigate(`/tournois/${tournoi.iD_Tournoi}`)}
                    >
                      👁️
                    </ActionButton>
                  </div>
                </TournamentItem>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="info">
              Cette équipe ne participe à aucun tournoi pour le moment.
            </Alert>
          )}
        </Card.Body>
      </StyledCard>
    </AdminLayout>
  );
};

export default EquipeDetails;