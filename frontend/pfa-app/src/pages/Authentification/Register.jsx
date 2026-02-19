// import React, { useState, useEffect } from "react";
// import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
// import axios from "axios";
// import { MdCameraAlt } from "react-icons/md";

// const API_URL = "http://localhost:5021/api/Auth/register";

// const RegisterForm = () => {
//   const [formData, setFormData] = useState({
//     nom: "",
//     prenom: "",
//     dateDeNaissance: "",
//     cin: "",
//     email: "",
//     telephone: "",
//     adresse: "",
//     login: "",
//     motDePasseHash: "",
//     confirmation: "",
//   });

//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");

//   // Vérifier si le composant est rechargé à chaque interaction
//   useEffect(() => {
//     console.log("🔄 Composant monté !");
//   }, []);

//   // Gérer le changement des inputs texte
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Gérer l'upload d'image
//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImage(file);
//       console.log("📸 Image sélectionnée :", file.name); // Vérifie le fichier

//       const reader = new FileReader();
//       reader.onload = (e) => setPreview(e.target.result);
//       reader.readAsDataURL(file);
//     }
//   };

  
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   // 1. Vérification que l'image est bien sélectionnée
//   if (!image) {
//     alert("Veuillez sélectionner une photo de profil");
//     return;
//   }

//   // 2. Vérification que la confirmation n'est pas vide
//   if (!formData.confirmation) {
//     alert("Veuillez confirmer votre mot de passe");
//     return;
//   }

//   // 3. Vérification que les mots de passe correspondent
//   if (formData.motDePasseHash !== formData.confirmation) {
//     alert("Les mots de passe ne correspondent pas !");
//     return;
//   }

//   try {
//     const formDataToSend = new FormData();

//     // Ajout de tous les champs requis
//     formDataToSend.append('ImageUpload', image); // Nom exact attendu par l'API
//     formDataToSend.append('nom', formData.nom);
//     formDataToSend.append('prenom', formData.prenom);
//     formDataToSend.append('dateDeNaissance', formData.dateDeNaissance);
//     formDataToSend.append('cin', formData.cin);
//     formDataToSend.append('email', formData.email);
//     formDataToSend.append('telephone', formData.telephone);
//     formDataToSend.append('adresse', formData.adresse);
//     formDataToSend.append('login', formData.login);
//     formDataToSend.append('MotDePasse', formData.motDePasseHash); // Remplacer motDePasseHash par MotDePasse
//     formDataToSend.append('ConfirmationMotDePasse', formData.confirmation); // Remplacer confirmation par ConfirmationMotDePasse

//     const response = await axios.post(API_URL, formDataToSend, {
//       headers: { 
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     alert("Inscription réussie !");
    
//   } catch (error) {
//     console.error("Erreur:", error.response?.data);
//     alert("Erreur lors de l'inscription. Veuillez vérifier tous les champs.");
//   }
// };

//   return (
//     <Container className="mt-4">
//       <Card>
//         <Card.Body>
//           <h3 className="mb-4 text-center">Inscription</h3>
//           <Row>
//             <Col md={3} className="text-center">
//               <div
//                 className="rounded-circle bg-light d-flex align-items-center justify-content-center position-relative"
//                 style={{ width: "150px", height: "150px", overflow: "hidden" }}
//               >
//                 <img
//                   src={preview}
//                   alt="Aperçu"
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                   onError={(e) => {
//                     e.target.src = "/fallback-image.png";
//                   }}
//                 />
//                   <input type="file" className="d-none" id="imageUpload" accept="image/*" onChange={handleImageChange} />
//                 <Button variant=""   className="position-absolute bottom-0 start-50 translate-middle-x " 
//                   onClick={() => document.getElementById("imageUpload").click()}>
//                   <MdCameraAlt />
//                 </Button>
//               </div>
//             </Col>
//             <Col md={9}>
//               <Form onSubmit={handleSubmit}>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Nom</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="nom"
//                         value={formData.nom}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Prénom</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="prenom"
//                         value={formData.prenom}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Date de naissance</Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="dateDeNaissance"
//                         value={formData.dateDeNaissance}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>CIN</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="cin"
//                         value={formData.cin}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Email</Form.Label>
//                       <Form.Control
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Téléphone</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="telephone"
//                         value={formData.telephone}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Adresse</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="adresse"
//                         value={formData.adresse}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Login</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="login"
//                         value={formData.login}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Mot de passe</Form.Label>
//                       <Form.Control
//                         type="password"
//                         name="motDePasseHash"
//                         value={formData.motDePasseHash}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Confirmer le mot de passe</Form.Label>
//                       <Form.Control
//                         type="password"
//                         name="confirmation"
//                         value={formData.confirmation}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <div className="mt-4 d-flex justify-content-between">
//                   <Button variant="primary" type="submit">
//                     S'inscrire
//                   </Button>
//                   <Button
//                     variant="secondary"
//                     type="reset"
//                     onClick={() => setImage(null)}
//                   >
//                     Annuler
//                   </Button>
//                 </div>
//               </Form>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default RegisterForm;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { MdCameraAlt } from 'react-icons/md';

const API_URL = "http://localhost:5021/api/Auth/register";

// Animations
const rotate = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
`;

// Styled Components
const RegisterContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/futsal-stadium.jpg');
    background-size: cover;
    background-position: center;
    overflow: hidden;
    padding: 20px;
`;

const BallContainer = styled.div`
    position: fixed;
    width: 280px;
    height: 280px;
    top: 50%;
    left: 25%;
    transform: translate(-50%, -50%);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ${float} 3s ease-in-out infinite;

    @media (max-width: 992px) {
        width: 220px;
        height: 220px;
        top: 25%;
        left: 50%;
    }
`;

const RoundBallWrapper = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    animation: ${rotate} 15s linear infinite;
`;

const BallImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const RegisterCard = styled.div`
    width: 50%;
    max-width: 700px;
    background-color: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    margin-left: auto;
    margin-right: 0%;
    z-index: 20;
    padding:  32px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        transform: translateY(-5px);
    }

    @media (max-width: 992px) {
        margin: 15px auto;
        margin-top: 80px;
        padding: 25px;
        width: 90%;
    }
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
`;

const Logo = styled.div`
    width: 50px;
    height: 50px;
    background-color: #25A55F;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 25px;
    font-weight: bold;
    margin-right: 12px;
    
`;

const LogoText = styled.h1`
    font-size: 1.5rem;
    font-weight: 700;
    color: #25A55F;
    margin: 0;

`;

const Title = styled.h2`
    text-align: center;
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 20px;

`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const FormRow = styled.div`
    display: flex;
    gap: 15px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 12px;
    }
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
`;

const Label = styled.label`
    font-size: 0.9rem;
    font-weight: 500;
    color: #555;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.95rem;
    transition: all 0.2s ease;

    &:focus {
        border-color: #25A55F;
        box-shadow: 0 0 0 2px rgba(37, 165, 95, 0.2);
        outline: none;
    }
`;

const Select = styled.select`
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    background-color: white;

    &:focus {
        border-color: #25A55F;
        box-shadow: 0 0 0 2px rgba(37, 165, 95, 0.2);
        outline: none;
    }
`;

const PhotoUploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
`;

const PhotoPreview = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    border: 2px solid #ddd;
`;

const PhotoImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const UploadButton = styled.label`
    background-color: #25A55F;
    color: white;
    margin: 8px 15px; 
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #25A55F;
    }
`;

const TermsRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.9rem;
    margin-top: 10px;
`;

const Checkbox = styled.input`
    accent-color: #25A55F;
    width: 16px;
    height: 16px;
    margin-top: 3px;
`;

const TermsText = styled.div`
    color: #555;

    a {
        color: #25A55F;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const RegisterButton = styled.button`
    background-color: #25A55F;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

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
    padding: 10px;
    border-radius: 6px;
    font-size: 0.9rem;
    margin-bottom: 15px;
    text-align: center;
`;

const LoginPrompt = styled.div`
    text-align: center;
    margin-top: 15px;
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
    margin-top: 20px;
    font-size: 0.8rem;
    color: #888;
`;

const RegisterFrom = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateDeNaissance: "",
    cin: "",
    email: "",
    telephone: "",
    adresse: "",
    login: "",
    motDePasseHash: "",
    confirmation: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔄 Composant monté !");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!image) {
      setError("Veuillez sélectionner une photo de profil");
      return;
    }

    if (!acceptTerms) {
      setError("Veuillez accepter les conditions générales");
      return;
    }

    if (formData.motDePasseHash !== formData.confirmation) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.motDePasseHash.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('ImageUpload', image);
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('prenom', formData.prenom);
      formDataToSend.append('dateDeNaissance', formData.dateDeNaissance);
      formDataToSend.append('cin', formData.cin);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('telephone', formData.telephone);
      formDataToSend.append('adresse', formData.adresse);
      formDataToSend.append('login', formData.login);
      formDataToSend.append('MotDePasse', formData.motDePasseHash);
      formDataToSend.append('ConfirmationMotDePasse', formData.confirmation);

      const response = await axios.post(API_URL, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Stockage des données utilisateur et redirection
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        nom: formData.nom,
        prenom: formData.prenom,
        photo: preview
      }));

      navigate('/login'); // Rediriger vers la page de connexion après inscription

    } catch (error) {
      console.error("Erreur lors de l'inscription:", error.response?.data);
      setError(error.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <BallContainer>
        <RoundBallWrapper>
          <BallImage src="/soccer.png" alt="Futsal Ball" />
        </RoundBallWrapper>
      </BallContainer>

      <RegisterCard>
        <LogoContainer>
          <Logo>⚽</Logo>
          <LogoText>FUTSAL CENTER</LogoText>
        </LogoContainer>

        <Title>Créer un compte</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <PhotoUploadContainer>
            <PhotoPreview>
              {preview ? (
                <PhotoImage src={preview} alt="Photo de profil" />
              ) : (
                <MdCameraAlt size={40} color="#aaa" />
              )}
            </PhotoPreview>
            <UploadButton>
              <MdCameraAlt />
              <input 
                type="file" 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </UploadButton>
          </PhotoUploadContainer>

          <FormRow>
            <FormGroup>
              <Label>Nom</Label>
              <Input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Prénom</Label>
              <Input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Date de naissance</Label>
              <Input
                type="date"
                name="dateDeNaissance"
                value={formData.dateDeNaissance}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>CIN</Label>
              <Input
                type="text"
                name="cin"
                value={formData.cin}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Téléphone</Label>
              <Input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
          <FormGroup>
            <Label>Adresse</Label>
            <Input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
            />
            </FormGroup>
            <FormGroup>
              <Label>Login</Label>
              <Input
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                required
              />
            </FormGroup>

          </FormRow>

          <FormRow>
           

            <FormGroup>
              <Label>Mot de passe</Label>
              <Input
                type="password"
                name="motDePasseHash"
                value={formData.motDePasseHash}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Confirmation</Label>
              <Input
                type="password"
                name="confirmation"
                value={formData.confirmation}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormRow>

          <TermsRow>
            <Checkbox
              type="checkbox"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
            />
            <TermsText>
              J'accepte les <a href="#">conditions</a> et la <a href="#">politique de confidentialité</a>.
            </TermsText>
          </TermsRow>

          <RegisterButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <span>Inscription en cours...</span>
              </>
            ) : "S'inscrire"}
          </RegisterButton>
        </Form>

        <LoginPrompt>
          Vous avez déjà un compte? <a href="/login">Se connecter</a>
        </LoginPrompt>

        <Footer>
          © 2025 Futsal Center | Tous droits réservés
        </Footer>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterFrom;