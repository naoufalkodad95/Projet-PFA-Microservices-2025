import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import equipeService from '../../services/equipeService';
import AdminLayout from "../../pages/Admin/AdminLayout";

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

const BackButton = styled(Button)`
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

const EquipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [equipe, setEquipe] = useState({
    nom: '',
    dateCreation: new Date().toISOString().split('T')[0],
    nombreJoueurs: 11,
    capitaine: '',
    logoBase64: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validated, setValidated] = useState(false);

  // Détermine la date minimale autorisée pour la date de création (aujourd'hui)
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      equipeService.getById(id)
        .then(data => {
          const formattedData = {
            ...data,
            dateCreation: formatDateForInput(data.dateCreation)
          };
          setEquipe(formattedData);
          setLoading(false);
        })
        .catch(err => {
          console.error('Erreur lors du chargement de l\'équipe:', err);
          setError("Impossible de charger les données de l'équipe.");
          setLoading(false);
          toast.error('Erreur lors du chargement de l\'équipe');
        });
    }
  }, [id, isEditMode]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipe(prev => ({
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

    const equipeData = {
      ...equipe,
      nombreJoueurs: parseInt(equipe.nombreJoueurs, 10)
    };

    const savePromise = isEditMode
      ? equipeService.update(id, equipeData)
      : equipeService.create(equipeData);

    savePromise
      .then(() => {
        setSuccess(true);
        toast.success(`Équipe ${isEditMode ? 'modifiée' : 'créée'} avec succès`);
        setTimeout(() => {
          navigate(isEditMode ? `/equipes/${id}` : '/equipes');
        }, 1500);
      })
      .catch(err => {
        console.error('Erreur lors de la sauvegarde:', err);
        setError(`Erreur lors de la ${isEditMode ? 'modification' : 'création'} de l'équipe`);
        toast.error(error);
        setLoading(false);
      });
  };

  if (loading && isEditMode && !equipe.nom) {
    return (
      <StyledCard>
        <Card.Body className="text-center p-5">
          <Spinner animation="border" variant="primary" role="status" />
          <p className="mt-3 text-muted">Chargement des données de l'équipe...</p>
        </Card.Body>
      </StyledCard>
    );
  }

  return (
      <AdminLayout>
    <StyledCard>
      <Card.Header className="bg-white py-3">
        <div className="d-flex align-items-center">
          <BackButton variant="link" className="px-0 me-3" onClick={() => navigate('/equipes')}>
            &larr;
          </BackButton>
          <FormTitle>{isEditMode ? 'Modifier l\'équipe' : 'Créer une nouvelle équipe'}</FormTitle>
        </div>
      </Card.Header>
      <Card.Body className="px-4 py-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">
            Équipe {isEditMode ? 'modifiée' : 'créée'} avec succès! Redirection en cours...
          </Alert>
        )}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Informations générales</SectionTitle>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <FormLabel>Nom de l'équipe <span className="text-danger">*</span></FormLabel>
                  <StyledFormControl
                    type="text"
                    name="nom"
                    value={equipe.nom}
                    onChange={handleChange}
                    placeholder="Entrez le nom de l'équipe"
                    required
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez entrer un nom pour l'équipe.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <FormLabel>Date de création</FormLabel>
                  <StyledFormControl
                    type="date"
                    name="dateCreation"
                    value={equipe.dateCreation}
                    onChange={handleChange}
                    min={today}  // Limite la date à aujourd'hui
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <FormLabel>Nombre de joueurs <span className="text-danger">*</span></FormLabel>
                  <StyledFormControl
                    type="number"
                    name="nombreJoueurs"
                    value={equipe.nombreJoueurs}
                    onChange={handleChange}
                    min="1"
                    max="30"
                    required
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez entrer un nombre valide entre 1 et 30.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </FormSection>

          <FormSection>
            <SectionTitle>Informations du capitaine</SectionTitle>
            <Form.Group className="mb-3">
              <FormLabel>Capitaine</FormLabel>
              <StyledFormControl
                type="text"
                name="capitaine"
                value={equipe.capitaine}
                onChange={handleChange}
                placeholder="Nom du capitaine de l'équipe"
                disabled={loading}
              />
              <Form.Text className="text-muted">
                Nom et prénom du capitaine de l'équipe (optionnel)
              </Form.Text>
            </Form.Group>
          </FormSection>

          <FormActions>
            <Button variant="outline-secondary" onClick={() => navigate('/equipes')} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={loading || success}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  {isEditMode ? 'Modification en cours...' : 'Création en cours...'}
                </>
              ) : (
                isEditMode ? 'Enregistrer les modifications' : 'Créer l\'équipe'
              )}
            </Button>
          </FormActions>
        </Form>
      </Card.Body>
    </StyledCard>
      </AdminLayout>
  );
};

export default EquipeForm;
