import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser, updatePassword } from "../../services/userService";
import { Form, Button, Container, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import { MdCameraAlt } from "react-icons/md";
import AdminLayout from "./AdminLayout";

const POSITIONS = ["Attaquant", "Défenseur", "Milieu", "Gardien"];
const NIVEAUX = ["Débutant", "Intermédiaire", "Avancé", "Expert"];
const TYPES_UTILISATEUR = ["Admin", "Joueur"];

const ModifierProfilAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Nom: "",
    Prenom: "",
    DateDeNaissance: "",
    Cin: "",
    Email: "",
    Telephone: "",
    Adresse: "",
    Login: "",
    TypeUtilisateur: "",
    IsCapitaine: false,
    NbrMarquer: 0,
    Niveau: "",
    PositionPreferee: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const idUtilisateur = localStorage.getItem("userId");
  const [passwordData, setPasswordData] = useState({
    AncienMotDePasse: '',
    NouveauMotDePasse: '',
    ConfirmerMotDePasse: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const selectedUser = await getUserById(id);
        if (selectedUser) {
          setFormData({
            Nom: selectedUser.nom || "",
            Prenom: selectedUser.prenom || "",
            DateDeNaissance: selectedUser.dateDeNaissance?.split("T")[0] || "",
            Cin: selectedUser.cin || "",
            Email: selectedUser.email || "",
            Telephone: selectedUser.telephone || "",
            Adresse: selectedUser.adresse || "",
            Login: selectedUser.login || "",
            TypeUtilisateur: selectedUser.typeUtilisateur || "",
            IsCapitaine: selectedUser.isCapitaine || false,
            NbrMarquer: selectedUser.nbrMarquer || 0,
            Niveau: selectedUser.niveau || "",
            PositionPreferee: selectedUser.positionPreferee || "",
          });

          if (selectedUser.photoProfil) {
            setPreview(`http://localhost:5021${selectedUser.photoProfil}?t=${Date.now()}`);
          }
        }
      } catch (error) {
        setError("Erreur lors du chargement de l'utilisateur");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (formData.TypeUtilisateur === "Joueur") {
      if (!formData.PositionPreferee || !formData.Niveau) {
        setError("Veuillez remplir tous les champs spécifiques aux joueurs");
        return false;
      }
    }
    return true;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
  
    if (!validateForm()) return;
    setSubmitting(true);
  
    try {
      const formDataToSend = new FormData();
  
      if (image) {
        formDataToSend.append("ImageUpload", image);
      } else if (!preview) {
        formDataToSend.append("ImageUpload", "null");
      }
  
      Object.keys(formData).forEach(key => {
        if (key !== "IsCapitaine") {
          formDataToSend.append(key, formData[key]);
        }
      });
  
      formDataToSend.append("IsCapitaine", formData.IsCapitaine);
  
      const response = await updateUser(id, formDataToSend);
  
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const isSelf = idUtilisateur === id;
  
      // Vérifie si login, email, mot de passe ou image ont été modifiés
      const shouldLogout = isSelf && (
        formData.Login !== currentUser?.login ||
        formData.Email !== currentUser?.email ||
        formData.MotDePasse !== "" ||
        image !== null
      );
      
  
      if (shouldLogout) {
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/login";
        }, 3000);
        return;
      }
  
      // Sinon redirection normale
      navigate("/admin/utilisateur/List", {
        state: { success: "Utilisateur modifié avec succès" },
      });
  
    } catch (error) {
      console.error("Erreur:", error.response?.data);
      setError(error.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setSubmitting(false);
    }
  };
  
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setIsPasswordSubmitting(true);

    if (passwordData.NouveauMotDePasse !== passwordData.ConfirmerMotDePasse) {
      setPasswordError("❌ Les mots de passe ne correspondent pas.");
      setIsPasswordSubmitting(false);
      return;
    }

    try {
      const response = await updatePassword(idUtilisateur, passwordData);
      setPasswordSuccess("✅ Mot de passe modifié avec succès. Déconnexion dans 2 secondes...");
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setPasswordError(error.response?.data?.message || "❌ Erreur lors de la modification du mot de passe");
      console.error(error);
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const showPlayerFields = formData.TypeUtilisateur === "Joueur";

  if (loading) {
    return (
      <AdminLayout>
        <Container className="d-flex justify-content-center mt-5">
          <Spinner animation="border" variant="primary" />
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container className="mt-4">
        <Card>
          <Card.Body>
            <h3 className="mb-4 text-center">Modification De Mon Profil</h3>
            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
            <Row>
              <Col md={3} className="text-center">
                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center position-relative mx-auto" 
                     style={{ width: "150px", height: "150px", overflow: "hidden" }}>
                  {preview ? (
                    <img src={preview} alt="Aperçu" 
                         style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                         onError={(e) => { e.target.src = "/default-profile.jpg"; }} />
                  ) : (
                    <div className="text-muted">Aucune image</div>
                  )}
                  <input type="file" className="d-none" id="imageUpload" accept="image/*" onChange={handleImageChange} />
                  <Button variant="light" className="position-absolute bottom-0 start-50 translate-middle-x" 
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
                        <Form.Label>Nom *</Form.Label>
                        <Form.Control type="text" name="Nom" value={formData.Nom} onChange={handleChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Prénom *</Form.Label>
                        <Form.Control type="text" name="Prenom" value={formData.Prenom} onChange={handleChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Date de naissance *</Form.Label>
                        <Form.Control type="date" name="DateDeNaissance" value={formData.DateDeNaissance} onChange={handleChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>CIN *</Form.Label>
                        <Form.Control type="text" name="Cin" value={formData.Cin} onChange={handleChange} required />
                      </Form.Group>
                      {/* <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control type="email" name="Email" value={formData.Email} onChange={handleChange} required />
                      </Form.Group> */}
                    </Col>

                    <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control type="email" name="Email" value={formData.Email} onChange={handleChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Téléphone *</Form.Label>
                        <Form.Control type="text" name="Telephone" value={formData.Telephone} onChange={handleChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Adresse *</Form.Label>
                        <Form.Control type="text" name="Adresse" value={formData.Adresse} onChange={handleChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Login *</Form.Label>
                        <Form.Control type="text" name="Login" value={formData.Login} onChange={handleChange} required />
                      </Form.Group>
                      {/* <Form.Group className="mb-3"> */}
                        {/* <Form.Label>Type d'utilisateur *</Form.Label>
                        <Form.Select name="TypeUtilisateur" value={formData.TypeUtilisateur} onChange={handleChange} required>
                          <option value="">Sélectionnez un type</option>
                          {TYPES_UTILISATEUR.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </Form.Select>
                      </Form.Group> */}

                      {showPlayerFields && (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Label>Position préférée *</Form.Label>
                            <Form.Select name="PositionPreferee" value={formData.PositionPreferee} onChange={handleChange} required>
                              <option value="">Sélectionnez une position</option>
                              {POSITIONS.map((pos) => (
                                <option key={pos} value={pos}>{pos}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Niveau *</Form.Label>
                            <Form.Select name="Niveau" value={formData.Niveau} onChange={handleChange} required>
                              <option value="">Sélectionnez un niveau</option>
                              {NIVEAUX.map((niv) => (
                                <option key={niv} value={niv}>{niv}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Nombre de buts marqués</Form.Label>
                            <Form.Control type="number" name="NbrMarquer" value={formData.NbrMarquer} onChange={handleChange} min="0" />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Check type="checkbox" label="Est capitaine" name="IsCapitaine" checked={formData.IsCapitaine} onChange={handleChange} />
                          </Form.Group>
                        </>
                      )}
                    </Col>
                  </Row>
                  <div className="text-end">
                    <Button type="submit" variant="success" disabled={submitting}>
                      {submitting ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
            <hr />
            <h4>Changer le mot de passe</h4>
            {passwordError && <Alert variant="danger">{passwordError}</Alert>}
            {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}
            <Form onSubmit={handlePasswordSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ancien mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.AncienMotDePasse}
                      onChange={handlePasswordChange('AncienMotDePasse')}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nouveau mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.NouveauMotDePasse}
                      onChange={handlePasswordChange('NouveauMotDePasse')}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirmer mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.ConfirmerMotDePasse}
                      onChange={handlePasswordChange('ConfirmerMotDePasse')}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="text-end mt-4">
                  <Button type="submit" variant="danger" disabled={isPasswordSubmitting}>
                    {isPasswordSubmitting ? "Modification..." : "Modifier le mot de passe"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </AdminLayout>
  );
};

export default ModifierProfilAdmin;
