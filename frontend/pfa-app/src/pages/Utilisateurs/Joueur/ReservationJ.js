import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Tab, Tabs } from 'react-bootstrap';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import Header from '../Capitaine/Header';
import ActionButtons from '../../../components/ActionButtons'; // Chemin relatif à adapter selon ton projet

const localizer = momentLocalizer(moment);

function ReservationJ() {
  const [date, setDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [terrain, setTerrain] = useState('Tous');
  const [terrains, setTerrains] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [newReservation, setNewReservation] = useState({});
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Sélection de la date depuis le calendrier
  const handleSelectDate = (selected) => {
    const selectedJSDate = new Date(selected);
    const formatted = moment(selectedJSDate).format('YYYY-MM-DD');
    setDate(formatted);
    setSelectedDate(moment(selectedJSDate).format('DD/MM/YYYY'));
    fetchCreneaux(formatted);
  };

  // Récupérer les créneaux disponibles pour une date donnée
  const fetchCreneaux = async (selectedDateISO) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:8080/api/creneaux/creneaux?date=${selectedDateISO}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCreneaux(response.data);
    } catch (err) {
      console.error('Erreur API:', err);
      alert('Une erreur est survenue lors de la récupération des créneaux.');
    }
  };

  // Récupérer la liste des terrains disponibles
  const fetchTerrains = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/terrains");
      setTerrains(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des terrains :", error);
    }
  };

  // Récupérer les réservations de l'utilisateur
  const fetchReservations = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    // alert("Vous devez être authentifié pour faire une réservation.");

    try {
      const response = await axios.get(
        'http://localhost:8080/api/reservations/user',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setReservations(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations :", error);
    }
  };

  // Soumettre la réservation
  // const submitReservation = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     alert("Vous devez être authentifié pour faire une réservation.");
  //     return;
  //   }
  
  //   try {
  //     await axios.post(
  //       'http://localhost:8080/api/reservations',
  //       {
  //         date: newReservation.date,
  //         startTime: newReservation.startTime,
  //         endTime: newReservation.endTime,
  //         terrainId: newReservation.terrainId,
  //         utilisateurId: 82 // À remplacer selon l'authentification
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           'Content-Type': 'application/json',
  //         }
  //       }
  //     );
  
  //     alert("Réservation réussie !");
  //     fetchReservations(); // Rafraîchir la liste des réservations
  //     setNewReservation({}); // Réinitialiser la nouvelle réservation
  //   } catch (error) {
  //     console.error("Erreur lors de la réservation :", error);
  //     alert("Une erreur est survenue lors de la réservation !");
  //   }
  // };
  const submitReservation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être authentifié pour faire une réservation.");
      return;
    }
  
    try {
      await axios.post(
        'http://localhost:8080/api/reservations',
        {
          idUtilisateur: 82, // à adapter selon ton auth réelle
          creneauId: newReservation.creneauId // DOIT être défini ci-dessous
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
  
      alert("Réservation réussie !");
      fetchReservations();
      setNewReservation({});
    }catch (error) {
      console.error("Erreur lors de la réservation :", error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        alert("Vous devez être authentifié pour faire une réservation.");
      } else if (error.response?.status === 400) {
        alert("Erreur de réservation : Créneau ou données invalides.");
      } else {
        alert("Une erreur inconnue est survenue !");
      }
    }
    
      
  };
  

  // Annuler une réservation
  const cancelReservation = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/reservations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Réservation annulée avec succès !");
      fetchReservations(); // Rafraîchir la liste des réservations
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
      alert("Une erreur est survenue lors de l'annulation !");
    }
  };

  useEffect(() => {
    fetchTerrains();
    fetchReservations();
  }, []);

  useEffect(() => {
    if (date) fetchCreneaux(date);
  }, [terrain]);
  useEffect(() => {
    // Données de test statiques
    const mockData = [
      {
        id: 1,
        date: '2025-04-30',
        startTime: '14:00',
        endTime: '15:00',
        status: 'Confirmée',
        terrain: { nom: 'Terrain Foot 1' }
      },
      {
        id: 2,
        date: '2025-04-20',
        startTime: '10:00',
        endTime: '11:00',
        status: 'Confirmée',
        terrain: { nom: 'Terrain Foot 2' }
      },
      {
        id: 3,
        date: '2025-05-05',
        startTime: '16:00',
        endTime: '17:00',
        status: 'En attente',
        terrain: { nom: 'Terrain Foot 3' }
      }
    ];
    setReservations(mockData);
  }, []);
  
  // Filtrer les réservations selon l'onglet sélectionné
  const filteredReservations = () => {
    const now = new Date();
    switch (activeTab) {
      case 'upcoming':
        return reservations.filter(r => new Date(r.date + 'T' + r.startTime) > now);
      case 'past':
        return reservations.filter(r => new Date(r.date + 'T' + r.startTime) < now);
      case 'pending':
        return reservations.filter(r => r.status === 'En attente');
      default:
        return reservations;
    }
  };

  return (
    <>
      {/* <Header />  */}

      <Container className="mt-4">
        <Row>
          <Col>
            <h2 className="text-center mb-4">Vérifier les disponibilités</h2>

            {/* Card pour le calendrier */}
            <Card className="m-3 shadow-lg rounded">
              <Row>
                <Col md={6}>
                  <Card className="m-4">
                    <BigCalendar
                      localizer={localizer}
                      events={[]}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: 400 }}
                      views={['month']}
                      defaultView="month"
                      selectable
                      onSelectSlot={({ start }) => handleSelectDate(start)}
                      onSelecting={({ start }) => {
                        const now = new Date();
                        now.setHours(0, 0, 0, 0);
                        return start >= now;
                      }}
                      dayPropGetter={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (date < today) {
                          return {
                            style: {
                              backgroundColor: '#e0e0e0',
                              color: '#999',
                              pointerEvents: 'none',
                              cursor: 'not-allowed'
                            }
                          };
                        }
                        return {};
                      }}
                    />
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="m-4">
                    <h5 className="m-3">Recherche Rapide</h5>
                    <Form.Group className="m-3 d-flex align-items-center">
                      <Form.Label className="mb-0 me-2">Date:</Form.Label>
                      <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          const frDate = moment(e.target.value).format('DD/MM/YYYY');
                          setSelectedDate(frDate);
                          fetchCreneaux(e.target.value);
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="m-3 d-flex align-items-center">
                      <Form.Label className="mb-0 me-2">Terrain:</Form.Label>
                      <Form.Select
                        value={terrain}
                        onChange={(e) => setTerrain(e.target.value)}
                      >
                        <option value="Tous">Tous</option>
                        {terrains.map((t) => (
                          <option key={t.id} value={t.id}>{t.nom}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Card>
                </Col>
              </Row>
            </Card>

            {/* Créneaux disponibles */}
            <Card className="m-3 shadow-lg rounded">
              <Row>
                <Col>
                  <h5 className="m-4">Créneaux disponibles pour le {selectedDate}</h5>
                  <Card className="m-3 p-3">
                    {terrains
                      .filter(t => terrain === 'Tous' || terrain === String(t.id))
                      .map(t => {
                        const terrainCreneaux = creneaux.filter(c => c.terrain.id === t.id);
                        return (
                          <div key={t.id} className="mb-4">
                            <h6 className="mb-2 text-success">{t.nom}</h6>
                            {terrainCreneaux.length === 0 ? (
                              <p>Aucun créneau disponible</p>
                            ) : (
                              <div className="d-flex flex-wrap gap-3">
                                {terrainCreneaux.map((c, idx) => {
                                  const heureDebut = moment(c.dateHeureDebut).format('HH:mm');
                                  const heureFin = moment(c.dateHeureFin).format('HH:mm');

                                  return (
                                    <Button
                                      key={idx}
                                      variant="outline-success"
                                      size="sm"
                                      className="hover-shadow"
                                      onClick={() =>
                                        setNewReservation({
                                          ...newReservation,
                                          creneauId: c.id, // ✅ Ajouté ici
                                          date: c.date,
                                          startTime: c.dateHeureDebut,
                                          endTime: c.dateHeureFin,
                                          terrainId: c.terrain.id
                                        })
                                      }
                                    >
                                      <Card.Text>{heureDebut} - {heureFin}</Card.Text>
                                    </Button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {newReservation.terrainId && (
                      <>
                        <div className="text-end mt-3">
                          <Button
                            variant="success"
                            onClick={submitReservation}
                            disabled={!newReservation.date || !newReservation.startTime || !newReservation.terrainId}
                          >
                            Réserver
                          </Button>
                        </div>
                        <Card.Text className="mt-2">
                          Vous allez réserver le <strong>{moment(newReservation.date).format('DD/MM/YYYY')}</strong> de <strong>{moment(newReservation.startTime).format('HH:mm')}</strong> à <strong>{moment(newReservation.endTime).format('HH:mm')}</strong> sur le <strong>{terrains.find(t => t.id === newReservation.terrainId)?.nom}</strong>.
                        </Card.Text>
                      </>
                    )}
                  </Card>
                </Col>
              </Row>
            </Card>

            {/* Mes réservations */}
            <Card className="m-3 shadow-lg rounded">
              <Card.Body>
                <h5 className="mb-4">Mes réservations</h5>
                
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-3"
                >
                  <Tab eventKey="upcoming" title="À venir" />
                  <Tab eventKey="past" title="Passées" />
                  <Tab eventKey="pending" title="En attente" />
                  <Tab eventKey="all" title="Toutes" />
                </Tabs>

                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Heure</th>
                      <th>Terrain</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations().length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">Aucune réservation trouvée</td>
                      </tr>
                    ) : (
                      filteredReservations().map((reservation) => (
                        <tr key={reservation.id}>
                          <td>{moment(reservation.date).format('DD/MM/YYYY')}</td>
                          <td>{reservation.startTime} - {reservation.endTime}</td>
                          <td>Terrain {reservation.terrain?.nom || reservation.terrainId}</td>
                          <td>{reservation.status || 'Confirmé'}</td>
                          <td>
                          <ActionButtons
  onView={(reservation) => console.log('Voir', reservation)}
  onEdit={(reservation) => console.log('Modifier', reservation)}
  onDelete={(id) => (id)} // Tu peux personnaliser cette fonction
  item={reservation}
/>

                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-between mt-3">
                  <Button variant="outline-secondary" disabled>
                    Précédent
                  </Button>
                  <div>
                    <Button variant="outline-primary" size="sm" className="mx-1">1</Button>
                    <Button variant="outline-primary" size="sm" className="mx-1">2</Button>
                    <Button variant="outline-primary" size="sm" className="mx-1">3</Button>
                    <Button variant="outline-primary" size="sm" className="mx-1">4</Button>
                    <Button variant="outline-primary" size="sm" className="mx-1">5</Button>
                  </div>
                  <Button variant="outline-secondary" disabled>
                    Suivant
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ReservationJ;



// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Form, Button, Table, Tab, Tabs } from 'react-bootstrap';
// import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode'; // ✅ Fonctionne

// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import Header from './Header';
// import ActionButtons from '../../../components/ActionButtons';

// const localizer = momentLocalizer(moment);

// function Reservation() {
//   const [date, setDate] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [terrain, setTerrain] = useState('Tous');
//   const [terrains, setTerrains] = useState([]);
//   const [creneaux, setCreneaux] = useState([]);
//   const [newReservation, setNewReservation] = useState({});
//   const [reservations, setReservations] = useState([]);
//   const [activeTab, setActiveTab] = useState('upcoming');

//   const handleSelectDate = (selected) => {
//     const selectedJSDate = new Date(selected);
//     const formatted = moment(selectedJSDate).format('YYYY-MM-DD');
//     setDate(formatted);
//     setSelectedDate(moment(selectedJSDate).format('DD/MM/YYYY'));
//     fetchCreneaux(formatted);
//   };

//   const fetchCreneaux = async (selectedDateISO) => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/creneaux/creneaux?date=${selectedDateISO}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       setCreneaux(response.data);
//       console.log("Créneaux récupérés :", creneaux);
//       console.log("Appel API créneaux pour la date :", selectedDateISO);

//     } catch (err) {
//       console.error('Erreur API:', err);
//       alert('Une erreur est survenue lors de la récupération des créneaux.');
//     }
//   };

//   const fetchTerrains = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/terrains");
//       setTerrains(response.data);
//     } catch (error) {
//       console.error("Erreur lors du chargement des terrains :", error);
//     }
//   };

//   const fetchReservations = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const response = await axios.get(
//         'http://localhost:8080/api/reservations/user',
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       setReservations(response.data);
//     } catch (error) {
//       console.error("Erreur lors du chargement des réservations :", error);
//     }
//   };

//   const submitReservation = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Vous devez être authentifié pour faire une réservation.");
//       return;
//     }
  
//     try {
//       await axios.post(
//         'http://localhost:8080/api/reservations',
//         {
//           creneauId: newReservation.creneauId,
//           utilisateurId: 82 // Remplace avec l'ID réel ou décode le JWT
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           }
//         }
//       );
  
//       alert("Réservation réussie !");
//       fetchReservations();
//       setNewReservation({});
//     } catch (error) {
//       console.error("Erreur lors de la réservation :", error);
//       alert("Une erreur est survenue lors de la réservation !");
//     }
//   };
  
//   const cancelReservation = async (id) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
//       return;
//     }

//     try {
//       await axios.delete(
//         `http://localhost:8080/api/reservations/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       alert("Réservation annulée avec succès !");
//       fetchReservations();
//     } catch (error) {
//       console.error("Erreur lors de l'annulation :", error);
//       alert("Une erreur est survenue lors de l'annulation !");
//     }
//   };

//   useEffect(() => {
//     fetchTerrains();
//     fetchReservations();
//   }, []);

//   useEffect(() => {
//     if (date) fetchCreneaux(date);
//   }, [terrain]);

//   const filteredReservations = () => {
//     const now = new Date();
//     switch (activeTab) {
//       case 'upcoming':
//         return reservations.filter(r => new Date(r.date + 'T' + r.startTime) > now);
//       case 'past':
//         return reservations.filter(r => new Date(r.date + 'T' + r.startTime) < now);
//       case 'pending':
//         return reservations.filter(r => r.status === 'En attente');
//       default:
//         return reservations;
//     }
//   };

//   return (
//     <>
//       <Header />
//       <Container className="mt-4">
//         <Row>
//           <Col>
//             <Card className="m-3 shadow-lg rounded">
//               <Row>
//                 <Col md={6}>
//                   <Card className="m-4">
//                     <BigCalendar
//                       localizer={localizer}
//                       events={[]}
//                       startAccessor="start"
//                       endAccessor="end"
//                       style={{ height: 400 }}
//                       views={['month']}
//                       defaultView="month"
//                       selectable
//                       onSelectSlot={({ start }) => handleSelectDate(start)}
//                       onSelecting={({ start }) => {
//                         const now = new Date();
//                         now.setHours(0, 0, 0, 0);
//                         return start >= now;
//                       }}
//                       dayPropGetter={(date) => {
//                         const today = new Date();
//                         today.setHours(0, 0, 0, 0);
//                         if (date < today) {
//                           return {
//                             style: {
//                               backgroundColor: '#e0e0e0',
//                               color: '#999',
//                               pointerEvents: 'none',
//                               cursor: 'not-allowed'
//                             }
//                           };
//                         }
//                         return {};
//                       }}
//                     />
//                   </Card>
//                 </Col>
//                 <Col md={6}>
//                   <Card className="m-4">
//                     <Form.Group className="m-3 d-flex align-items-center">
//                       <Form.Label className="mb-0 me-2">Date:</Form.Label>
//                       <Form.Control
//                         type="date"
//                         value={date}
//                         onChange={(e) => {
//                           setDate(e.target.value);
//                           const frDate = moment(e.target.value).format('DD/MM/YYYY');
//                           setSelectedDate(frDate);
//                           fetchCreneaux(e.target.value);
//                         }}
//                       />
//                     </Form.Group>

//                     <Form.Group className="m-3 d-flex align-items-center">
//                       <Form.Label className="mb-0 me-2">Terrain:</Form.Label>
//                       <Form.Select
//                         value={terrain}
//                         onChange={(e) => setTerrain(e.target.value)}
//                       >
//                         <option value="Tous">Tous</option>
//                         {terrains.map((t) => (
//                           <option key={t.id} value={t.id}>{t.nom}</option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Card>
//                 </Col>
//               </Row>
//             </Card>

//             <Card className="m-3 shadow-lg rounded">
//               <Row>
//                 <Col>
//                 <Card className="m-3 p-3">
//   {terrains
//     .filter(t => terrain === 'Tous' || terrain === String(t.id))
//     .map(t => {
//       const terrainCreneaux = creneaux.filter(c => c.terrain.id === t.id);
//       return (
//         <div key={t.id} className="mb-4">
//           <h6 className="mb-2 text-success">{t.nom}</h6>
//           {terrainCreneaux.length === 0 ? (
//             <p>Aucun créneau disponible</p>
//           ) : (
//             <div className="d-flex flex-wrap gap-3">
//               {terrainCreneaux.map((c, idx) => {
//                 const heureDebut = moment(c.dateHeureDebut).format('HH:mm');
//                 const heureFin = moment(c.dateHeureFin).format('HH:mm');

//                 return (
//                   <Button
//                     key={idx}
//                     variant="outline-success"
//                     size="sm"
//                     className="hover-shadow"
//                     onClick={() => {
//                       setNewReservation({
//                         creneauId: c.creneauId ?? c.id ?? c._id, // essaie différentes clés selon ta réponse API
//                         date: c.date,
//                         startTime: c.dateHeureDebut,
//                         endTime: c.dateHeureFin,
//                         terrainId: c.terrain.id,
//                       });
//                       console.log("Créneau brut :", c);

//                       console.log("Créneau sélectionné :", {
//                         creneauId: c.id,
//                         date: c.date,
//                         startTime: c.dateHeureDebut,
//                         endTime: c.dateHeureFin,
//                         terrainId: c.terrain.id,
//                       });
//                     }}
                    
//                   >
//                     {heureDebut} - {heureFin}
//                   </Button>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       );
//     })}

//   {newReservation?.terrainId && newReservation?.startTime && newReservation?.creneauId && (
//     <>
//       <div className="text-end mt-3">
//         <Button
//           variant="success"
//           onClick={submitReservation}
//           disabled={!newReservation.date || !newReservation.startTime || !newReservation.terrainId}
//         >
//           Réserver
//         </Button>
//       </div>
//       <Card.Text className="mt-2">
//         Vous allez réserver le <strong>{moment(newReservation.date).format('DD/MM/YYYY')}</strong> de <strong>{moment(newReservation.startTime).format('HH:mm')}</strong> à <strong>{moment(newReservation.endTime).format('HH:mm')}</strong> sur le <strong>{terrains.find(t => t.id === newReservation.terrainId)?.nom}</strong>.
//       </Card.Text>
//     </>
//   )}
// </Card>

//                 </Col>
//               </Row>
//             </Card>

//             <Card className="m-3 shadow-lg rounded">
//               <Card.Body>
//                 <h5 className="mb-4">Mes réservations</h5>
//                 <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
//                   <Tab eventKey="upcoming" title="À venir" />
//                   <Tab eventKey="past" title="Passées" />
//                   <Tab eventKey="pending" title="En attente" />
//                   <Tab eventKey="all" title="Toutes" />
//                 </Tabs>

//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Date</th>
//                       <th>Heure</th>
//                       <th>Terrain</th>
//                       <th>Statut</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredReservations().length === 0 ? (
//                       <tr>
//                         <td colSpan="5" className="text-center">Aucune réservation trouvée</td>
//                       </tr>
//                     ) : (
//                       filteredReservations().map((reservation) => (
//                         <tr key={reservation.id}>
//                           <td>{moment(reservation.date).format('DD/MM/YYYY')}</td>
//                           <td>{reservation.startTime} - {reservation.endTime}</td>
//                           <td>{reservation.terrain?.nom || 'N/A'}</td>
//                           <td>{reservation.status || 'Confirmé'}</td>
//                           <td>
//                             <ActionButtons
//                               item={reservation}
//                               onView={() => console.log('Voir', reservation)}
//                               onEdit={() => console.log('Modifier', reservation)}
//                               onDelete={() => cancelReservation(reservation.id)}
//                             />
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </Table>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// }

// export default Reservation;
