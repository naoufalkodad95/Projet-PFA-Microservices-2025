// src/components/Equipe/EquipeListTournoi.jsx - Avec correction du hook useEffect
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Card, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import equipeService from '../../services/equipeService';

const EquipeListTournoi = ({ tournoiId, maxEquipes }) => {
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableEquipes, setAvailableEquipes] = useState([]);
  const [selectedEquipeId, setSelectedEquipeId] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  // Utiliser useCallback pour fetchEquipesTournoi
  const fetchEquipesTournoi = useCallback(async () => {
    setLoading(true);
    try {
      const data = await equipeService.getEquipesByTournoiId(tournoiId);
      setEquipes(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des équipes du tournoi:', err);
      setError('Impossible de charger les équipes de ce tournoi.');
      toast.error('Erreur lors du chargement des équipes');
    } finally {
      setLoading(false);
    }
  }, [tournoiId]); // Ajouter tournoiId comme dépendance

  // Récupérer toutes les équipes disponibles (non déjà inscrites au tournoi)
  const fetchAvailableEquipes = async () => {
    try {
      // Récupérer toutes les équipes
      const allEquipes = await equipeService.getAll();
      
      // Filtrer les équipes qui ne sont pas déjà dans le tournoi
      const equipeIds = equipes.map(e => e.iD_Equipe);
      const available = allEquipes.filter(e => !equipeIds.includes(e.iD_Equipe));
      
      setAvailableEquipes(available);
    } catch (err) {
      console.error('Erreur lors du chargement des équipes disponibles:', err);
      toast.error('Erreur lors du chargement des équipes disponibles');
    }
  };

  // Charger les équipes au chargement du composant
  useEffect(() => {
    fetchEquipesTournoi();
  }, [fetchEquipesTournoi]); // Mettre à jour les dépendances

  // Ouvrir la modal pour ajouter une équipe
  const handleShowAddModal = async () => {
    await fetchAvailableEquipes();
    setShowAddModal(true);
  };

  // Fermer la modal
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setSelectedEquipeId("");
  };

  // Gérer le changement de sélection d'équipe
  const handleEquipeChange = (e) => {
    setSelectedEquipeId(e.target.value);
  };

  // Ajouter une équipe au tournoi
  const handleAddEquipe = async () => {
    if (!selectedEquipeId) {
      toast.warning('Veuillez sélectionner une équipe');
      return;
    }

    setLoadingAction(true);
    try {
      await equipeService.addEquipeToTournoi(selectedEquipeId, tournoiId);
      toast.success('Équipe ajoutée au tournoi avec succès');
      handleCloseAddModal();
      await fetchEquipesTournoi(); // Actualiser la liste
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'équipe au tournoi:', err);
      toast.error('Erreur lors de l\'ajout de l\'équipe au tournoi');
    } finally {
      setLoadingAction(false);
    }
  };

  // Retirer une équipe du tournoi
  const handleRemoveEquipe = async (equipeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir retirer cette équipe du tournoi?')) {
      setLoadingAction(true);
      try {
        await equipeService.removeEquipeFromTournoi(equipeId, tournoiId);
        toast.success('Équipe retirée du tournoi avec succès');
        await fetchEquipesTournoi(); // Actualiser la liste
      } catch (err) {
        console.error('Erreur lors du retrait de l\'équipe du tournoi:', err);
        toast.error('Erreur lors du retrait de l\'équipe du tournoi');
      } finally {
        setLoadingAction(false);
      }
    }
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="text-center my-3">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Équipes inscrites ({equipes.length}/{maxEquipes || '∞'})</h5>
          <Button 
            variant="primary" 
            onClick={handleShowAddModal}
            disabled={maxEquipes && equipes.length >= maxEquipes}
          >
            Ajouter une équipe
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {equipes.length === 0 ? (
          <Alert variant="info">
            Aucune équipe inscrite à ce tournoi pour le moment.
          </Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipes.map((equipe) => (
                <tr key={equipe.iD_Equipe}>
                  <td>{equipe.nom}</td>
                  <td>{formatDate(equipe.dateCreation)}</td>
                  <td>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleRemoveEquipe(equipe.iD_Equipe)}
                      disabled={loadingAction}
                    >
                      Retirer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Modal pour ajouter une équipe */}
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter une équipe au tournoi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {availableEquipes.length === 0 ? (
              <Alert variant="info">
                Toutes les équipes sont déjà inscrites à ce tournoi ou aucune équipe n'est disponible.
              </Alert>
            ) : (
              <Form>
                <Form.Group controlId="equipe">
                  <Form.Label>Sélectionner une équipe</Form.Label>
                  <Form.Select
                    value={selectedEquipeId}
                    onChange={handleEquipeChange}
                  >
                    <option value="">Sélectionner...</option>
                    {availableEquipes.map((equipe) => (
                      <option key={equipe.iD_Equipe} value={equipe.iD_Equipe}>
                        {equipe.nom}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Annuler
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAddEquipe}
              disabled={!selectedEquipeId || loadingAction || availableEquipes.length === 0}
            >
              {loadingAction ? 'Chargement...' : 'Ajouter'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default EquipeListTournoi;