// src/components/Classement/ClassementTournoi.jsx
import React, { useState, useEffect } from 'react';
import { Table, Card, Alert, Spinner, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import classementService from '../../services/classementService';
import matchService from '../../services/matchService';
import './ClassementStyle.css'; // Nous allons créer ce fichier CSS

const ClassementTournoi = ({ tournoiId }) => {
  const [classements, setClassements] = useState([]);
  const [matches, setMatches] = useState([]);
  const [statistiques, setStatistiques] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer le classement du tournoi
  const fetchClassement = async () => {
    setLoading(true);
    try {
      const data = await classementService.getByTournoiId(tournoiId);
      // Trier par position si nécessaire
      const sortedData = [...data].sort((a, b) => a.position - b.position);
      setClassements(sortedData);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement du classement:', err);
      setError('Impossible de charger le classement de ce tournoi.');
      toast.error('Erreur lors du chargement du classement');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les matches du tournoi pour calculer les statistiques
  const fetchMatches = async () => {
    try {
      const data = await matchService.getByTournoiId(tournoiId);
      setMatches(data);
      
      // Une fois que nous avons les matches, calculer les statistiques
      calculateStatistiques(data);
    } catch (err) {
      console.error('Erreur lors du chargement des matches:', err);
    }
  };

  // Calculer les statistiques à partir des matches
  const calculateStatistiques = (matchesData) => {
    const stats = {};
    
    // Initialiser les statistiques pour chaque équipe
    matchesData.forEach(match => {
      if (!stats[match.iD_Equipe1]) {
        stats[match.iD_Equipe1] = { 
          matchesJoues: 0, 
          victoires: 0, 
          nuls: 0, 
          defaites: 0, 
          butsMarques: 0, 
          butsEncaisses: 0 
        };
      }
      
      if (!stats[match.iD_Equipe2]) {
        stats[match.iD_Equipe2] = { 
          matchesJoues: 0, 
          victoires: 0, 
          nuls: 0, 
          defaites: 0, 
          butsMarques: 0, 
          butsEncaisses: 0 
        };
      }
    });
    
    // Calculer les statistiques pour chaque match terminé
    matchesData.forEach(match => {
      // Ne considérer que les matches terminés
      if (match.statut === 'Terminé' && match.scoreEquipe1 !== null && match.scoreEquipe2 !== null) {
        // Équipe 1
        stats[match.iD_Equipe1].matchesJoues += 1;
        stats[match.iD_Equipe1].butsMarques += match.scoreEquipe1;
        stats[match.iD_Equipe1].butsEncaisses += match.scoreEquipe2;
        
        // Équipe 2
        stats[match.iD_Equipe2].matchesJoues += 1;
        stats[match.iD_Equipe2].butsMarques += match.scoreEquipe2;
        stats[match.iD_Equipe2].butsEncaisses += match.scoreEquipe1;
        
        // Déterminer le résultat
        if (match.scoreEquipe1 > match.scoreEquipe2) {
          // Victoire équipe 1
          stats[match.iD_Equipe1].victoires += 1;
          stats[match.iD_Equipe2].defaites += 1;
        } else if (match.scoreEquipe1 < match.scoreEquipe2) {
          // Victoire équipe 2
          stats[match.iD_Equipe2].victoires += 1;
          stats[match.iD_Equipe1].defaites += 1;
        } else {
          // Match nul
          stats[match.iD_Equipe1].nuls += 1;
          stats[match.iD_Equipe2].nuls += 1;
        }
      }
    });
    
    setStatistiques(stats);
  };

  // Recalculer le classement
  const handleRecalculateClassement = async () => {
    setLoading(true);
    try {
      await classementService.recalculatePositions(tournoiId);
      toast.success('Classement recalculé avec succès');
      await fetchClassement(); // Actualiser le classement
      await fetchMatches(); // Actualiser les statistiques
    } catch (err) {
      console.error('Erreur lors du recalcul du classement:', err);
      toast.error('Erreur lors du recalcul du classement');
      setLoading(false);
    }
  };

  // Charger le classement et les matches au chargement du composant
  useEffect(() => {
    fetchClassement();
    fetchMatches();
  }, [tournoiId]);

  if (loading) {
    return (
      <div className="text-center my-3">
        <Spinner animation="border" role="status" className="spinner-green" />
      </div>
    );
  }

  return (
    <Card className="classement-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="classement-title">Classement du tournoi</h5>
          <Button 
            variant="outline-primary" 
            onClick={handleRecalculateClassement}
            disabled={loading}
            className="recalculate-btn"
          >
            Recalculer le classement
          </Button>
        </div>

        {error && <Alert variant="danger" className="custom-alert">{error}</Alert>}

        {classements.length === 0 ? (
          <Alert variant="info" className="info-alert">
            Aucun classement disponible pour ce tournoi. Les équipes apparaîtront dans le classement une fois qu'elles auront participé à des matches.
          </Alert>
        ) : (
          <div className="table-responsive">
            <Table className="classement-table" striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Équipe</th>
                  <th>Points</th>
                  <th>J</th>
                  <th>V</th>
                  <th>N</th>
                  <th>D</th>
                  <th>BP</th>
                  <th>BC</th>
                  <th>Diff</th>
                </tr>
              </thead>
              <tbody>
                {classements.map((classement, index) => {
                  const equipeId = classement.iD_Equipe;
                  const stats = statistiques[equipeId] || { 
                    matchesJoues: 0, 
                    victoires: 0, 
                    nuls: 0, 
                    defaites: 0, 
                    butsMarques: 0, 
                    butsEncaisses: 0 
                  };
                  
                  return (
                    <tr 
                      key={classement.iD_Classement} 
                      className={index === 0 ? 'leader-row' : index < 3 ? 'top-row' : ''}
                    >
                      <td className="position-cell">
                        {index === 0 && <span className="trophy-icon">🏆</span>}
                        {classement.position}
                      </td>
                      <td className="team-name-cell">{classement.nomEquipe || 'Équipe inconnue'}</td>
                      <td className="points-cell">{classement.points}</td>
                      <td>{stats.matchesJoues}</td>
                      <td className="victories-cell">{stats.victoires}</td>
                      <td>{stats.nuls}</td>
                      <td className="defeats-cell">{stats.defaites}</td>
                      <td>{stats.butsMarques}</td>
                      <td>{stats.butsEncaisses}</td>
                      <td className={stats.butsMarques - stats.butsEncaisses > 0 ? 'positive-diff' : stats.butsMarques - stats.butsEncaisses < 0 ? 'negative-diff' : ''}>
                        {stats.butsMarques - stats.butsEncaisses}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
        
        <div className="legend-box mt-3">
          <div className="legend-title">Légende</div>
          <div className="legend-grid">
            <div className="legend-item"><span className="legend-abbr">Pos</span>: Position</div>
            <div className="legend-item"><span className="legend-abbr">J</span>: Matchs joués</div>
            <div className="legend-item"><span className="legend-abbr">V</span>: Victoires</div>
            <div className="legend-item"><span className="legend-abbr">N</span>: Nuls</div>
            <div className="legend-item"><span className="legend-abbr">D</span>: Défaites</div>
            <div className="legend-item"><span className="legend-abbr">BP</span>: Buts pour</div>
            <div className="legend-item"><span className="legend-abbr">BC</span>: Buts contre</div>
            <div className="legend-item"><span className="legend-abbr">Diff</span>: Différence de buts</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ClassementTournoi;