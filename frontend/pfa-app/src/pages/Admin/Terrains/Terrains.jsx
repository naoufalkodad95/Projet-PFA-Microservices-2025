import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Form, Button, Pagination, Row, Col, Badge } from "react-bootstrap";
import AdminLayout from '../AdminLayout';
import ActionButtons from "../../../components/ActionButtons"; // adapte le chemin selon ton projet
const API_URL = "http://localhost:8080/api/terrains"; // 🔁 adapte l'URL selon ton backend

const Terrains = () => {
  const [terrains, setTerrains] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    id: null,
    nom: "",
    capacite: "",
    etat: true, // true = Actif, false = Maintenance    
    description: "",
  });
  const [showForm, setShowForm] = useState(false);

  const itemsPerPage = 4;

  // Charger les données de l’API
  const fetchTerrains = async () => {
    try {
      const res = await axios.get(API_URL);
      setTerrains(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    }
  };

  useEffect(() => {
    fetchTerrains();
  }, []);

  // Filtrage et pagination
  const filteredTerrains = terrains.filter((t) =>
    t.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTerrains.length / itemsPerPage);
  const currentTerrains = filteredTerrains.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "etat") newValue = value === "true";
    if (name === "capacite") newValue = parseInt(value);

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`${API_URL}/${formData.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setShowForm(false);
      setFormData({ id: null, nom: "", capacite: "", etat: true, description: "" });
      fetchTerrains();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
    }
  };

  const handleEdit = (terrain) => {
    setFormData(terrain);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTerrains();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <AdminLayout>

    <Container fluid className="p-4">
      <Row className="mb-4"><Col><h2>📦 Liste des Terrains</h2></Col></Row>

      {/* Recherche + Ajout */}
      <Row className="mb-3 ">
        <Col md={3}>
          <Button variant="success" onClick={() => {
            setFormData({ id: null, nom: "", capacite: "", etat: true, description: "" });
            setShowForm(true);
          }}>
             ➕  Ajouter un terrain
          </Button>

          
        </Col>
        <Col md={{ span: 4, offset: 5 }}>
          <Form.Control
            type="text"
            placeholder="Rechercher un terrain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      {/* Tableau */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Capacité</th>
            <th>État</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTerrains.map((t) => (
            <tr key={t.id}>
              <td>{t.nom}</td>
              <td>{t.capacite}</td>
              <td>
                {t.etat ? (
                  <Badge bg="success">Actif</Badge>
                ) : (
                  <Badge bg="warning">Maintenance</Badge>
                )}
              </td>
              <td>
               
                  <td>
                    <ActionButtons item={t} onEdit={handleEdit} onDelete={handleDelete} />
                  </td>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className="justify-content-center">
        <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} />
      </Pagination>

      {/* Formulaire */}
      {showForm && (
        <div className="mt-4 p-3 border rounded">
          <h5>{formData.id ? "Modifier le terrain" : "Ajouter un terrain"}</h5>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Capacité</Form.Label>
                  <Form.Control
                    name="capacite"
                    type="number"
                    value={formData.capacite}
                    onChange={handleInputChange}
                    required
                    min={1}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>État</Form.Label>
                  <Form.Select name="etat" value={formData.etat} onChange={handleInputChange}>
                    <option value="true">Actif</option>
                    <option value="false">Maintenance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowForm(false)}>Annuler</Button>
              <Button variant="success" type="submit">Enregistrer</Button>
            </div>
          </Form>
        </div>
      )}
    </Container>
    </AdminLayout>

  );
};

export default Terrains;
