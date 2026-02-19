import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, Tab, Table, Button, Form, Alert, Badge, Spinner, Toast, ToastContainer } from "react-bootstrap";
import AdminLayout from '../AdminLayout';

const ReservationManagement = () => {
  // États
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("TOUTES"); // Valeur par défaut modifiée
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [utilisateurs, setUtilisateurs] = useState({});

  // Normalisation des statuts
  const normalizeStatus = (status) => {
    const statusMap = {
      0: "EN_ATTENTE",
      1: "CONFIRMÉ",
      2: "ANNULÉ",
      3: "TERMINÉ",
      null: "EN_ATTENTE"
    };
    return statusMap[status] || status;
  };

  // Chargement des réservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/reservations");
        setReservations(response.data);
      } catch (error) {
        showNotification("Erreur de chargement", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  // Filtrage des réservations
  useEffect(() => {
    const filtered = reservations.filter(reservation => {
      // Vérification du statut (toutes si "TOUTES" est sélectionné)
      const statusMatch = 
        statusFilter === "TOUTES" || 
        normalizeStatus(reservation.statut) === statusFilter;
      
      // Vérification de la recherche
      const searchTermLower = searchTerm.toLowerCase();
    const searchMatch = 
      searchTerm === "" ||
      String(reservation.id).includes(searchTerm) ||
      reservation.creneau?.terrain?.nom?.toLowerCase().includes(searchTermLower) ||
      (
        utilisateurs[reservation.idUtilisateur] &&
        `${utilisateurs[reservation.idUtilisateur].nom} ${utilisateurs[reservation.idUtilisateur].prenom}`.toLowerCase().includes(searchTermLower)
      );
    return statusMatch && searchMatch;
    });
    setFilteredReservations(filtered);
  }, [reservations, statusFilter, searchTerm]);

  // Notification
  const showNotification = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };
  const fetchUtilisateur = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5021/api/Utilisateurs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      return null;
    }
  };
  
  // Gestion des actions
  const handleAction = async (id, action) => {
    setProcessingId(id);
    try {
      const response = await axios.put(
        `http://localhost:8080/api/reservations/${id}/${action.toLowerCase()}`
      );
      
      // Mise à jour optimiste
      setReservations(prev => prev.map(res => 
        res.id === id 
          ? { 
              ...res, 
              statut: action === "CONFIRMER" ? 1 : 2 
            } 
          : res
      ));
      
      showNotification(response.data, "success");
    } catch (error) {
      console.error("Erreur:", error.response?.data);
      showNotification(
        error.response?.data || "Erreur lors de la mise à jour", 
        "danger"
      );
    } finally {
      setProcessingId(null);
    }
  };
  useEffect(() => {
    const loadUtilisateurs = async () => {
      const nouvellesDonnees = { ...utilisateurs };
      for (const res of filteredReservations) {
        if (!nouvellesDonnees[res.idUtilisateur]) {
          const utilisateur = await fetchUtilisateur(res.idUtilisateur);
          if (utilisateur) {
            nouvellesDonnees[res.idUtilisateur] = utilisateur;
          }
        }
      }
      setUtilisateurs(nouvellesDonnees);
    };
  
    loadUtilisateurs();
  }, [filteredReservations]);
  

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h2 className="mb-4">Liste   des Réservations</h2>

        <ToastContainer position="top-end" className="p-3">
          <Toast 
            show={showToast} 
            onClose={() => setShowToast(false)} 
            delay={5000} 
            autohide
            bg={toastVariant}
          >
            <Toast.Header>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>

        <div className="d-flex justify-content-between mb-3">
          <Form.Control
            type="text"
            placeholder="Rechercher par ID, utilisateur ou terrain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>

        <Tabs
          activeKey={statusFilter}
          onSelect={(k) => setStatusFilter(k)}
          className="mb-3"
        >
          <Tab eventKey="TOUTES" title="Toutes les réservations" />
          <Tab eventKey="EN_ATTENTE" title="En Attente" />
          <Tab eventKey="CONFIRMÉ" title="Confirmées" />
          <Tab eventKey="ANNULÉ" title="Annulées" />
          {/* <Tab eventKey="TERMINÉ" title="Terminées" /> */}
        </Tabs>

        {filteredReservations.length === 0 ? (
          <Alert variant="info">
            Aucune réservation trouvée. Total des réservations: {reservations.length}
          </Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Terrain</th>
                <th>Date</th>
                <th>Créneau</th>
                <th>Statut</th>
                {statusFilter === "EN_ATTENTE" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(res => (
                <tr key={res.id}>
                  <td>{res.id}</td>
                  <td>{utilisateurs[res.idUtilisateur]?.nom || ''} {utilisateurs[res.idUtilisateur]?.prenom || ''}</td>
                  <td>{res.creneau?.terrain?.nom || "-"}</td>
                  <td>{new Date(res.creneau?.dateHeureDebut).toLocaleDateString()}</td>
                  <td>
                    {res.creneau?.dateHeureDebut?.split('T')[1].substring(0, 5)} - 
                    {res.creneau?.dateHeureFin?.split('T')[1].substring(0, 5)}
                  </td>
                  <td>
                    <Badge bg={
                      normalizeStatus(res.statut) === "CONFIRMÉ" ? "success" :
                      normalizeStatus(res.statut) === "ANNULÉ" ? "danger" :
                      normalizeStatus(res.statut) === "TERMINÉ" ? "secondary" : "warning"
                    }>
                      {normalizeStatus(res.statut)}
                    </Badge>
                  </td>
                  {statusFilter === "EN_ATTENTE" && (
                    <td className="d-flex">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleAction(res.id, "CONFIRMER")}
                        disabled={processingId === res.id}
                        className="me-2"
                      >
                        {processingId === res.id ? (
                          <Spinner as="span" size="sm" animation="border" />
                        ) : (
                          "Confirmer"
                        )}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleAction(res.id, "ANNULER")}
                        disabled={processingId === res.id}
                      >
                        {processingId === res.id ? (
                          <Spinner as="span" size="sm" animation="border" />
                        ) : (
                          "Annuler"
                        )}
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReservationManagement;