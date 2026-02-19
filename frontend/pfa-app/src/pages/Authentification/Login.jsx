import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Spinner } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';
const API_URL = "http://localhost:5021/api/Auth/login";
const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const float = keyframes`
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-15px);
    }
    100% {
        transform: translateY(0px);
    }
`;

// Styled Components
const LoginContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/futsal-stadium.jpg');
    background-size: cover;
    background-position: center;
    overflow: hidden;
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

// Technique garantissant une balle parfaitement ronde
const RoundBallWrapper = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    animation: ${rotate} 15s linear infinite;
    background-color: #ffffff; /* Fallback color if image fails to load */
`;

const BallImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* Cette propriété garantit que l'image couvre toute la surface sans déformation */
`;

// Style alternatif direct sur l'image au cas où
const CircularBallImage = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    animation: ${rotate} 15s linear infinite;
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
    z-index: 20;

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

// Balle avec divs et background-image (méthode alternative)
const CircularDivBall = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-image: url('/soccer.png');
  background-size: cover;
  background-position: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: ${rotate} 15s linear infinite;
`;

const Login = () => {
  const [formData, setFormData] = useState({ 
    login: "", 
    MotDePasse: "" 
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const ballRenderMethod = 2; // 1, 2 ou 3
  const [ballImgError, setBallImgError] = useState(false);

  // Initialisation de la balle 3D avec Three.js (identique au premier composant)
  useEffect(() => {
    if (!canvasRef.current) return;

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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    const createFutsalBall = () => {
      const ballGroup = new THREE.Group();
      const geometry = new THREE.SphereGeometry(1.4, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.3,
        metalness: 0.2
      });

      const ball = new THREE.Mesh(geometry, material);
      ballGroup.add(ball);

      const patchGeometry = new THREE.CircleGeometry(0.35, 5);
      const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

      const positions = [
        { x: 0, y: 0, z: 1.42 },
        { x: 1.3, y: 0.4, z: 0.5 },
        { x: -1.3, y: 0.4, z: 0.5 },
        { x: 0, y: -1.4, z: 0.4 },
        { x: 0.8, y: -0.8, z: -0.9 },
        { x: -0.8, y: -0.8, z: -0.9 },
        { x: 0, y: 0.8, z: -1.2 }
      ];

      positions.forEach(pos => {
        const patch = new THREE.Mesh(patchGeometry, blackMaterial);
        patch.position.set(pos.x, pos.y, pos.z);
        patch.lookAt(0, 0, 0);
        ballGroup.add(patch);
      });

      return ballGroup;
    };

    const ball = createFutsalBall();
    scene.add(ball);

    const animate = () => {
      requestAnimationFrame(animate);
      ball.rotation.y += 0.01;
      ball.rotation.x += 0.005;
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      const container = canvasRef.current.parentElement;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Vérification de l'authentification existante
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
      Admin: "/admin",
      Capitaine: "/reservations",
      Joueur: "/TournamentDetails",
    };
    const route = routes[role] || "/profile";
    navigate(route);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };
   // Rendu de la balle avec différentes méthodes pour garantir qu'elle reste ronde
   const renderBall = () => {
    switch (ballRenderMethod) {
      case 1:
        // Méthode 1: Image imbriquée dans un conteneur avec overflow hidden
        return (
            <RoundBallWrapper>
              <BallImage
                  src="../../public/soccer.png"
                  alt="Futsal Ball"
                  onError={() => setBallImgError(true)}
              />
            </RoundBallWrapper>
        );
      case 2:
        // Méthode 2: Div avec image en arrière-plan
        return <CircularDivBall />;
      case 3:
        // Méthode 3: Image directe avec border-radius et object-fit
        return (
            <CircularBallImage
                src="/images/futsal-ball.png"
                alt="Futsal Ball"
                onError={() => setBallImgError(true)}
            />
        );
      default:
        return <CircularDivBall />;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
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
      setError(error.response?.data?.message || "Identifiants incorrects");
    } finally {
      setIsLoading(false);
    }
  };
  
  const storeAuthData = (token, decoded, isCapitan) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", decoded.nameid || decoded.sub);
    localStorage.setItem("firstName", decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] || "");
    localStorage.setItem("lastName", decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"] || "");
    localStorage.setItem("role", decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "");
    localStorage.setItem("PhotoProfil", decoded.PhotoProfil || "");
    localStorage.setItem("isCapitan", isCapitan);
    
    if (rememberMe) {
      localStorage.setItem("rememberedLogin", formData.login);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    
    <LoginContainer>
      <BallContainer>
      {renderBall()}
      </BallContainer>

      <LoginCard>
        <LogoContainer>
          <Logo>⚽</Logo>
          <LogoText>FUTSAL CENTER</LogoText>
        </LogoContainer>

        <Title>Connexion à votre compte</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="login">Identifiant</Label>
            <Input
              type="text"
              id="login"
              name="login"
              placeholder="Votre identifiant"
              value={formData.login}
              onChange={handleChange}
              required
              autoFocus
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="MotDePasse">Mot de passe</Label>
            <Input
              type="password"
              id="MotDePasse"
              name="MotDePasse"
              placeholder="Votre mot de passe"
              value={formData.MotDePasse}
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

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" />
                <span>Connexion...</span>
              </>
            ) : "Se connecter"}
          </LoginButton>
        </Form>

        <RegisterPrompt>
          Pas encore de compte? <a href="Register">S'inscrire</a>
        </RegisterPrompt>

        <Footer>
          © 2025 Futsal Center | Tous droits réservés
        </Footer>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;