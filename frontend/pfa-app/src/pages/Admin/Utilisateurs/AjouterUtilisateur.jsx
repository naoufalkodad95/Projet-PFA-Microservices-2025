import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { MdCameraAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AdminLayout from '../AdminLayout';

const API_URL = "http://localhost:5021/api/Utilisateurs";

const AjouterUtilisateur = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateDeNaissance: "",
    cin: "",
    email: "",
    telephone: "",
    adresse: "",
    login: "",
    MotDePasse: "",
    Confirmation: "",
    TypeUtilisateur: "",
    IsCapitaine: false,
    NbrMarquer: "",
    Niveau: "",
    PositionPreferee: ""
  });
  const Navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const positions = ['Attaquant', 'Défenseur', 'Milieu', 'Gardien'];
  const niveaux = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
  const userRole = localStorage.getItem("role");

  // Vérifier si le composant est rechargé à chaque interaction
  useEffect(() => {
    console.log("🔄 Composant monté !");
  }, []);

  // Gérer le changement des inputs texte
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gérer l'upload d'image
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      console.log("📸 Image sélectionnée :", file.name); // Vérifie le fichier

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  // if (showPlayerFields) {
  //   if (!formData.PositionPreferee) newErrors.PositionPreferee = "Position requise";
  //   if (!formData.Niveau) newErrors.Niveau = "Niveau requis";
  //   if (formData.NbrMarquer === "") newErrors.NbrMarquer = "Nombre de buts requis";
  // }
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validation des champs
    if (!formData.MotDePasse || !formData.Confirmation) {
      alert("Le mot de passe et la confirmation sont obligatoires.");
      return;
    }
  
    if (formData.MotDePasse !== formData.Confirmation) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('ImageUpload', image); // Nom exact attendu par l'API
    formDataToSend.append('nom', formData.nom);
    formDataToSend.append('prenom', formData.prenom);
    formDataToSend.append('dateDeNaissance', formData.dateDeNaissance);
    formDataToSend.append('cin', formData.cin);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('telephone', formData.telephone);
    formDataToSend.append('adresse', formData.adresse);
    formDataToSend.append('TypeUtilisateur', formData.TypeUtilisateur);
    formDataToSend.append('login', formData.login);
    formDataToSend.append('MotDePasse', formData.MotDePasse);
    formDataToSend.append('ConfirmationMotDePasse', formData.Confirmation);
    if (showPlayerFields) {
      formDataToSend.append('IsCapitaine', formData.IsCapitaine? "true" : "false");
      formDataToSend.append('NbrMarquer', formData.NbrMarquer || 0); // Valeur par défaut
      formDataToSend.append('Niveau', formData.Niveau);
      formDataToSend.append('PositionPreferee', formData.PositionPreferee);
    }
    try {
      const response = await axios.post(API_URL, formDataToSend, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
      });
  
// Redirection avec message de succès
Navigate("/admin/Utilisateur/list", {
  state: { 
    alert: {
      type: "success",
      message: "Utilisateur ajouté avec succès!"
    }
  }
});  
    } catch (error) {
      alert("Erreur inconnue: " + error.message);
    }
  };
  
  const showPlayerFields = formData.TypeUtilisateur === "Joueur";
 // Redirection si l'utilisateur n'est pas admin
  if (userRole !== "Admin") {
    return <Navigate to="/login" replace />;
  }
  return (
      <AdminLayout>
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <h3 className="mb-4 text-center">Ajouter un Utilisateur</h3>
          <Row>
            <Col md={3} className="text-center">
              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center position-relative"
                style={{ width: "150px", height: "150px", overflow: "hidden" }}
              >
                <img
                  src={preview}
                  alt="Aperçu"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/fallback-image.png";
                  }}
                />
                  <input type="file" className="d-none" id="imageUpload" accept="image/*" onChange={handleImageChange} />
                <Button variant=""   className="position-absolute bottom-0 start-50 translate-middle-x " 
                  onClick={() => document.getElementById("imageUpload").click()}>
                  <MdCameraAlt />
                </Button>
              </div>
            </Col>
            <Col md={9}>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom</Form.Label>
                      <Form.Control
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Prénom</Form.Label>
                      <Form.Control
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Date de naissance</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateDeNaissance"
                        value={formData.dateDeNaissance}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>CIN</Form.Label>
                      <Form.Control
                        type="text"
                        name="cin"
                        value={formData.cin}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Téléphone</Form.Label>
                      <Form.Control
                        type="text"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Adresse</Form.Label>
                      <Form.Control
                        type="text"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Login</Form.Label>
                      <Form.Control
                        type="text"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Type d'utilisateur</Form.Label>
                      <Form.Select
                        name="TypeUtilisateur"
                        value={formData.TypeUtilisateur}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Sélectionnez un type</option>
                        <option value="Admin">Admin</option>
                        <option value="Joueur">Joueur</option>
                      </Form.Select>
                    </Form.Group>
                    
                    {/* Champs spécifiques aux joueurs */}
                    {showPlayerFields && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>Position préférée</Form.Label>
                          <Form.Select
                            name="PositionPreferee"
                            value={formData.PositionPreferee}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Sélectionnez une position</option>
                            {positions.map(position => (
                              <option key={position} value={position}>{position}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Niveau</Form.Label>
                          <Form.Select
                            name="Niveau"
                            value={formData.Niveau}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Sélectionnez un niveau</option>
                            {niveaux.map(niveau => (
                              <option key={niveau} value={niveau}>{niveau}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre de buts marqués</Form.Label>
                          <Form.Control
                            type="number"
                            name="NbrMarquer"
                            value={formData.NbrMarquer}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Group className="mb-3">
  <Form.Check
    type="checkbox"
    label="Est capitaine"
    name="IsCapitaine"
    checked={formData.IsCapitaine}
    onChange={(e) => setFormData({...formData, IsCapitaine: e.target.checked})}
  />
</Form.Group>
                        </Form.Group>
                      </>
                    )}
                    <Form.Group className="mb-3">
                      <Form.Label>Mot de passe</Form.Label>
                      <Form.Control
                        type="password"
                        name="MotDePasse"
                        value={formData.MotDePasse}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirmer le mot de passe</Form.Label>
                      <Form.Control
                        type="password"
                        name="Confirmation"
                        value={formData.Confirmation}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-4 d-flex justify-content-between">
                  <Button variant="success" type="submit">
                  Ajouter
                  </Button>
                  <Button
                    variant="secondary"
                    type="reset"
                    onClick={() => setImage(null)}
                  >
                    Annuler
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
    </AdminLayout >


  );
};

export default AjouterUtilisateur;


