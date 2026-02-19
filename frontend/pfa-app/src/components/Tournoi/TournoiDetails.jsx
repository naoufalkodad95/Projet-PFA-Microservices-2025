import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Badge, Button, Spinner, Alert, Tab, Tabs } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import tournoiService from '../../services/tournoiService';
import { ActionButton } from '../../components/ActionButtons';
import EquipeListTournoi from '../Equipe/EquipeListTournoi';
import MatchListTournoi from '../Match/MatchListTournoi';
import ClassementTournoi from '../Classement/ClassementTournoi';
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
    transition: all 0.2s ease;
    
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

const PriceBadge = styled(Badge)`
  font-size: 0.95rem;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  background-color: #28a745;
  margin-left: 10px;
`;

const InfoRow = styled(Row)`
  margin-bottom: 1.5rem;
  
  p {
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ReglementSection = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid #eaeaea;
  padding-top: 1.5rem;
  
  h5 {
    font-weight: 600;
    color: #444;
    margin-bottom: 1rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #666;
  padding: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #25A55F;
  }
`;

const TournoiDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tournoi, setTournoi] = useState(null);
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('equipes');
  const [refreshKey, setRefreshKey] = useState(0); // Clé pour forcer le rafraîchissement des composants enfants
  
  // Utilisation de useCallback pour éviter les boucles infinies
  const fetchTournoi = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tournoiService.getById(id);
      console.log('Données du tournoi reçues:', data);
      setTournoi(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement du tournoi:', err);
      setError('Impossible de charger les données du tournoi. Veuillez réessayer plus tard.');
      toast.error('Erreur lors du chargement du tournoi');
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    fetchTournoi();
  }, [fetchTournoi]);
  
  // Fonction pour forcer le rafraîchissement des composants enfants
  const refreshComponents = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  // Fonction pour changer d'onglet avec rafraîchissement
  const handleTabChange = (key) => {
    setActiveTab(key);
    refreshComponents();
  };
  
  // Fonction pour supprimer un tournoi
  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tournoi? Cette action est irréversible.')) {
      try {
        console.log('Suppression du tournoi avec ID:', id);
        await tournoiService.delete(id);
        toast.success('Tournoi supprimé avec succès');
        navigate('/tournois');
      } catch (err) {
        console.error('Erreur lors de la suppression du tournoi:', err);
        if (err.response) {
          console.log('Réponse du serveur:', err.response.data);
          console.log('Statut:', err.response.status);
        }
        toast.error('Erreur lors de la suppression du tournoi');
      }
    }
  };
  
  // Fonction pour éditer un tournoi
  const handleEdit = () => {
    navigate(`/tournois/edit/${id}`);
  };
  
  // Fonction pour revenir à la liste des tournois
  const handleBack = () => {
    navigate('/tournois');
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };
  
  // Détermine la couleur du badge en fonction du statut
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'en cours':
        return <StyledBadge bg="primary">En cours</StyledBadge>;
      case 'terminé':
      case 'termine':
        return <StyledBadge bg="success">Terminé</StyledBadge>;
      case 'à venir':
      case 'a venir':
        return <StyledBadge bg="info">À venir</StyledBadge>;
      case 'annulé':
      case 'annule':
        return <StyledBadge bg="danger">Annulé</StyledBadge>;
      default:
        return <StyledBadge bg="secondary">Non défini</StyledBadge>;
    }
  };
  
  // Rendu pendant le chargement
  if (loading) {
    return (
      <StyledCard>
        <Card.Body>
          <LoadingContainer>
            <Spinner animation="border" role="status" variant="primary" />
            <p className="mt-3 text-muted">Chargement des détails du tournoi...</p>
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
          <Button variant="primary" onClick={handleBack}>
            Retour à la liste
          </Button>
        </Card.Body>
      </StyledCard>
    );
  }
  
  // Rendu si le tournoi n'existe pas
  if (!tournoi) {
    return (
      <StyledCard>
        <Card.Body>
          <Alert variant="warning" className="mb-3">
            Le tournoi demandé n'existe pas ou a été supprimé.
          </Alert>
          <Button variant="primary" onClick={handleBack}>
            Retour à la liste
          </Button>
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
              <BackButton onClick={handleBack} className="me-3">
                &larr;
              </BackButton>
              <div>
                <div className="d-flex align-items-center">
                  <MainTitle>{tournoi.nom}</MainTitle>
                  <div className="ms-3">{getStatusBadge(tournoi.statut)}</div>
                  {tournoi.prix > 0 && <PriceBadge>{formatPrice(tournoi.prix)}</PriceBadge>}
                </div>
              </div>
            </div>
            <HeaderActions>
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
            </HeaderActions>
          </div>
        </Card.Header>
        
        <Card.Body>
          <InfoRow>
            <Col md={6}>
              <p>
                <DetailLabel className="me-2">Dates:</DetailLabel>
                <span>Du {formatDate(tournoi.dateDebut)} au {formatDate(tournoi.dateFin)}</span>
              </p>
              <p>
                <DetailLabel className="me-2">Statut:</DetailLabel>
                {getStatusBadge(tournoi.statut)}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <DetailLabel className="me-2">Nombre maximum d'équipes:</DetailLabel>
                <span>{tournoi.nbEquipesMax}</span>
              </p>
              <p>
                <DetailLabel className="me-2">Prix d'inscription:</DetailLabel>
                <span>{tournoi.prix > 0 ? formatPrice(tournoi.prix) : 'Gratuit'}</span>
              </p>
            </Col>
          </InfoRow>
          
          {tournoi.reglement && (
            <ReglementSection>
              <h5>Règlement</h5>
              <Card.Text style={{ whiteSpace: 'pre-line' }}>
                {tournoi.reglement}
              </Card.Text>
            </ReglementSection>
          )}
        </Card.Body>
      </StyledCard>
      
      <StyledTabs 
        activeKey={activeTab}
        onSelect={handleTabChange}
        className="mb-3"
      >
        <Tab eventKey="equipes" title="Équipes">
          {/* Utilisation de la clé pour forcer le rafraîchissement */}
          <EquipeListTournoi key={`equipes-${refreshKey}`} tournoiId={id} maxEquipes={tournoi.nbEquipesMax} />
        </Tab>
        <Tab eventKey="matches" title="Matches">
          {/* Utilisation de la clé pour forcer le rafraîchissement */}
          <MatchListTournoi key={`matches-${refreshKey}`} tournoiId={id} />
        </Tab>
        <Tab eventKey="classement" title="Classement">
          {/* Utilisation de la clé pour forcer le rafraîchissement */}
          <ClassementTournoi key={`classement-${refreshKey}`} tournoiId={id} />
        </Tab>
      </StyledTabs>
    </AdminLayout>
  );
};

export default TournoiDetails;