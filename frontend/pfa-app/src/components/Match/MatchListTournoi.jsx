import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Alert, Spinner, Modal, Form, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import matchService from '../../services/tournoiMatchService';
import classementService from '../../services/classementService';
import equipeService from '../../services/equipeService';

const MatchListTournoi = ({ tournoiId, refreshTrigger }) => {
  const [matches, setMatches] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [matchToUpdate, setMatchToUpdate] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const [newMatch, setNewMatch] = useState({
    date: new Date().toISOString().substr(0, 16),
    iD_Equipe1: "",
    iD_Equipe2: "",
    scoreEquipe1: null,
    scoreEquipe2: null,
    statut: "Programmé",
    iD_Tournoi: tournoiId
  });

  const [scores, setScores] = useState({
    scoreEquipe1: "",
    scoreEquipe2: ""
  });

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await matchService.getByTournoiId(tournoiId);
      setMatches(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des matches du tournoi:', err);
      setError('Impossible de charger les matches de ce tournoi.');
      toast.error('Erreur lors du chargement des matches');
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipes = async () => {
    try {
      const data = await equipeService.getEquipesByTournoiId(tournoiId);
      setEquipes(data);
      if (data.length < 2) {
        console.warn('Moins de deux équipes disponibles');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des équipes du tournoi:', err);
      toast.error('Erreur lors du chargement des équipes');
    }
  };

  // ⬇️ Rafraîchit quand tournoiId ou refreshTrigger change
  useEffect(() => {
    if (tournoiId) {
      fetchMatches();
      fetchEquipes();
    }
  }, [tournoiId, refreshTrigger]);

  const handleShowAddModal = () => {
    if (equipes.length < 2) {
      toast.warning('Il faut au moins deux équipes pour programmer un match.');
      return;
    }

    setNewMatch({
      ...newMatch,
      date: new Date().toISOString().substr(0, 16),
      iD_Equipe1: "",
      iD_Equipe2: "",
      iD_Tournoi: tournoiId
    });
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleShowScoreModal = (match) => {
    setMatchToUpdate(match);
    setScores({
      scoreEquipe1: match.scoreEquipe1 !== null ? match.scoreEquipe1.toString() : "",
      scoreEquipe2: match.scoreEquipe2 !== null ? match.scoreEquipe2.toString() : ""
    });
    setShowScoreModal(true);
  };

  const handleCloseScoreModal = () => {
    setShowScoreModal(false);
    setMatchToUpdate(null);
  };

  const handleMatchChange = (e) => {
    const { name, value } = e.target;
    setNewMatch({
      ...newMatch,
      [name]: value
    });
  };

  const handleScoresChange = (e) => {
    const { name, value } = e.target;
    setScores({
      ...scores,
      [name]: value
    });
  };

  const handleAddMatch = async () => {
    if (!newMatch.date || !newMatch.iD_Equipe1 || !newMatch.iD_Equipe2) {
      toast.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (newMatch.iD_Equipe1 === newMatch.iD_Equipe2) {
      toast.warning('Les deux équipes doivent être différentes');
      return;
    }

    setLoadingAction(true);
    try {
      const matchData = {
        ...newMatch,
        iD_Equipe1: parseInt(newMatch.iD_Equipe1),
        iD_Equipe2: parseInt(newMatch.iD_Equipe2),
        iD_Tournoi: parseInt(tournoiId)
      };

      await matchService.create(matchData);
      toast.success('Match ajouté avec succès');
      handleCloseAddModal();
      await fetchMatches();
    } catch (err) {
      console.error('Erreur lors de l\'ajout du match:', err);
      toast.error('Erreur lors de l\'ajout du match');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdateScores = async () => {
    if (scores.scoreEquipe1 === "" || scores.scoreEquipe2 === "") {
      toast.warning('Veuillez saisir les deux scores');
      return;
    }

    setLoadingAction(true);
    try {
      const updatedMatch = {
        ...matchToUpdate,
        scoreEquipe1: parseInt(scores.scoreEquipe1),
        scoreEquipe2: parseInt(scores.scoreEquipe2),
        statut: "Terminé"
      };

      await matchService.update(matchToUpdate.iD_Match, updatedMatch);

      try {
        await classementService.updateClassementAfterMatch(tournoiId, updatedMatch);
      } catch (classementErr) {
        console.error('Erreur mise à jour classement:', classementErr);
      }

      toast.success('Scores mis à jour');
      handleCloseScoreModal();
      await fetchMatches();
    } catch (err) {
      console.error('Erreur mise à jour des scores:', err);
      toast.error('Erreur lors de la mise à jour des scores');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce match?')) {
      setLoadingAction(true);
      try {
        await matchService.delete(matchId);
        toast.success('Match supprimé avec succès');
        await fetchMatches();
      } catch (err) {
        console.error('Erreur suppression match:', err);
        toast.error('Erreur lors de la suppression du match');
      } finally {
        setLoadingAction(false);
      }
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'terminé': return 'success';
      case 'en cours': return 'primary';
      case 'programmé': return 'info';
      case 'annulé': return 'danger';
      default: return 'secondary';
    }
  };

  const getEquipeName = (equipeId) => {
    const equipe = equipes.find(e => e.iD_Equipe === equipeId);
    return equipe ? equipe.nom : 'Équipe inconnue';
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
          <h5>Matches du tournoi ({matches.length})</h5>
          <Button variant="primary" onClick={handleShowAddModal} disabled={equipes.length < 2}>
            Programmer un match
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {equipes.length < 2 && (
          <Alert variant="warning">
            Il faut au moins deux équipes dans le tournoi pour programmer des matches. 
            Actuellement, il y a {equipes.length} équipe(s) dans ce tournoi.
          </Alert>
        )}

        {matches.length === 0 ? (
          <Alert variant="info">Aucun match programmé pour ce tournoi.</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Équipe 1</th>
                <th>Score</th>
                <th>Équipe 2</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.iD_Match}>
                  <td>{formatDateTime(match.date)}</td>
                  <td>{match.nomEquipe1 || getEquipeName(match.iD_Equipe1)}</td>
                  <td className="text-center">
                    {match.scoreEquipe1 !== null && match.scoreEquipe2 !== null
                      ? `${match.scoreEquipe1} - ${match.scoreEquipe2}`
                      : '-'}
                  </td>
                  <td>{match.nomEquipe2 || getEquipeName(match.iD_Equipe2)}</td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(match.statut)}>
                      {match.statut || 'N/A'}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant="primary" 
                      size="sm"
                      className="me-1"
                      onClick={() => handleShowScoreModal(match)}
                      disabled={loadingAction || match.statut === 'Terminé'}
                    >
                      Saisir scores
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteMatch(match.iD_Match)}
                      disabled={loadingAction}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Modal Ajouter Match */}
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Programmer un match</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Date et heure</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="date"
                  value={newMatch.date}
                  onChange={handleMatchChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Équipe 1</Form.Label>
                <Form.Select
                  name="iD_Equipe1"
                  value={newMatch.iD_Equipe1}
                  onChange={handleMatchChange}
                  required
                >
                  <option value="">Sélectionner une équipe...</option>
                  {equipes.map(e => (
                    <option
                      key={e.iD_Equipe}
                      value={e.iD_Equipe}
                      disabled={e.iD_Equipe === parseInt(newMatch.iD_Equipe2)}
                    >
                      {e.nom}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Équipe 2</Form.Label>
                <Form.Select
                  name="iD_Equipe2"
                  value={newMatch.iD_Equipe2}
                  onChange={handleMatchChange}
                  required
                >
                  <option value="">Sélectionner une équipe...</option>
                  {equipes.map(e => (
                    <option
                      key={e.iD_Equipe}
                      value={e.iD_Equipe}
                      disabled={e.iD_Equipe === parseInt(newMatch.iD_Equipe1)}
                    >
                      {e.nom}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>Annuler</Button>
            <Button variant="primary" onClick={handleAddMatch} disabled={loadingAction}>
              {loadingAction ? 'Chargement...' : 'Programmer'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Saisir Scores */}
        <Modal show={showScoreModal} onHide={handleCloseScoreModal}>
          <Modal.Header closeButton>
            <Modal.Title>Saisir les scores</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {matchToUpdate && (
              <Form>
                <div className="text-center mb-3">
                  <h5>{getEquipeName(matchToUpdate.iD_Equipe1)} vs {getEquipeName(matchToUpdate.iD_Equipe2)}</h5>
                  <p className="text-muted">{formatDateTime(matchToUpdate.date)}</p>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <Form.Group className="flex-fill me-2">
                    <Form.Label>{getEquipeName(matchToUpdate.iD_Equipe1)}</Form.Label>
                    <Form.Control
                      type="number"
                      name="scoreEquipe1"
                      value={scores.scoreEquipe1}
                      onChange={handleScoresChange}
                      min="0"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="flex-fill ms-2">
                    <Form.Label>{getEquipeName(matchToUpdate.iD_Equipe2)}</Form.Label>
                    <Form.Control
                      type="number"
                      name="scoreEquipe2"
                      value={scores.scoreEquipe2}
                      onChange={handleScoresChange}
                      min="0"
                      required
                    />
                  </Form.Group>
                </div>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseScoreModal}>Annuler</Button>
            <Button variant="primary" onClick={handleUpdateScores} disabled={loadingAction}>
              {loadingAction ? 'Chargement...' : 'Enregistrer les scores'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default MatchListTournoi;
