import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Tab, Tabs } from 'react-bootstrap';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Header from './Header';
import ActionButtons from '../../../components/ActionButtons';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

const localizer = momentLocalizer(moment);

function Reservation() {
  const [date, setDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [terrain, setTerrain] = useState('Tous');
  const [terrains, setTerrains] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [newReservation, setNewReservation] = useState({});
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedCreneau, setSelectedCreneau] = useState(null); // ✅
  const utilisateurId = localStorage.getItem('userId'); 
  const token = localStorage.getItem('token');
  
  const handleSelectDate = (selected) => {
    const selectedJSDate = new Date(selected);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset heures
  
    if (selectedJSDate < today) {
      // ignore la sélection des dates passées
      return;
    }
  
    const formatted = moment(selectedJSDate).format('YYYY-MM-DD');
    setDate(formatted);
    setSelectedDate(moment(selectedJSDate).format('DD/MM/YYYY'));
    fetchCreneaux(formatted);
  };
  

  const fetchCreneaux = async (selectedDateISO) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/creneaux/cre?date=${selectedDateISO}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCreneaux(response.data);
    } catch (err) {
      console.error('Erreur API:', err.response ? err.response.data : err.message);
      alert('Erreur lors de la récupération des créneaux.');
    }
  };
  

  const fetchTerrains = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/terrains");
      setTerrains(response.data);
    } catch (error) {
      console.error("Erreur chargement terrains:", error);
    }
  };

  const fetchReservations = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get(
        'http://localhost:8080/api/reservations/user',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setReservations(response.data);
    } catch (error) {
      console.error("Erreur chargement réservations:", error);
    }
  };
  const handleReservationClick = (reservation = newReservation) => {
    console.log('handleReservationClick - reservation:', reservation);
  
    if (!reservation || !reservation.creneauId) {
      toast.error("Veuillez sélectionner un créneau avant de réserver.");
      return;
    }
  
    submitReservation(reservation);
  };
  
  const submitReservation = async (reservation = newReservation) => {
    if (!reservation || !reservation.creneauId) {
      toast.error('Veuillez sélectionner un créneau avant de réserver.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:8080/api/reservations',
        {
          idUtilisateur: utilisateurId,
          creneauId: reservation.creneauId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Réservation réussie !');
      setNewReservation({});
      fetchReservations();
    } catch (error) {
      console.error(error);
      toast.error('Déja réservé.');
    }
  };
  

  const parseJwt = (token) => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Erreur décodage token:', error);
      return null;
    }
  };

  const cancelReservation = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!window.confirm("Confirmer l'annulation ?")) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/reservations/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Réservation annulée !");
      fetchReservations();
    } catch (error) {
      console.error("Erreur annulation:", error);
      alert("Erreur pendant l'annulation.");
    }
  };

  useEffect(() => {
    fetchTerrains();
    fetchReservations();
  }, []);

  useEffect(() => {
    if (date) fetchCreneaux(date);
  }, [terrain, date]);

  const filteredReservations = () => {
    const now = new Date();
  
    switch (activeTab) {
      case 'upcoming':
        return reservations.filter(res =>
          new Date(res.creneau?.dateHeureDebut) > now
        );
  
      case 'past':
        return reservations.filter(res =>
          new Date(res.creneau?.dateHeureDebut) <= now
        );
  
      case 'pending':
        return reservations.filter(res =>
          res.statut === 'EN_ATTENTE'
        );
  
      default:
        return}
      };

  return (
    <>
      <Header />

      <Container className="mt-4">
        <Row>
          <Col>
            <h2 className="text-center mb-4">Vérifier les disponibilités</h2>

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
                      selectable
                      onSelectSlot={({ start }) => handleSelectDate(start)}
                      onSelecting={({ start }) => start >= new Date()}
                      dayPropGetter={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // ignore l'heure
                        const cellDate = new Date(date);
                        cellDate.setHours(0, 0, 0, 0);
                      
                        if (cellDate < today) {
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
                    <Form.Group className="m-3">
  <Form.Label>Date:</Form.Label>
  <Form.Control
    type="date"
    min={new Date().toISOString().split('T')[0]} // Empêche la sélection des dates passées
    value={date}
    onChange={(e) => {
      setDate(e.target.value);
      setSelectedDate(moment(e.target.value).format('DD/MM/YYYY'));
      fetchCreneaux(e.target.value);
    }}
  />
</Form.Group>


                    <Form.Group className="m-3">
                      <Form.Label>Terrain:</Form.Label>
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
                                {terrainCreneaux.map((c, idx) => (
                              <Button
                              key={idx}
                              variant="outline-success"
                              size="sm"
                              onClick={() =>
                                setNewReservation({
                                  creneauId: c.id,
                                  date: c.date,
                                  startTime: c.dateHeureDebut,
                                  endTime: c.dateHeureFin,
                                  terrainId: c.terrain.id
                                })
                              }
                            >
                              {moment(c.dateHeureDebut).format('HH:mm')} - {moment(c.dateHeureFin).format('HH:mm')}
                            </Button>
                            
                              
                                ))}
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
  onClick={() => handleReservationClick()}
  disabled={!newReservation.date}
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
              <td>{moment(reservation.creneau?.dateHeureDebut).format('DD/MM/YYYY')}</td>
              <td>
                {moment(reservation.creneau?.dateHeureDebut).format('HH:mm')} - 
                {moment(reservation.creneau?.dateHeureFin).format('HH:mm')}
              </td>
              <td>{reservation.creneau?.terrain?.nom || reservation.creneau?.terrainId}</td>
              <td>{reservation.statut || 'Confirmé'}</td>
              <td>
                <ActionButtons
                  onView={() => console.log('Voir', reservation)}
                  onEdit={() => console.log('Modifier', reservation)}
                  onDelete={() => cancelReservation(reservation.id)}
                  item={reservation}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  </Card.Body>
</Card>

          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Reservation;

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
