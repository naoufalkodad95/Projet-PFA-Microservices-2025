import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import tournoiService from '../../services/tournoiService';
import AdminLayout from "../../pages/Admin/AdminLayout";


// 💡 Fonction pour la date d'aujourd'hui
const getTodayDate = () => new Date().toISOString().split('T')[0];

// 🎨 Composants stylisés
const FormTitle = styled.h2`
  color: #25A55F;
  font-weight: 600;
  letter-spacing: -0.5px;
`;

const StyledCard = styled(Card)`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  border: none;
`;

const FormSection = styled.div`
  margin-bottom: 2.5rem;
  position: relative;

  &:last-child {
    margin-bottom: 1.5rem;
  }
`;

const SectionTitle = styled.h5`
  font-weight: 600;
  color: #444;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eaeaea;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 80px;
    height: 3px;
    background-color: #25A55F;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
`;

const StyledFormControl = styled(Form.Control)`
  padding: 0.6rem;
  border-radius: 6px;
  transition: all 0.2s;

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(37, 165, 95, 0.25);
    border-color: #25A55F;
  }
`;

const StyledFormSelect = styled(Form.Select)`
  padding: 0.6rem;
  border-radius: 6px;
  transition: all 0.2s;

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(37, 165, 95, 0.25);
    border-color: #25A55F;
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #666;
  padding: 0;

  &:hover {
    color: #25A55F;
    background: transparent;
  }

  &:active, &:focus {
    box-shadow: none;
    background: transparent;
  }
`;

const FormLabel = styled(Form.Label)`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const TournoiForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [tournoi, setTournoi] = useState({
    nom: '',
    dateDebut: '',
    dateFin: '',
    nbEquipesMax: 8,
    statut: 'À venir',
    reglement: '',
    prix: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      tournoiService.getById(id)
        .then(data => {
          const formattedData = {
            ...data,
            dateDebut: formatDateForInput(data.dateDebut),
            dateFin: formatDateForInput(data.dateFin),
            prix: data.prix || 0
          };
          setTournoi(formattedData);
          setLoading(false);
        })
        .catch(err => {
          console.error('Erreur lors du chargement du tournoi:', err);
          setError("Impossible de charger les données du tournoi.");
          setLoading(false);
          toast.error('Erreur lors du chargement du tournoi');
        });
    }
  }, [id, isEditMode]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTournoi(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setError(null);

    const tournoiData = {
      ...tournoi,
      nbEquipesMax: parseInt(tournoi.nbEquipesMax, 10),
      prix: parseFloat(tournoi.prix)
    };

    const savePromise = isEditMode
      ? tournoiService.update(id, tournoiData)
      : tournoiService.create(tournoiData);

    savePromise
      .then(() => {
        setSuccess(true);
        toast.success(`Tournoi ${isEditMode ? 'modifié' : 'créé'} avec succès`);
        setTimeout(() => {
          navigate(isEditMode ? `/tournois/${id}` : '/tournois');
        }, 1500);
      })
      .catch(err => {
        console.error('Erreur lors de la sauvegarde du tournoi:', err);
        setError(`Erreur lors de la ${isEditMode ? 'modification' : 'création'} du tournoi`);
        toast.error(error);
        setLoading(false);
      });
  };

  if (loading && isEditMode && !tournoi.nom) {
    return (
      <StyledCard>
        <Card.Body className="text-center p-5">
          <Spinner animation="border" variant="primary" role="status" />
          <p className="mt-3 text-muted">Chargement des données du tournoi...</p>
        </Card.Body>
      </StyledCard>
    );
  }

  return (
            <AdminLayout>
    
    <StyledCard>
      <Card.Header className="bg-white py-3">
        <div className="d-flex align-items-center">
          <BackButton onClick={() => navigate('/tournois')}>
            &larr;
          </BackButton>
          <FormTitle>{isEditMode ? 'Modifier le tournoi' : 'Créer un nouveau tournoi'}</FormTitle>
        </div>
      </Card.Header>
      <Card.Body className="px-4 py-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">
            Tournoi {isEditMode ? 'modifié' : 'créé'} avec succès! Redirection en cours...
          </Alert>
        )}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Informations générales</SectionTitle>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <FormLabel>Nom du tournoi <span className="text-danger">*</span></FormLabel>
                  <StyledFormControl
                    type="text"
                    name="nom"
                    value={tournoi.nom}
                    onChange={handleChange}
                    placeholder="Entrez le nom du tournoi"
                    required
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez entrer un nom pour le tournoi.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <FormLabel>Date de début <span className="text-danger">*</span></FormLabel>
                  <StyledFormControl
                    type="date"
                    name="dateDebut"
                    value={tournoi.dateDebut}
                    onChange={handleChange}
                    required
                    min={getTodayDate()}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez sélectionner une date de début.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <FormLabel>Date de fin <span className="text-danger">*</span></FormLabel>
                  <StyledFormControl
                    type="date"
                    name="dateFin"
                    value={tournoi.dateFin}
                    onChange={handleChange}
                    required
                    min={tournoi.dateDebut || getTodayDate()}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez sélectionner une date de fin.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </FormSection>

          <FormSection>
            <SectionTitle>Paramètres du tournoi</SectionTitle>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <FormLabel>Nombre maximum d'équipes <span className="text-danger">*</span></FormLabel>
                  <StyledFormControl
                    type="number"
                    name="nbEquipesMax"
                    value={tournoi.nbEquipesMax}
                    onChange={handleChange}
                    min="2"
                    max="32"
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <FormLabel>Statut <span className="text-danger">*</span></FormLabel>
                  <StyledFormSelect
                    name="statut"
                    value={tournoi.statut}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="À venir">À venir</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                    <option value="Annulé">Annulé</option>
                  </StyledFormSelect>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <FormLabel>Prix (€)</FormLabel>
                  <StyledFormControl
                    type="number"
                    name="prix"
                    value={tournoi.prix}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>
          </FormSection>

          <FormSection>
            <SectionTitle>Règlement</SectionTitle>
            <Form.Group className="mb-3">
              <StyledFormControl
                as="textarea"
                rows={5}
                name="reglement"
                value={tournoi.reglement}
                onChange={handleChange}
                placeholder="Entrez le règlement du tournoi (optionnel)"
                disabled={loading}
              />
            </Form.Group>
          </FormSection>

          <FormActions>
            <Button variant="outline-secondary" onClick={() => navigate('/tournois')} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={loading || success}>
              {loading ? 'Traitement...' : isEditMode ? 'Modifier' : 'Créer'}
            </Button>
          </FormActions>
        </Form>
      </Card.Body>
    </StyledCard>
            </AdminLayout>
    
  );
};

export default TournoiForm;
