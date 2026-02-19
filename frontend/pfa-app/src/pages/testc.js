// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Tabs, Tab, Table, Button, Form, Alert, Badge, Spinner, Toast, ToastContainer, Modal, Card,Row,Col } from "react-bootstrap";
// // import AdminLayout from '../AdminLayout';

// // const ReservationManagement = () => {
// //   // États
// //   const [reservations, setReservations] = useState([]);
// //   const [filteredReservations, setFilteredReservations] = useState([]);
// //   const [statusFilter, setStatusFilter] = useState("EN_ATTENTE");
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [processingId, setProcessingId] = useState(null);
// //   const [showToast, setShowToast] = useState(false);
// //   const [toastMessage, setToastMessage] = useState("");
// //   const [toastVariant, setToastVariant] = useState("success");
// //   const [selectedReservation, setSelectedReservation] = useState(null);
// //   const [showDetailModal, setShowDetailModal] = useState(false);

// //   // Normalisation des statuts
// //   const normalizeStatus = (status) => {
// //     const statusMap = {
// //       0: "EN_ATTENTE",
// //       1: "CONFIRMÉ",
// //       2: "ANNULÉ",
// //       3: "TERMINÉ",
// //       null: "EN_ATTENTE"
// //     };
// //     return statusMap[status] || status;
// //   };

// //   // Chargement des réservations
// //   useEffect(() => {
// //     const fetchReservations = async () => {
// //       try {
// //         const response = await axios.get("http://localhost:8080/api/reservations/all");
// //         setReservations(response.data);
// //       } catch (error) {
// //         showNotification("Erreur de chargement", "danger");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchReservations();
// //   }, []);

// //   // Filtrage des réservations
// //   useEffect(() => {
// //     const filtered = reservations.filter(reservation => {
// //       const normalizedStatus = normalizeStatus(reservation.statut);
// //       const statusMatch = normalizedStatus === statusFilter;
// //       const searchMatch = 
// //         searchTerm === "" ||
// //         String(reservation.id).includes(searchTerm) ||
// //         String(reservation.idUtilisateur).includes(searchTerm) ||
// //         reservation.creneau?.terrain?.nom?.toLowerCase().includes(searchTerm.toLowerCase());
      
// //       return statusMatch && searchMatch;
// //     });
// //     setFilteredReservations(filtered);
// //   }, [reservations, statusFilter, searchTerm]);

// //   // Notification
// //   const showNotification = (message, variant) => {
// //     setToastMessage(message);
// //     setToastVariant(variant);
// //     setShowToast(true);
// //   };

// //   // Gestion des actions
// //   const handleAction = async (id, action) => {
// //     setProcessingId(id);
// //     try {
// //       const response = await axios.put(
// //         `http://localhost:8080/api/reservations/${id}/${action.toLowerCase()}`
// //       );
      
// //       // Mise à jour optimiste
// //       setReservations(prev => prev.map(res => 
// //         res.id === id 
// //           ? { ...res, statut: action === "CONFIRMER" ? 1 : 2 } 
// //           : res
// //       ));
      
// //       showNotification(response.data, "success");
// //       setShowDetailModal(false);
// //     } catch (error) {
// //       console.error("Erreur:", error.response?.data);
// //       showNotification(
// //         error.response?.data || "Erreur lors de la mise à jour", 
// //         "danger"
// //       );
// //     } finally {
// //       setProcessingId(null);
// //     }
// //   };

// //   // Ouvrir les détails de la réservation
// //   const openReservationDetails = (reservation) => {
// //     setSelectedReservation(reservation);
// //     setShowDetailModal(true);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="d-flex justify-content-center mt-5">
// //         <Spinner animation="border" variant="primary" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <AdminLayout>
// //       <div className="container mt-4">
// //         <h2 className="mb-4">Gestion des Réservations</h2>

// //         <ToastContainer position="top-end" className="p-3">
// //           <Toast 
// //             show={showToast} 
// //             onClose={() => setShowToast(false)} 
// //             delay={5000} 
// //             autohide
// //             bg={toastVariant}
// //           >
// //             <Toast.Header>
// //               <strong className="me-auto">Notification</strong>
// //             </Toast.Header>
// //             <Toast.Body className="text-white">{toastMessage}</Toast.Body>
// //           </Toast>
// //         </ToastContainer>

// //         <div className="d-flex justify-content-between mb-3">
// //           <Form.Control
// //             type="text"
// //             placeholder="Rechercher par ID, utilisateur ou terrain..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             style={{ width: '300px' }}
// //           />
// //         </div>

// //         <Tabs
// //           activeKey={statusFilter}
// //           onSelect={(k) => setStatusFilter(k)}
// //           className="mb-3"
// //         >
// //           <Tab eventKey="EN_ATTENTE" title="Demandes en attente" />
// //           <Tab eventKey="CONFIRMÉ" title="Réservations confirmées" />
// //           <Tab eventKey="ANNULÉ" title="Historique" />
// //         </Tabs>

// //         {filteredReservations.length === 0 ? (
// //           <Alert variant="info">
// //             Aucune réservation trouvée. Total des réservations: {reservations.length}
// //           </Alert>
// //         ) : (
// //           <>
// //             <Table striped bordered hover responsive>
// //               <thead>
// //                 <tr>
// //                   <th>ID</th>
// //                   <th>Date</th>
// //                   <th>Heure</th>
// //                   <th>Terrain</th>
// //                   <th>Capitaine</th>
// //                   <th>Date demande</th>
// //                   <th>Statut</th>
// //                   <th>Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {filteredReservations.map(res => (
// //                   <tr key={res.id}>
// //                     <td>{res.id}</td>
// //                     <td>{new Date(res.date).toLocaleDateString()}</td>
// //                     <td>
// //                       {res.creneau?.dateHeureDebut?.split('T')[1].substring(0, 5)} - 
// //                       {res.creneau?.dateHeureFin?.split('T')[1].substring(0, 5)}
// //                     </td>
// //                     <td>{res.creneau?.terrain?.nom || "-"}</td>
// //                     <td>{res.capitaine || "Non spécifié"}</td>
// //                     <td>{new Date(res.dateCreation).toLocaleDateString()}</td>
// //                     <td>
// //                       <Badge bg={
// //                         normalizeStatus(res.statut) === "CONFIRMÉ" ? "success" :
// //                         normalizeStatus(res.statut) === "ANNULÉ" ? "danger" : "warning"
// //                       }>
// //                         {normalizeStatus(res.statut)}
// //                       </Badge>
// //                     </td>
// //                     <td>
// //                       <Button
// //                         variant="info"
// //                         size="sm"
// //                         onClick={() => openReservationDetails(res)}
// //                         className="me-2"
// //                       >
// //                         Voir
// //                       </Button>
// //                       {statusFilter === "EN_ATTENTE" && (
// //                         <>
// //                           <Button
// //                             variant="success"
// //                             size="sm"
// //                             onClick={() => handleAction(res.id, "CONFIRMER")}
// //                             disabled={processingId === res.id}
// //                             className="me-2"
// //                           >
// //                             {processingId === res.id ? (
// //                               <Spinner as="span" size="sm" animation="border" />
// //                             ) : (
// //                               "Confirmer"
// //                             )}
// //                           </Button>
// //                           <Button
// //                             variant="danger"
// //                             size="sm"
// //                             onClick={() => handleAction(res.id, "ANNULER")}
// //                             disabled={processingId === res.id}
// //                           >
// //                             {processingId === res.id ? (
// //                               <Spinner as="span" size="sm" animation="border" />
// //                             ) : (
// //                               "Annuler"
// //                             )}
// //                           </Button>
// //                         </>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </Table>

// //             {/* Modal de détails de réservation */}
// //             <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
// //               <Modal.Header closeButton>
// //                 <Modal.Title>Détails de la réservation</Modal.Title>
// //               </Modal.Header>
// //               <Modal.Body>
// //                 {selectedReservation && (
// //                   <Card>
// //                     <Card.Body>
// //                       <Row className="mb-3">
// //                         <Col md={6}>
// //                           <p><strong>ID Réservation:</strong> {selectedReservation.id}</p>
// //                           <p><strong>Équipe:</strong> {selectedReservation.equipe || "Non spécifié"}</p>
// //                           <p><strong>Date:</strong> {new Date(selectedReservation.date).toLocaleDateString()}</p>
// //                         </Col>
// //                         <Col md={6}>
// //                           <p><strong>Capitaine:</strong> {selectedReservation.capitaine || "Non spécifié"}</p>
// //                           <p><strong>Créneau:</strong> {selectedReservation.creneau?.dateHeureDebut?.split('T')[1].substring(0, 5)} - {selectedReservation.creneau?.dateHeureFin?.split('T')[1].substring(0, 5)}</p>
// //                           <p><strong>Terrain:</strong> {selectedReservation.creneau?.terrain?.nom || "-"}</p>
// //                         </Col>
// //                       </Row>
// //                       <Row>
// //                         <Col>
// //                           <p><strong>Statut:</strong> 
// //                             <Badge bg={
// //                               normalizeStatus(selectedReservation.statut) === "CONFIRMÉ" ? "success" :
// //                               normalizeStatus(selectedReservation.statut) === "ANNULÉ" ? "danger" : "warning"
// //                             } className="ms-2">
// //                               {normalizeStatus(selectedReservation.statut)}
// //                             </Badge>
// //                           </p>
// //                           <p><strong>Paiement:</strong> {selectedReservation.paiement || "Non spécifié"}</p>
// //                         </Col>
// //                       </Row>
// //                     </Card.Body>
// //                     <Card.Footer className="d-flex justify-content-end">
// //                       {statusFilter === "EN_ATTENTE" && (
// //                         <>
// //                           <Button
// //                             variant="success"
// //                             onClick={() => handleAction(selectedReservation.id, "CONFIRMER")}
// //                             disabled={processingId === selectedReservation.id}
// //                             className="me-2"
// //                           >
// //                             {processingId === selectedReservation.id ? (
// //                               <Spinner as="span" size="sm" animation="border" />
// //                             ) : (
// //                               "Confirmer"
// //                             )}
// //                           </Button>
// //                           <Button
// //                             variant="secondary"
// //                             onClick={() => setShowDetailModal(false)}
// //                             className="me-2"
// //                           >
// //                             Modifier
// //                           </Button>
// //                           <Button
// //                             variant="danger"
// //                             onClick={() => handleAction(selectedReservation.id, "ANNULER")}
// //                             disabled={processingId === selectedReservation.id}
// //                           >
// //                             {processingId === selectedReservation.id ? (
// //                               <Spinner as="span" size="sm" animation="border" />
// //                             ) : (
// //                               "Annuler"
// //                             )}
// //                           </Button>
// //                         </>
// //                       )}
// //                     </Card.Footer>
// //                   </Card>
// //                 )}
// //               </Modal.Body>
// //             </Modal>
// //           </>
// //         )}
// //       </div>
// //     </AdminLayout>
// //   );
// // };

// // export default ReservationManagement;







// // import React, { useState, useEffect } from 'react';
// // import { Container, Row, Col, Card, Form, Button, Nav, Navbar } from 'react-bootstrap';
// // import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
// // import moment from 'moment';
// // import axios from 'axios';
// // import 'react-big-calendar/lib/css/react-big-calendar.css';
// // import Header from '../Header';
// // const localizer = momentLocalizer(moment);

// // function Reservation() {
// //   const [date, setDate] = useState('');
// //   const [selectedDate, setSelectedDate] = useState('');
// //   const [terrain, setTerrain] = useState('Tous');
// //   const [terrains, setTerrains] = useState([]); // Liste dynamique des terrains
// //   const [creneaux, setCreneaux] = useState([]);
// //   const [newReservation, setNewReservation] = useState({});

// //   const handleSelectDate = (selected) => {
// //     const selectedJSDate = new Date(selected);
// //     const formatted = moment(selectedJSDate).format('YYYY-MM-DD');
// //     setDate(formatted);
// //     setSelectedDate(moment(selectedJSDate).format('DD/MM/YYYY'));
// //     fetchCreneaux(formatted);
// //   };

// //   const fetchCreneaux = async (selectedDateISO) => {
// //     const token = localStorage.getItem("authToken"); // 🧠 On récupère le token ici
// //     try {
// //       const response = await axios.get(
// //         `http://localhost:8080/api/creneaux/creneaux?date=${selectedDateISO}`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}` // ✅ Envoie du token dans le header
// //           }
// //         }
// //       );
// //       setCreneaux(response.data);
// //     } catch (err) {
// //       console.error('Erreur API:', err);
// //       alert('Une erreur est survenue lors de la récupération des créneaux.');
// //     }
// //   };

// //   const fetchTerrains = async () => {
// //     try {
// //       const response = await axios.get("http://localhost:8080/api/terrains");
// //       setTerrains(response.data);
// //     } catch (error) {
// //       console.error("Erreur lors du chargement des terrains :", error);
// //     }
// //   };

// //   const submitReservation = async () => {
// //     const token = localStorage.getItem("authToken"); // ✅ ici tu récupères le token
// //     if (!token) {
// //       alert("Vous devez être authentifié pour faire une réservation.");
// //       return;
// //     }
  
// //     try {
// //       const response = await axios.post(
// //         'http://localhost:8080/api/reservations',
// //         {
// //           date: newReservation.date,
// //           startTime: newReservation.startTime,
// //           endTime: newReservation.endTime,
// //           terrainId: newReservation.terrainId,
// //           utilisateurId: 82
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`, // ✅ ici c'est bien défini
// //             'Content-Type': 'application/json',
// //           }
// //         }
// //       );
  
// //       alert("Réservation réussie !");
// //     } catch (error) {
// //       console.error("Erreur lors de la réservation :", error);
// //       alert("Une erreur est survenue lors de la réservation !");
// //     }
// //   };
  

// //   useEffect(() => {
// //     fetchTerrains();
// //   }, []);

// //   useEffect(() => {
// //     if (date) fetchCreneaux(date);
// //   }, [terrain]);
// //   return (
// //     <>
// //       <Header /> 

// //       <Container className="mt-4">
// //         <Row>
// //           <Col>
// //             <h2 className="text-center mb-4">Vérifier les disponibilités</h2>

// //             {/* Card pour le calendrier */}
// //             <Card className="m-3 shadow-lg rounded">
// //               <Row>
// //                 <Col md={6}>
// //                   <Card className="m-4">
// //                     <BigCalendar
// //                       localizer={localizer}
// //                       events={[]}
// //                       startAccessor="start"
// //                       endAccessor="end"
// //                       style={{ height: 400 }}
// //                       views={['month']}
// //                       defaultView="month"
// //                       selectable
// //                       onSelectSlot={({ start }) => handleSelectDate(start)}
// //                       onSelecting={({ start }) => {
// //                         const now = new Date();
// //                         now.setHours(0, 0, 0, 0);
// //                         return start >= now;
// //                       }}
// //                       dayPropGetter={(date) => {
// //                         const today = new Date();
// //                         today.setHours(0, 0, 0, 0);
// //                         if (date < today) {
// //                           return {
// //                             style: {
// //                               backgroundColor: '#e0e0e0',
// //                               color: '#999',
// //                               pointerEvents: 'none',
// //                               cursor: 'not-allowed'
// //                             }
// //                           };
// //                         }
// //                         return {};
// //                       }}
// //                     />
// //                   </Card>
// //                 </Col>

// //                 <Col md={6}>
// //                   <Card className="m-4">
// //                     <h5 className="m-3">Recherche Rapide</h5>
// //                     <Form.Group className="m-3 d-flex align-items-center">
// //                       <Form.Label className="mb-0 me-2">Date:</Form.Label>
// //                       <Form.Control
// //                         type="date"
// //                         value={date}
// //                         onChange={(e) => {
// //                           setDate(e.target.value);
// //                           const frDate = moment(e.target.value).format('DD/MM/YYYY');
// //                           setSelectedDate(frDate);
// //                           fetchCreneaux(e.target.value);
// //                         }}
// //                       />
// //                     </Form.Group>

// //                     <Form.Group className="m-3 d-flex align-items-center">
// //                       <Form.Label className="mb-0 me-2">Terrain:</Form.Label>
// //                       <Form.Select
// //                         value={terrain}
// //                         onChange={(e) => setTerrain(e.target.value)}
// //                       >
// //                         <option value="Tous">Tous</option>
// //                         {terrains.map((t) => (
// //                           <option key={t.id} value={t.id}>{t.nom}</option>
// //                         ))}
// //                       </Form.Select>
// //                     </Form.Group>
// //                   </Card>
// //                 </Col>
// //               </Row>
// //             </Card>

// //             {/* Créneaux disponibles */}
// //             <Card className="m-3 shadow-lg rounded">
// //               <Row>
// //                 <Col>
// //                   <h5 className="m-4">Créneaux disponibles pour le {selectedDate}</h5>
// //                   <Card className="m-3 p-3">
// //                     {terrains
// //                       .filter(t => terrain === 'Tous' || terrain === String(t.id))
// //                       .map(t => {
// //                         const terrainCreneaux = creneaux.filter(c => c.terrain.id === t.id);
// //                         return (
// //                           <div key={t.id} className="mb-4">
// //                             <h6 className="mb-2 text-success">{t.nom}</h6>
// //                             {terrainCreneaux.length === 0 ? (
// //                               <p>Aucun créneau disponible</p>
// //                             ) : (
// //                               <div className="d-flex flex-wrap gap-3">
// //                                 {terrainCreneaux.map((c, idx) => {
// //                                   const heureDebut = moment(c.dateHeureDebut).format('HH:mm');
// //                                   const heureFin = moment(c.dateHeureFin).format('HH:mm');

// //                                   return (
// //                                     <Button
// //                                       key={idx}
// //                                       variant="outline-success"
// //                                       size="sm"
// //                                       className="hover-shadow"
// //                                       onClick={() =>
// //                                         setNewReservation({
// //                                           ...newReservation,
// //                                           date: c.date,
// //                                           startTime: c.dateHeureDebut,
// //                                           endTime: c.dateHeureFin,
// //                                           terrainId: c.terrain.id
// //                                         })
// //                                       }
// //                                     >
// //                                       <Card.Text>{heureDebut} - {heureFin}</Card.Text>
// //                                     </Button>
// //                                   );
// //                                 })}
// //                               </div>
// //                             )}
// //                           </div>
// //                         );
// //                       })}

// //                     {newReservation.terrainId && (
// //                       <>
// //                         <div className="text-end mt-3">
// //                           <Button
// //                             variant="success"
// //                             onClick={submitReservation}
// //                             disabled={!newReservation.date || !newReservation.startTime || !newReservation.terrainId}
// //                           >
// //                             Réserver
// //                           </Button>
// //                         </div>
// //                         <Card.Text className="mt-2">
// //                           Vous allez réserver le <strong>{moment(newReservation.date).format('DD/MM/YYYY')}</strong> de <strong>{moment(newReservation.startTime).format('HH:mm')}</strong> à <strong>{moment(newReservation.endTime).format('HH:mm')}</strong> sur le <strong>{terrains.find(t => t.id === newReservation.terrainId)?.nom}</strong>.
// //                         </Card.Text>
// //                       </>
// //                     )}
// //                   </Card>
// //                 </Col>
// //               </Row>
// //             </Card>
// //           </Col>
// //         </Row>
// //       </Container>
// //     </>
// //   );
// // }

// // export default Reservation;


// // ***************************************
// // import React, { useState, useEffect, useCallback, useMemo } from 'react';
// // import { Container, Row, Col, Card, Form, Button, Table, Tab, Tabs, Alert, Badge } from 'react-bootstrap';
// // import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
// // import moment from 'moment';
// // import axios from 'axios';
// // import 'react-big-calendar/lib/css/react-big-calendar.css';
// // import Header from './Header';

// // const localizer = momentLocalizer(moment);

// // // Configuration Axios
// // const api = axios.create({
// //   baseURL: 'http://localhost:8080/api',
// //   headers: {
// //     'Content-Type': 'application/json'
// //   }
// // });

// // // Intercepteur pour ajouter le token JWT
// // api.interceptors.request.use(config => {
// //   const token = localStorage.getItem('authToken');
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// // function Reservation() {
// //   const [date, setDate] = useState('');
// //   const [selectedDate, setSelectedDate] = useState('');
// //   const [terrain, setTerrain] = useState('Tous');
// //   const [terrains, setTerrains] = useState([]);
// //   const [creneaux, setCreneaux] = useState([]);
// //   const [newReservation, setNewReservation] = useState({});
// //   const [reservations, setReservations] = useState([]);
// //   const [activeTab, setActiveTab] = useState('upcoming');
// //   const [authError, setAuthError] = useState(null);
// //   const [userId, setUserId] = useState(null);
// //   const [isLoading, setIsLoading] = useState(true);

// //   // Vérifier l'authentification et récupérer l'ID utilisateur
// //   useEffect(() => {
// //     const checkAuth = async () => {
// //       const token = localStorage.getItem('authToken');
// //       const storedUser = localStorage.getItem('user');
      
// //       if (!token) {
// //         setAuthError('Vous devez être connecté pour accéder à cette fonctionnalité');
// //         setIsLoading(false);
// //         return;
// //       }

// //       try {
// //         // Vérifier la validité du token
// //         await api.get('/auth/verify');
        
// //         if (storedUser) {
// //           const user = JSON.parse(storedUser);
// //           setUserId(user.id);
// //         }
// //       } catch (error) {
// //         localStorage.removeItem('authToken');
// //         setAuthError('Session expirée ou invalide');
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     checkAuth();
// //   }, []);

// //   // Récupérer les données nécessaires si authentifié
// //   useEffect(() => {
// //     if (!userId) return;

// //     const fetchData = async () => {
// //       try {
// //         await Promise.all([fetchTerrains(), fetchReservations()]);
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //         setAuthError('Erreur lors du chargement des données');
// //       }
// //     };

// //     fetchData();
// //   }, [userId]);

// //   // Sélection de la date depuis le calendrier
// //   const handleSelectDate = useCallback((selected) => {
// //     const selectedJSDate = new Date(selected);
// //     const formatted = moment(selectedJSDate).format('YYYY-MM-DD');
// //     setDate(formatted);
// //     setSelectedDate(moment(selectedJSDate).format('DD/MM/YYYY'));
// //     fetchCreneaux(formatted);
// //   }, []);

// //   // Récupérer les créneaux disponibles
// //   const fetchCreneaux = async (selectedDateISO) => {
// //     try {
// //       const response = await api.get(`/creneaux/creneaux?date=${selectedDateISO}`);
// //       setCreneaux(response.data);
// //     } catch (err) {
// //       console.error('Erreur API:', err);
// //       setAuthError('Erreur lors de la récupération des créneaux');
// //     }
// //   };

// //   // Récupérer la liste des terrains
// //   const fetchTerrains = async () => {
// //     try {
// //       const response = await api.get('/terrains');
// //       setTerrains(response.data);
// //     } catch (error) {
// //       console.error('Erreur lors du chargement des terrains :', error);
// //       setAuthError('Erreur lors du chargement des terrains');
// //     }
// //   };

// //   // Récupérer les réservations de l'utilisateur
// //   const fetchReservations = async () => {
// //     try {
// //       const response = await api.get(`/reservations/user/${userId}`);
// //       setReservations(response.data);
// //     } catch (error) {
// //       console.error('Erreur lors du chargement des réservations :', error);
// //       setAuthError('Erreur lors du chargement des réservations');
// //     }
// //   };

// //   // Soumettre une réservation
// //   const submitReservation = async () => {
// //     try {
// //       await api.post('/reservations', {
// //         date: newReservation.date,
// //         startTime: newReservation.startTime,
// //         endTime: newReservation.endTime,
// //         terrainId: newReservation.terrainId,
// //         utilisateurId: userId
// //       });

// //       alert('Réservation réussie !');
// //       await fetchReservations();
// //       setNewReservation({});
// //     } catch (error) {
// //       console.error('Erreur lors de la réservation :', error);
// //       setAuthError(error.response?.data?.message || 'Erreur lors de la réservation');
// //     }
// //   };

// //   // Annuler une réservation
// //   const cancelReservation = async (id) => {
// //     if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

// //     try {
// //       await api.delete(`/reservations/${id}`);
// //       alert('Réservation annulée avec succès !');
// //       await fetchReservations();
// //     } catch (error) {
// //       console.error('Erreur lors de l\'annulation :', error);
// //       setAuthError(error.response?.data?.message || 'Erreur lors de l\'annulation');
// //     }
// //   };

// //   // Filtrer les réservations
// //   const filteredReservations = useMemo(() => {
// //     const now = new Date();
// //     switch (activeTab) {
// //       case 'upcoming':
// //         return reservations.filter(r => new Date(`${r.date}T${r.startTime}`) > now);
// //       case 'past':
// //         return reservations.filter(r => new Date(`${r.date}T${r.startTime}`) < now);
// //       case 'pending':
// //         return reservations.filter(r => r.status === 'En attente');
// //       default:
// //         return reservations;
// //     }
// //   }, [reservations, activeTab]);

// //   if (isLoading) {
// //     return (
// //       <>
// //         <Header />
// //         <Container className="mt-4">
// //           <Alert variant="info">Vérification de l'authentification...</Alert>
// //         </Container>
// //       </>
// //     );
// //   }

// //   if (authError) {
// //     return (
// //       <>
// //         <Header />
// //         <Container className="mt-4">
// //           <Alert variant="danger" dismissible onClose={() => setAuthError(null)}>
// //             {authError}
// //             {!userId && (
// //               <div className="mt-2">
// //                 <Button variant="primary" href="/login">
// //                   Se connecter
// //                 </Button>
// //               </div>
// //             )}
// //           </Alert>
// //         </Container>
// //       </>
// //     );
// //   }

// //   return (
// //     <>
// //       <Header />
// //       <Container className="mt-4">
// //         <Row>
// //           <Col>
// //             <h2 className="text-center mb-4">Vérifier les disponibilités</h2>

// //             {/* Card pour le calendrier et recherche */}
// //             <CalendarSection 
// //               date={date}
// //               selectedDate={selectedDate}
// //               terrain={terrain}
// //               terrains={terrains}
// //               onDateChange={(e) => {
// //                 setDate(e.target.value);
// //                 setSelectedDate(moment(e.target.value).format('DD/MM/YYYY'));
// //                 fetchCreneaux(e.target.value);
// //               }}
// //               onTerrainChange={(e) => setTerrain(e.target.value)}
// //               onSelectDate={handleSelectDate}
// //             />

// //             {/* Créneaux disponibles */}
// //             <AvailableSlots 
// //               selectedDate={selectedDate}
// //               terrains={terrains}
// //               terrain={terrain}
// //               creneaux={creneaux}
// //               newReservation={newReservation}
// //               onSlotSelect={setNewReservation}
// //               onSubmitReservation={submitReservation}
// //             />

// //             {/* Mes réservations */}
// //             <ReservationsList 
// //               reservations={filteredReservations}
// //               activeTab={activeTab}
// //               onTabChange={setActiveTab}
// //               onCancelReservation={cancelReservation}
// //             />
// //           </Col>
// //         </Row>
// //       </Container>
// //     </>
// //   );
// // }

// // // Sous-composants pour une meilleure organisation
// // function CalendarSection({ date, selectedDate, terrain, terrains, onDateChange, onTerrainChange, onSelectDate }) {
// //   return (
// //     <Card className="m-3 shadow-lg rounded">
// //       <Row>
// //         <Col md={6}>
// //           <Card className="m-4">
// //             <BigCalendar
// //               localizer={localizer}
// //               events={[]}
// //               startAccessor="start"
// //               endAccessor="end"
// //               style={{ height: 400 }}
// //               views={['month']}
// //               defaultView="month"
// //               selectable
// //               onSelectSlot={({ start }) => onSelectDate(start)}
// //               onSelecting={({ start }) => start >= new Date(new Date().setHours(0, 0, 0, 0))}
// //               dayPropGetter={(date) => {
// //                 const today = new Date(new Date().setHours(0, 0, 0, 0));
// //                 if (date < today) {
// //                   return {
// //                     style: {
// //                       backgroundColor: '#e0e0e0',
// //                       color: '#999',
// //                       pointerEvents: 'none',
// //                       cursor: 'not-allowed'
// //                     }
// //                   };
// //                 }
// //                 return {};
// //               }}
// //             />
// //           </Card>
// //         </Col>
// //         <Col md={6}>
// //           <Card className="m-4">
// //             <h5 className="m-3">Recherche Rapide</h5>
// //             <Form.Group className="m-3 d-flex align-items-center">
// //               <Form.Label className="mb-0 me-2">Date:</Form.Label>
// //               <Form.Control
// //                 type="date"
// //                 value={date}
// //                 onChange={onDateChange}
// //               />
// //             </Form.Group>
// //             <Form.Group className="m-3 d-flex align-items-center">
// //               <Form.Label className="mb-0 me-2">Terrain:</Form.Label>
// //               <Form.Select value={terrain} onChange={onTerrainChange}>
// //                 <option value="Tous">Tous</option>
// //                 {terrains.map((t) => (
// //                   <option key={t.id} value={t.id}>{t.nom}</option>
// //                 ))}
// //               </Form.Select>
// //             </Form.Group>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </Card>
// //   );
// // }

// // function AvailableSlots({ selectedDate, terrains, terrain, creneaux, newReservation, onSlotSelect, onSubmitReservation }) {
// //   return (
// //     <Card className="m-3 shadow-lg rounded">
// //       <Row>
// //         <Col>
// //           <h5 className="m-4">Créneaux disponibles pour le {selectedDate}</h5>
// //           <Card className="m-3 p-3">
// //             {terrains
// //               .filter(t => terrain === 'Tous' || terrain === String(t.id))
// //               .map(t => {
// //                 const terrainCreneaux = creneaux.filter(c => c.terrain.id === t.id);
// //                 return (
// //                   <div key={t.id} className="mb-4">
// //                     <h6 className="mb-2 text-success">{t.nom}</h6>
// //                     {terrainCreneaux.length === 0 ? (
// //                       <p>Aucun créneau disponible</p>
// //                     ) : (
// //                       <div className="d-flex flex-wrap gap-3">
// //                         {terrainCreneaux.map((c, idx) => {
// //                           const heureDebut = moment(c.dateHeureDebut).format('HH:mm');
// //                           const heureFin = moment(c.dateHeureFin).format('HH:mm');

// //                           return (
// //                             <Button
// //                               key={idx}
// //                               variant="outline-success"
// //                               size="sm"
// //                               className="hover-shadow"
// //                               onClick={() => onSlotSelect({
// //                                 date: c.date,
// //                                 startTime: c.dateHeureDebut,
// //                                 endTime: c.dateHeureFin,
// //                                 terrainId: c.terrain.id
// //                               })}
// //                             >
// //                               {heureDebut} - {heureFin}
// //                             </Button>
// //                           );
// //                         })}
// //                       </div>
// //                     )}
// //                   </div>
// //                 );
// //               })}

// //             {newReservation.terrainId && (
// //               <>
// //                 <div className="text-end mt-3">
// //                   <Button
// //                     variant="success"
// //                     onClick={onSubmitReservation}
// //                     disabled={!newReservation.date || !newReservation.startTime || !newReservation.terrainId}
// //                   >
// //                     Réserver
// //                   </Button>
// //                 </div>
// //                 <Card.Text className="mt-2">
// //                   Vous allez réserver le <strong>{moment(newReservation.date).format('DD/MM/YYYY')}</strong> de{' '}
// //                   <strong>{moment(newReservation.startTime).format('HH:mm')}</strong> à{' '}
// //                   <strong>{moment(newReservation.endTime).format('HH:mm')}</strong> sur le{' '}
// //                   <strong>{terrains.find(t => t.id === newReservation.terrainId)?.nom}</strong>.
// //                 </Card.Text>
// //               </>
// //             )}
// //           </Card>
// //         </Col>
// //       </Row>
// //     </Card>
// //   );
// // }

// // function ReservationsList({ reservations, activeTab, onTabChange, onCancelReservation }) {
// //   return (
// //     <Card className="m-3 shadow-lg rounded">
// //       <Card.Body>
// //         <h5 className="mb-4">Mes réservations</h5>
        
// //         <Tabs activeKey={activeTab} onSelect={onTabChange} className="mb-3">
// //           <Tab eventKey="upcoming" title="À venir" />
// //           <Tab eventKey="past" title="Passées" />
// //           <Tab eventKey="pending" title="En attente" />
// //           <Tab eventKey="all" title="Toutes" />
// //         </Tabs>

// //         <Table striped bordered hover responsive>
// //           <thead>
// //             <tr>
// //               <th>Date</th>
// //               <th>Heure</th>
// //               <th>Terrain</th>
// //               <th>Statut</th>
// //               <th>Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {reservations.length === 0 ? (
// //               <tr>
// //                 <td colSpan="5" className="text-center">Aucune réservation trouvée</td>
// //               </tr>
// //             ) : (
// //               reservations.map((reservation) => (
// //                 <ReservationRow 
// //                   key={reservation.id} 
// //                   reservation={reservation} 
// //                   onCancel={onCancelReservation} 
// //                 />
// //               ))
// //             )}
// //           </tbody>
// //         </Table>

// //         <Pagination />
// //       </Card.Body>
// //     </Card>
// //   );
// // }

// // function ReservationRow({ reservation, onCancel }) {
// //   const isPast = new Date(`${reservation.date}T${reservation.startTime}`) < new Date();
// //   const isCancelled = reservation.status === 'Annulé';

// //   return (
// //     <tr>
// //       <td>{moment(reservation.date).format('DD/MM/YYYY')}</td>
// //       <td>{reservation.startTime} - {reservation.endTime}</td>
// //       <td>Terrain {reservation.terrain?.nom || reservation.terrainId}</td>
// //       <td>
// //         <Badge bg={
// //           reservation.status === 'Confirmé' ? 'success' : 
// //           reservation.status === 'Annulé' ? 'danger' : 'warning'
// //         }>
// //           {reservation.status || 'Confirmé'}
// //         </Badge>
// //       </td>
// //       <td>
// //         <div className="d-flex flex-wrap gap-2">
// //           <Button variant="info" size="sm">Voir</Button>
// //           <Button 
// //             variant="warning" 
// //             size="sm"
// //             disabled={isCancelled || isPast}
// //           >
// //             Modifier
// //           </Button>
// //           <Button 
// //             variant="danger" 
// //             size="sm"
// //             onClick={() => onCancel(reservation.id)}
// //             disabled={isCancelled || isPast}
// //           >
// //             Annuler
// //           </Button>
// //         </div>
// //       </td>
// //     </tr>
// //   );
// // }

// // function Pagination() {
// //   return (
// //     <div className="d-flex justify-content-between mt-3">
// //       <Button variant="outline-secondary" disabled>Précédent</Button>
// //       <div>
// //         {[1, 2, 3, 4, 5].map(page => (
// //           <Button key={page} variant="outline-primary" size="sm" className="mx-1">
// //             {page}
// //           </Button>
// //         ))}
// //       </div>
// //       <Button variant="outline-secondary" disabled>Suivant</Button>
// //     </div>
// //   );
// // }

// // export default Reservation;



// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import { logout } from '../../../services/AuthentificationService';


// // Styled Components
// const HeaderContainer = styled.header`
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     background: #fff;
//     height: 64px;
//     padding: 0 24px;
//     box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
//     position: sticky;
//     top: 0;
//     z-index: 100;
// `;

// const LeftSection = styled.div`
//     display: flex;
//     align-items: center;
// `;

// const CenterSection = styled.div`
//     flex: 1;
//     display: flex;
//     justify-content: center;
//     align-items: center;
// `;

// const RightSection = styled.div`
//     display: flex;
//     align-items: center;
// `;

// const BrandLogo = styled(Link)`
//     display: flex;
//     align-items: center;
//     font-size: 1.25rem;
//     font-weight: 700;
//     color: #25A55F;
//     text-decoration: none;
//     margin-right: 24px;
// `;

// const Logo = styled.div`
//     width: 32px;
//     height: 32px;
//     background-color: #25A55F;
//     border-radius: 6px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//     font-size: 1.2rem;
//     margin-right: 8px;
// `;

// const SearchBar = styled.div`
//     position: relative;
//     margin-left: 24px;
//     width: 240px;

//     @media (max-width: 768px) {
//         display: none;
//     }
// `;

// const SearchInput = styled.input`
//     width: 100%;
//     height: 36px;
//     background: #f5f5f5;
//     border: 1px solid #f0f0f0;
//     border-radius: 18px;
//     padding: 0 16px 0 36px;
//     font-size: 0.9rem;
//     color: #333;

//     &::placeholder {
//         color: #999;
//     }
// `;

// const SearchIcon = styled.div`
//     position: absolute;
//     left: 12px;
//     top: 50%;
//     transform: translateY(-50%);
//     color: #999;
//     font-size: 1rem;
// `;

// const Navigation = styled.nav`
//     display: flex;
//     align-items: center;
//     gap: 32px;

//     @media (max-width: 768px) {
//         display: none;
//     }
// `;

// const NavLink = styled(Link)`
//     text-decoration: none;
//     color: ${props => (props.scrolled ? '#333' : '#000')};
//     font-weight: 500;
//     transition: color 0.3s ease;
//     position: relative;
//     padding: 4px 0;

//     &:hover {
//         color: #25A55F;
//     }

//     &::after {
//         content: '';
//         position: absolute;
//         width: 0;
//         height: 2px;
//         bottom: -5px;
//         left: 0;
//         background-color: #25A55F;
//         transition: width 0.3s ease;
//     }

//     &:hover::after {
//         width: 100%;
//     }
// `;

// const ActionButtons = styled.div`
//     display: flex;
//     align-items: center;
//     margin-right: 16px;
// `;

// const ActionButton = styled.button`
//     background: transparent;
//     border: none;
//     width: 36px;
//     height: 36px;
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 1.1rem;
//     color: #666;
//     cursor: pointer;
//     margin-left: 8px;
//     position: relative;

//     &:hover {
//         background: #f5f5f5;
//         color: #333;
//     }
// `;

// const NotificationBadge = styled.div`
//     position: absolute;
//     top: -4px;
//     right: -4px;
//     width: 16px;
//     height: 16px;
//     border-radius: 50%;
//     background: #ff5252;
//     color: white;
//     font-size: 0.7rem;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border: 2px solid #fff;
// `;

// const UserProfile = styled.div`
//     display: flex;
//     align-items: center;
//     cursor: pointer;
//     padding: 4px 8px;
//     border-radius: 20px;

//     &:hover {
//         background: #f5f5f5;
//     }
// `;

// const Avatar = styled.img`
//     width: 36px;
//     height: 36px;
//     border-radius: 50%;
//     object-fit: cover;
//     margin-right: 8px;
// `;

// const UserInfo = styled.div`
//     display: flex;
//     flex-direction: column;

//     @media (max-width: 768px) {
//         display: none;
//     }
// `;

// const UserName = styled.span`
//     font-size: 0.9rem;
//     font-weight: 500;
//     color: #333;
// `;

// const UserRole = styled.span`
//     font-size: 0.75rem;
//     color: #888;
// `;

// const Dropdown = styled.div`
//     position: absolute;
//     top: 100%;
//     right: 0;
//     width: 220px;
//     background: white;
//     border-radius: 8px;
//     box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//     margin-top: 8px;
//     display: ${props => (props.show ? 'block' : 'none')};
// `;

// const DropdownHeader = styled.div`
//     padding: 12px 16px;
//     border-bottom: 1px solid #f0f0f0;
// `;

// const DropdownTitle = styled.h4`
//     margin: 0;
//     font-size: 0.85rem;
//     color: #999;
// `;

// const DropdownList = styled.div`
//     max-height: 200px;
//     overflow-y: auto;
// `;

// const NotificationItem = styled.div`
//     padding: 10px 16px;
//     display: flex;
//     align-items: center;

//     &:hover {
//         background: #fafafa;
//     }
// `;
// const NotificationLink = styled(Link)`
//   padding: 10px 16px;
//   display: flex;
//   align-items: center;
//   text-decoration: none;
//   color: inherit;

//   &:hover {
//     background: #fafafa;
//   }
// `;

// const NotificationIcon = styled.div`
//     margin-right: 12px;
// `;

// const NotificationContent = styled.div`
//     flex: 1;
// `;

// const NotificationTitle = styled.p`
//     margin: 0;
//     font-size: 0.85rem;
//     color: #333;
// `;

// const NotificationTime = styled.span`
//     font-size: 0.75rem;
//     color: #999;
// `;

// const DropdownFooter = styled.div`
//     padding: 8px 16px;
//     border-top: 1px solid #f0f0f0;
//     text-align: center;
// `;

// const ViewAllLink = styled(Link)`
//     font-size: 0.85rem;
//     color: #25A55F;
//     text-decoration: none;

//     &:hover {
//         text-decoration: underline;
//     }
// `;
// const ProfileImage = styled.img`
//   width: 36px;
//   height: 36px;
//   border-radius: 50%;
//   object-fit: cover;
//   border: 2px solid rgba(255, 255, 255, 0.5);
// `;
// const MenuButton = styled.button`
//   display: none;
//   background: transparent;
//   border: none;
//   font-size: 1.5rem;
//   margin-right: 16px;
//   cursor: pointer;

//   @media (max-width: 992px) {
//     display: flex;
//   }
// `;

// // AdminHeadr Component
// const Header = ({ toggleSidebar }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Scroll detection
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', onScroll);
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   // Mock notifications
//   useEffect(() => {
//     setNotifications([
//       { id: 1, title: 'Nouveau match planifié', time: '10 min' },
//       { id: 2, title: 'Résultat saisi', time: '2 h' }
//     ]);
//   }, []);

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClick = e => {
//       if (!e.target.closest('.dropdown')) {
//         setShowNotifications(false);
//         setShowUserMenu(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClick);
//     return () => document.removeEventListener('mousedown', handleClick);
//   }, []);
//   const userData = {
//     userId : localStorage.getItem("userId"),
//     firstName: localStorage.getItem("firstName"),
//     lastName: localStorage.getItem("lastName"),
//     photoProfil: localStorage.getItem("PhotoProfil"),
//     role: localStorage.getItem("role")
//   };

  
//   const handleLogout = async () => {
//      try {
//        await logout();
//        localStorage.clear();
//        navigate("/login");
//        window.location.reload(); // Pour s'assurer que tout l'état est réinitialisé
//      } catch (error) {
//        console.error("Erreur lors de la déconnexion:", error);
//      }
//    };


//      const profileImageUrl = userData.photoProfil 
//      ? `http://localhost:5021${userData.photoProfil}`
//      : 'https://via.placeholder.com/150';
 
  
//   const unread = notifications.length;

//   return (
//       <HeaderContainer>
//         <LeftSection>
//           <MenuButton onClick={toggleSidebar}>≡</MenuButton>
//           <BrandLogo to="/">
//             <Logo>⚽</Logo>
//             FUTSAL
//           </BrandLogo>
//           <SearchBar>
//             <SearchIcon>🔍</SearchIcon>
//             <SearchInput placeholder="Rechercher..." />
//           </SearchBar>
//         </LeftSection>

//         <CenterSection>
//           <Navigation>
//             <NavLink to="/team" scrolled={scrolled}>Équipe</NavLink>
//             <NavLink to="/challenges" scrolled={scrolled}>Défis</NavLink>
//             <NavLink to="/matches" scrolled={scrolled}>Matchs</NavLink>
//             <NavLink to="/reservation" scrolled={scrolled}>Réservation</NavLink>
//           </Navigation>
//         </CenterSection>

//         <RightSection>
//           <ActionButtons>
//             <ActionButton className="dropdown" onClick={() => setShowNotifications(!showNotifications)}>
//               🔔{unread > 0 && <NotificationBadge>{unread}</NotificationBadge>}
//             </ActionButton>
//             <ActionButton onClick={() => window.location.reload()}>🔄</ActionButton>
//             <ActionButton as={Link} to="/">🌐</ActionButton>
//           </ActionButtons>

          

//           <UserProfile
//               className="dropdown-container"
//               onClick={() => {
//                 setShowUserMenu(!showUserMenu);
//                 setShowNotifications(false);
//               }}
//           >
//           <ProfileImage 
//                   src={profileImageUrl} 
//                   alt="Profile"
//                   onError={(e) => {
//                     e.target.src = 'https://via.placeholder.com/150';
//                   }}
//                 />
//                             <UserInfo>

//               <UserName>{userData.firstName} {userData.lastName}</UserName>
//               <UserRole>{userData.role}</UserRole>
//               </UserInfo>
//           </UserProfile>
          
//           {/* Dropdown Notifications */}
//           <Dropdown show={showNotifications} className="dropdown-container">
//             <DropdownHeader>
//               <DropdownTitle>Notifications</DropdownTitle>
//             </DropdownHeader>

//             <DropdownList>
//               {notifications.length === 0 ? (
//                   <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
//                     Aucune notification
//                   </div>
//               ) : (
//                   notifications.map(notification => (
//                       <NotificationItem key={notification.id}>
//                         <NotificationIcon>{notification.icon}</NotificationIcon>
//                         <NotificationContent>
//                           <NotificationTitle>{notification.title}</NotificationTitle>
//                           <NotificationTime>{notification.time}</NotificationTime>
//                         </NotificationContent>
//                       </NotificationItem>
//                   ))
//               )}
//             </DropdownList>

//             <DropdownFooter>
//               <ViewAllLink to="/admin/notifications">Voir toutes les notifications</ViewAllLink>
//             </DropdownFooter>
//           </Dropdown>

//           {/* Dropdown Menu Utilisateur */}
//           <Dropdown show={showUserMenu} className="dropdown-container">
//             <DropdownList>
//               <NotificationItem as={Link} to={`/modifier-profil/${userData.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              

//                 <NotificationIcon>👤</NotificationIcon>
//                 <NotificationContent>
//                   <NotificationTitle>Mon profil</NotificationTitle>
//                 </NotificationContent>
//               </NotificationItem>
//               <NotificationItem style={{ cursor: 'pointer' }} onClick={handleLogout}>
//                 <NotificationIcon style={{ background: '#ffebee', color: '#f44336' }}>🚪</NotificationIcon>
//                 <NotificationContent>
//                   <NotificationTitle>Déconnexion</NotificationTitle>
//                 </NotificationContent>
//               </NotificationItem>
//             </DropdownList>
//           </Dropdown>
//         </RightSection>
//       </HeaderContainer
//   );
// };

// export default Header;import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as THREE from 'three';
import React, { useState, useEffect, useRef } from 'react';

import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Styled Components
const LoginContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('/futsal-stadium.jpg');
    background-size: cover;
    background-position: center;
    overflow: hidden;
`;

const BallContainer = styled.div`
    position: absolute;
    width: 300px;
    height: 300px;
    top: 50%;
    left: 25%;
    transform: translate(-50%, -50%);
    z-index: 1;

    @media (max-width: 992px) {
        width: 200px;
        height: 200px;
        top: 25%;
        left: 50%;
    }
`;

const LoginCard = styled.div`
    width: 100%;
    max-width: 450px;
    padding: 40px;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    margin-left: auto;
    margin-right: 10%;
    z-index: 2;

    @media (max-width: 992px) {
        margin: 20px;
        margin-top: 120px;
    }
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
`;

const Logo = styled.div`
    width: 60px;
    height: 60px;
    background-color: #25A55F;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 30px;
    font-weight: bold;
    margin-right: 16px;
`;

const LogoText = styled.h1`
    font-size: 1.8rem;
    font-weight: 700;
    color: #25A55F;
    margin: 0;
`;

const Title = styled.h2`
    text-align: center;
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 30px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 0.9rem;
    font-weight: 500;
    color: #555;
`;

const Input = styled.input`
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;

    &:focus {
        border-color: #25A55F;
        box-shadow: 0 0 0 2px rgba(37, 165, 95, 0.2);
        outline: none;
    }
`;

const RememberMeRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
`;

const CheckboxGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Checkbox = styled.input`
    accent-color: #25A55F;
    width: 16px;
    height: 16px;
`;

const ForgotPasswordLink = styled.a`
    color: #25A55F;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const LoginButton = styled.button`
    background-color: #25A55F;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 14px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-top: 10px;

    &:hover {
        background-color: #1c8048;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.div`
    background-color: #fdeded;
    color: #f44336;
    padding: 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    margin-bottom: 10px;
`;

const RegisterPrompt = styled.div`
    text-align: center;
    margin-top: 30px;
    font-size: 0.9rem;
    color: #555;

    a {
        color: #25A55F;
        text-decoration: none;
        font-weight: 500;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const Footer = styled.div`
    text-align: center;
    margin-top: 30px;
    font-size: 0.85rem;
    color: #888;
`;
const API_URL = "http://localhost:5021/api/Auth/login";

// Composant principal de Login
const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
 const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    login: "", 
    MotDePasse: "" 
  });
  const [isLoading, setIsLoading] = useState(false);

  // Canvas pour la balle 3D
  const canvasRef = useRef(null);

  // Initialisation de la balle 3D avec Three.js
  useEffect(() => {
    if (!canvasRef.current) return;

    // Configuration de base
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);

    // Éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // Fonction pour créer un ballon de futsal simplifié
    const createFutsalBall = () => {
      const ballGroup = new THREE.Group();

      // Sphère principale (blanche)
      const geometry = new THREE.SphereGeometry(1.4, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.3,
        metalness: 0.2
      });

      const ball = new THREE.Mesh(geometry, material);
      ballGroup.add(ball);

      // Motifs noirs (version simplifiée)
      const patchGeometry = new THREE.CircleGeometry(0.35, 5);
      const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

      // Positions des motifs (simplifiées)
      const positions = [
        { x: 0, y: 0, z: 1.42 },
        { x: 1.3, y: 0.4, z: 0.5 },
        { x: -1.3, y: 0.4, z: 0.5 },
        { x: 0, y: -1.4, z: 0.4 },
        { x: 0.8, y: -0.8, z: -0.9 },
        { x: -0.8, y: -0.8, z: -0.9 },
        { x: 0, y: 0.8, z: -1.2 }
      ];

      // Ajouter les motifs noirs
      positions.forEach(pos => {
        const patch = new THREE.Mesh(patchGeometry, blackMaterial);
        patch.position.set(pos.x, pos.y, pos.z);
        patch.lookAt(0, 0, 0);
        ballGroup.add(patch);
      });

      return ballGroup;
    };

    // Créer et ajouter le ballon
    const ball = createFutsalBall();
    scene.add(ball);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotation simple sur place
      ball.rotation.y += 0.01;
      ball.rotation.x += 0.005;

      renderer.render(scene, camera);
    };

    // Ajuster la taille du canvas si la fenêtre change
    const handleResize = () => {
      const container = canvasRef.current.parentElement;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    // Écouter les changements de taille
    window.addEventListener('resize', handleResize);
    handleResize();

    // Démarrer l'animation
    animate();

    // Nettoyage à la destruction du composant
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  
        if (role === "Admin") {
          redirectByRole("Admin");
        } else if (role === "Joueur") {
          const isCapitan = decoded.IsCapitaine === "True" || decoded.IsCapitaine === true;
          if (isCapitan) {
            redirectByRole("Capitaine");
          } else {
            redirectByRole("Joueur");
          }
        } else {
          navigate("/unauthorized");
        }
      } catch (error) {
        console.error("Token invalide:", error);
        handleLogout();
      }
    }
  }, [navigate]);

  const redirectByRole = (role) => {
    const routes = {
      Admin: "/Admin/AdminLayout",
      Capitaine: "/reservations",
      Joueur: "/joueur",
    };
    const route = routes[role] || "/profile"; // Default to profile if no role matched
    navigate(route);
  };
  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));

    // Effacer les erreurs quand l'utilisateur commence à taper
    if (error) setError(null);
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError(null);

    try {
     const response = await axios.post(API_URL, formData);
      const { token } = response.data;
      const decoded = jwtDecode(token);
  
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const isCapitan = decoded.IsCapitaine === "True" || decoded.IsCapitaine === true;
  
      storeAuthData(token, decoded, isCapitan);
  
      if (role === "Admin") {
        redirectByRole("Admin");
      } else if (role === "Joueur") {
        redirectByRole(isCapitan ? "Capitaine" : "Joueur");
      } else {
        navigate("/unauthorized");
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  const storeAuthData = (token, decoded, isCapitan) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", decoded.nameid || decoded.sub);
    localStorage.setItem("firstName", decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] || "");
    localStorage.setItem("lastName", decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"] || "");
    localStorage.setItem("role", decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "");
    localStorage.setItem("PhotoProfil", decoded.PhotoProfil || "");
    localStorage.setItem("isCapitan", isCapitan); // Assurez-vous que isCapitan est bien défini
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
      <LoginContainer>
        {/* Conteneur pour la balle 3D */}
        <BallContainer>
          <canvas ref={canvasRef} />
        </BallContainer>

        {/* Carte de connexion */}
        <LoginCard>
          <LogoContainer>
            <Logo>⚽</Logo>
            <LogoText>FUTSAL CENTER</LogoText>
          </LogoContainer>

          <Title>Connexion à votre compte</Title>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Votre adresse email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Votre mot de passe"
                  value={credentials.password}
                  onChange={handleChange}
                  required
              />
            </FormGroup>

            <RememberMeRow>
              <CheckboxGroup>
                <Checkbox
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                />
                <Label htmlFor="rememberMe" style={{ margin: 0 }}>Se souvenir de moi</Label>
              </CheckboxGroup>

              <ForgotPasswordLink href="#">Mot de passe oublié?</ForgotPasswordLink>
            </RememberMeRow>

            <LoginButton type="submit" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </LoginButton>
          </Form>

          <RegisterPrompt>
            Pas encore de compte? <a href="#">S'inscrire</a>
          </RegisterPrompt>

          <Footer>
            © 2025 Futsal Center | Tous droits réservés
          </Footer>
        </LoginCard>
      </LoginContainer>
  );
};

export default LoginPage;