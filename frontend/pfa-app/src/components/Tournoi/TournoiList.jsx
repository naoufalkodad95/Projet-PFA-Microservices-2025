import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Spinner, Alert, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tournoiService from '../../services/tournoiService';
import { ActionButton, ActionButtons } from '../../components/ActionButtons';
import styled from 'styled-components';
import AdminLayout from "../../pages/Admin/AdminLayout";

// Composants stylisés
const StyledCard = styled(Card)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const TournamentTitle = styled.h2`
  font-weight: 600;
  color: #25A55F;
  margin-bottom: 0;
`;

const StatusBadge = styled(Badge)`
  font-size: 0.85rem;
  padding: 6px 10px;
  font-weight: 500;
`;

const PriceBadge = styled(Badge)`
  font-size: 0.8rem;
  padding: 4px 8px;
  font-weight: 500;
  background-color: #28a745;
  display: inline-block;
  margin-top: 5px;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const AddButton = styled.button`
  background-color: #25A55F;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #1c8048;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ViewControls = styled.div`
  display: flex;
  gap: 8px;
`;

const ViewButton = styled.button`
  background-color: ${props => props.active ? '#25A55F' : 'white'};
  color: ${props => props.active ? 'white' : '#25A55F'};
  border: 1px solid #25A55F;
  border-radius: 6px;
  padding: 6px 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#1c8048' : '#f0f9f4'};
  }
`;

const TournoiList = () => {
  const [tournois, setTournois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' ou 'card'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournois();
  }, []);

  // Fonction pour récupérer tous les tournois
  const fetchTournois = async () => {
    setLoading(true);
    try {
      const data = await tournoiService.getAll();
      setTournois(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des tournois:', err);
      setError('Impossible de charger les tournois. Veuillez réessayer plus tard.');
      toast.error('Erreur lors du chargement des tournois');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer un tournoi
  const handleDelete = async (tournoi) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le tournoi "${tournoi.nom}" ?`)) {
      try {
        await tournoiService.delete(tournoi.iD_Tournoi);
        toast.success('Tournoi supprimé avec succès');
        fetchTournois(); // Actualiser la liste des tournois après suppression
      } catch (error) {
        console.error('Erreur lors de la suppression du tournoi:', error);
        toast.error('Erreur lors de la suppression du tournoi');
      }
    }
  };

  // Fonctions de navigation
  const handleView = (tournoi) => navigate(`/tournois/${tournoi.iD_Tournoi}`);
  const handleEdit = (tournoi) => navigate(`/tournois/edit/${tournoi.iD_Tournoi}`);
  const handleCreate = () => navigate('/tournois/create');

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  // Obtenir le statut avec un badge coloré
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'en cours':
        return <StatusBadge bg="success">En cours</StatusBadge>;
      case 'terminé':
      case 'termine':
        return <StatusBadge bg="secondary">Terminé</StatusBadge>;
      case 'à venir':
      case 'a venir':
        return <StatusBadge bg="primary">À venir</StatusBadge>;
      case 'annulé':
      case 'annule':
        return <StatusBadge bg="danger">Annulé</StatusBadge>;
      default:
        return <StatusBadge bg="light" text="dark">Non défini</StatusBadge>;
    }
  };

  // Filtrer les tournois
  const filteredTournois = tournois.filter(tournoi => {
    const matchesSearch = tournoi.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || (tournoi.statut?.toLowerCase() === filterStatus.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  // Liste des statuts uniques pour le filtre
  const uniqueStatuses = Array.from(new Set(tournois.map(t => t.statut).filter(Boolean)));

  if (loading) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center p-5">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
          <p className="mt-3">Chargement des tournois...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
        <AdminLayout>
    
    <Card className="shadow-sm">
      <Card.Header className="bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <TournamentTitle>Gestion des tournois</TournamentTitle>
          <AddButton onClick={handleCreate}>
            <span>+</span> Nouveau tournoi
          </AddButton>
        </div>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="mb-4">
          <Col md={5}>
            <Form.Control
              type="search"
              placeholder="Rechercher un tournoi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4} className="text-end">
            <ViewControls>
              <ViewButton 
                active={viewMode === 'table'} 
                onClick={() => setViewMode('table')}
              >
                Tableau
              </ViewButton>
              <ViewButton 
                active={viewMode === 'card'} 
                onClick={() => setViewMode('card')}
              >
                Cartes
              </ViewButton>
            </ViewControls>
          </Col>
        </Row>

        {filteredTournois.length === 0 ? (
          <Alert variant="info">
            Aucun tournoi trouvé. {searchTerm || filterStatus ? 'Essayez de modifier vos filtres.' : 'Cliquez sur "Nouveau tournoi" pour en créer un.'}
          </Alert>
        ) : viewMode === 'table' ? (
          // Affichage en tableau
          <Table striped hover responsive className="align-middle">
            <thead className="bg-light">
              <tr>
                <th>Nom</th>
                <th>Dates</th>
                <th>Statut</th>
                <th>Prix</th>
                <th>Équipes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTournois.map((tournoi) => (
                <tr key={tournoi.iD_Tournoi}>
                  <td>
                    <span className="fw-medium">{tournoi.nom}</span>
                  </td>
                  <td>
                    <div>{formatDate(tournoi.dateDebut)}</div>
                    <small className="text-muted">au {formatDate(tournoi.dateFin)}</small>
                  </td>
                  <td>{getStatusBadge(tournoi.statut)}</td>
                  <td>{tournoi.prix > 0 ? formatPrice(tournoi.prix) : 'Gratuit'}</td>
                  <td>{tournoi.nbEquipesMax} max</td>
                  <td>
                    <ActionButtons 
                      onView={() => handleView(tournoi)}
                      onEdit={() => handleEdit(tournoi)}
                      onDelete={() => handleDelete(tournoi)}
                      item={tournoi}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          // Affichage en cartes
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredTournois.map((tournoi) => (
              <Col key={tournoi.iD_Tournoi}>
                <StyledCard>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title>{tournoi.nom}</Card.Title>
                      {getStatusBadge(tournoi.statut)}
                    </div>
                    <Card.Text as="div">
                      <div className="mb-2">
                        Du {formatDate(tournoi.dateDebut)} au {formatDate(tournoi.dateFin)}
                      </div>
                      <div className="mb-2">
                        {tournoi.nbEquipesMax} équipes maximum
                      </div>
                      <div>
                        {tournoi.prix > 0 ? (
                          <PriceBadge>{formatPrice(tournoi.prix)}</PriceBadge>
                        ) : (
                          <PriceBadge bg="secondary">Gratuit</PriceBadge>
                        )}
                      </div>
                    </Card.Text>
                    <CardActions>
                      <ActionButton
                        title="Voir les détails"
                        color="#4caf50"
                        onClick={() => handleView(tournoi)}
                      >
                        👁️
                      </ActionButton>
                      <div>
                        <ActionButton
                          title="Modifier"
                          color="#2196f3"
                          onClick={() => handleEdit(tournoi)}
                          style={{ marginRight: '8px' }}
                        >
                          ✎
                        </ActionButton>
                        <ActionButton
                          title="Supprimer"
                          color="#f44336"
                          onClick={() => handleDelete(tournoi)}
                        >
                          ✕
                        </ActionButton>
                      </div>
                    </CardActions>
                  </Card.Body>
                </StyledCard>
              </Col>
            ))}
          </Row>
        )}
      </Card.Body>
      <Card.Footer className="bg-white text-muted">
        <small>Total: {filteredTournois.length} tournoi{filteredTournois.length > 1 ? 's' : ''}</small>
      </Card.Footer>
    </Card>
    </AdminLayout>

  );
};

export default TournoiList;