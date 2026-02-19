import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Spinner, Alert, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import equipeService from '../../services/equipeService';
import { ActionButton, ActionButtons } from '../../components/ActionButtons';
import styled from 'styled-components';
import AdminLayout from "../../pages/Admin/AdminLayout";

// Composants stylisés
const StyledCard = styled(Card)`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  border: none;
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

const TeamTitle = styled.h2`
  font-weight: 600;
  color: #25A55F;
  margin-bottom: 0;
`;

const StatusBadge = styled(Badge)`
  font-size: 0.85rem;
  padding: 6px 10px;
  font-weight: 500;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #666;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
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

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const EquipeList = () => {
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' ou 'card'
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadEquipes();
  }, []);

  const loadEquipes = () => {
    setLoading(true);
    equipeService.getAll()
      .then(data => {
        setEquipes(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Erreur lors du chargement des équipes");
        setLoading(false);
        console.error(err);
        toast.error('Erreur lors du chargement des équipes');
      });
  };

  const handleDelete = (equipe) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'équipe "${equipe.nom}" ?`)) {
      setLoading(true);
      equipeService.delete(equipe.iD_Equipe)
        .then(() => {
          toast.success('Équipe supprimée avec succès');
          loadEquipes();
        })
        .catch(err => {
          console.error('Erreur lors de la suppression:', err);
          
          // Gérer l'erreur spécifique si l'équipe participe à des tournois
          if (err.message && err.message.includes('participe à un ou plusieurs tournois')) {
            toast.error('Cette équipe participe à un ou plusieurs tournois et ne peut pas être supprimée');
          } else {
            toast.error("Erreur lors de la suppression de l'équipe");
          }
          
          setLoading(false);
        });
    }
  };

  // Fonctions de navigation
  const handleView = (equipe) => navigate(`/equipes/${equipe.iD_Equipe}`);
  const handleEdit = (equipe) => navigate(`/equipes/edit/${equipe.iD_Equipe}`);
  const handleCreate = () => navigate('/equipes/create');

  // Formatage de la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Filtrer les équipes
  const filteredEquipes = equipes.filter(equipe => 
    equipe.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && equipes.length === 0) {
    return (
      <Card className="shadow-sm">
        <Card.Body>
          <LoadingContainer>
            <Spinner animation="border" role="status" variant="primary" />
            <p className="mt-3 text-muted">Chargement des équipes...</p>
          </LoadingContainer>
        </Card.Body>
      </Card>
    );
  }

  return (
    <AdminLayout>
    <Card className="shadow-sm">
      <Card.Header className="bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <TeamTitle>Gestion des équipes</TeamTitle>
          <AddButton onClick={handleCreate}>
            <span>+</span> Nouvelle équipe
          </AddButton>
        </div>
      </Card.Header>
      
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Row className="mb-4">
          <Col md={8}>
            <Form.Control
              type="search"
              placeholder="Rechercher une équipe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
        
        {filteredEquipes.length === 0 ? (
          <Alert variant="info">
            Aucune équipe trouvée. {searchTerm ? 'Essayez de modifier votre recherche.' : 'Cliquez sur "Nouvelle équipe" pour en créer une.'}
          </Alert>
        ) : viewMode === 'table' ? (
          // Affichage en tableau
          <Table striped hover responsive>
            <thead className="bg-light">
              <tr>
                <th>Nom</th>
                <th>Date de création</th>
                <th>Nombre de joueurs</th>
                <th>Capitaine</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipes.map((equipe) => (
                <tr key={equipe.iD_Equipe}>
                  <td className="fw-medium">{equipe.nom}</td>
                  <td>{formatDate(equipe.dateCreation)}</td>
                  <td>{equipe.nombreJoueurs || '—'}</td>
                  <td>{equipe.capitaine || '—'}</td>
                  <td>
                    <ActionButtons
                      onView={() => handleView(equipe)}
                      onEdit={() => handleEdit(equipe)}
                      onDelete={() => handleDelete(equipe)}
                      item={equipe}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          // Affichage en cartes
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredEquipes.map((equipe) => (
              <Col key={equipe.iD_Equipe}>
                <StyledCard>
                  <Card.Body>
                    <Card.Title className="mb-3">{equipe.nom}</Card.Title>
                    <Card.Text as="div">
                      <div className="mb-2">
                        <DetailLabel className="me-2">Date de création:</DetailLabel>
                        {formatDate(equipe.dateCreation)}
                      </div>
                      <div className="mb-2">
                        <DetailLabel className="me-2">Nombre de joueurs:</DetailLabel>
                        {equipe.nombreJoueurs || '—'}
                      </div>
                      <div className="mb-2">
                        <DetailLabel className="me-2">Capitaine:</DetailLabel>
                        {equipe.capitaine || '—'}
                      </div>
                    </Card.Text>
                    <CardActions>
                      <ActionButton
                        title="Voir les détails"
                        color="#4caf50"
                        onClick={() => handleView(equipe)}
                      >
                        👁️
                      </ActionButton>
                      <div>
                        <ActionButton
                          title="Modifier"
                          color="#2196f3"
                          onClick={() => handleEdit(equipe)}
                          style={{ marginRight: '8px' }}
                        >
                          ✎
                        </ActionButton>
                        <ActionButton
                          title="Supprimer"
                          color="#f44336"
                          onClick={() => handleDelete(equipe)}
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
        <small>Total: {filteredEquipes.length} équipe{filteredEquipes.length > 1 ? 's' : ''}</small>
      </Card.Footer>
    </Card>
    
    </AdminLayout>
  );
};

export default EquipeList;