import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import moment from 'moment';
import 'moment/locale/fr';  // Import French locale for moment
import { FaFacebookF, FaTiktok , FaInstagram, FaYoutube } from 'react-icons/fa';

// Set moment to use French locale
moment.locale('fr');

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Styled Components
const PageContainer = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow-x: hidden;
  color: #333;
`;

const NavbarContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background-color 0.3s ease;
  background-color: ${props => props.scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
  box-shadow: ${props => props.scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5%;
  max-width: 1400px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.6rem;
  color: ${props => props.scrolled ? '#25A55F' : '#fff'};
  transition: color 0.3s ease;
  
  span {
    margin-left: 10px;
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #25A55F;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 30px;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.scrolled ? '#333' : '#fff'};
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
  
  &:hover {
    color: #25A55F;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: #25A55F;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const Button = styled(Link)`
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
`;

const LoginButton = styled(Button)`
  background-color: ${props => props.scrolled ? 'transparent' : 'rgba(255, 255, 255, 0.15)'};
  color: ${props => props.scrolled ? '#333' : '#fff'};
  border: ${props => props.scrolled ? '1px solid #25A55F' : '1px solid rgba(255, 255, 255, 0.3)'};
  
  &:hover {
    background-color: ${props => props.scrolled ? 'rgba(37, 165, 95, 0.1)' : 'rgba(255, 255, 255, 0.25)'};
    transform: translateY(-2px);
  }
`;

const SignupButton = styled(Button)`
  background-color: #25A55F;
  color: white;
  border: 1px solid #25A55F;
  
  &:hover {
    background-color: #1e8f4e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 165, 95, 0.3);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${props => props.scrolled ? '#333' : '#fff'};
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  transform: translateY(${props => props.open ? '0' : '-100%'});
  transition: transform 0.4s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #333;
  cursor: pointer;
`;

const MobileNavLink = styled(Link)`
  font-size: 1.5rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 10px;
  
  &:hover {
    color: #25A55F;
  }
`;

const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 1400px;
  width: 90%;
  margin: 0 auto;
  padding: 0 20px;
  animation: ${fadeIn} 1s ease;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;
  max-width: 700px;
  
  span {
    color: #25A55F;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 40px;
  max-width: 600px;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const HeroButton = styled(Link)`
  display: inline-block;
  background-color: #25A55F;
  color: white;
  padding: 15px 35px;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 165, 95, 0.4);
  
  &:hover {
    background-color: #1e8f4e;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(37, 165, 95, 0.5);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const ScrollDownButton = styled.button`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  animation: ${pulse} 1.5s infinite ease-in-out;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Section = styled.section`
  padding: 100px 5%;
  background-color: ${props => props.dark ? '#f8f9fa' : 'white'};
`;

const SectionContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 15px;
  font-weight: 700;
  color: #1a1a1a;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: rgba(37, 165, 95, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #25A55F;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const FeatureLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-top: 20px;
  color: #25A55F;
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
  
  span {
    margin-right: 6px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  padding: 30px;
  text-align: center;
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  @media (max-width: 992px) {
    &:nth-child(2n) {
      border-right: none;
    }
  }
  
  @media (max-width: 576px) {
    border-right: none;
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #25A55F;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #666;
`;

const HowItWorksSteps = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 60px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 50px;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 250px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StepNumber = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #25A55F;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const StepDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const StepLine = styled.div`
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #25A55F, transparent);
  position: relative;
  top: 25px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const TestimonialsContainer = styled.div`
  max-width: 1000px;
  margin: 60px auto 0;
`;

const TestimonialCard = styled.div`
  background-color: white;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 30px;
  margin: 20px;
  position: relative;
`;

const TestimonialText = styled.blockquote`
  font-size: 1.1rem;
  font-style: italic;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.6;
  position: relative;
  
  &::before {
    content: '"';
    font-size: 5rem;
    color: rgba(37, 165, 95, 0.1);
    position: absolute;
    top: -40px;
    left: -20px;
    font-family: Georgia, serif;
  }
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin-right: 15px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
`;

const AuthorRole = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const TestimonialDots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#25A55F' : '#e0e0e0'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#25A55F' : '#cccccc'};
  }
`;

const CTASection = styled.section`
  padding: 100px 5%;
  background: linear-gradient(180deg, #25A55F 0%, #1a7c47 100%);
  color: white;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 700;
    color: white;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 40px;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: #25A55F;
  padding: 15px 40px;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
`;

const Footer = styled.footer`
  background-color: #1a1a1a;
  color: rgba(255, 255, 255, 0.7);
  padding: 80px 5% 40px;
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.6rem;
  color: white;
  margin-bottom: 20px;
  
  span {
    margin-left: 10px;
  }
`;

const FooterDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 25px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.a`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #25A55F;
    transform: translateY(-3px);
  }
`;

const FooterTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 25px;
  font-weight: 600;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 12px;
  
  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: white;
    }
  }
`;

const FooterBottom = styled.div`
  max-width: 1400px;
  margin: 60px auto 0;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Copyright = styled.div`
  font-size: 0.9rem;
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 20px;
  
  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 0.9rem;
    
    &:hover {
      color: white;
    }
  }
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

// Styled components for dialog modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(0);
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: #1a1a1a;
`;

const ModalText = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 25px;
  line-height: 1.5;
`;

const ModalButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ModalCancelButton = styled(ModalButton)`
  background-color: #f0f0f0;
  color: #555;
  border: 1px solid #ddd;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ModalActionButton = styled(ModalButton)`
  background-color: #25A55F;
  color: white;
  border: 1px solid #25A55F;
  
  &:hover {
    background-color: #1e8f4e;
    box-shadow: 0 4px 12px rgba(37, 165, 95, 0.3);
  }
`;

// New styled components for the Créneaux section
const SlotsContainer = styled.div`
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  padding: 30px;
  margin-top: 40px;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SlotsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const SlotsTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const DateNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const NavButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: #f5f5f5;
  color: #555;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e0e0e0;
    color: #333;
  }
`;

const CurrentMonth = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 25px;
  
  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const DayCell = styled.div`
  padding: 12px 5px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.selected ? '#25A55F' : '#f5f5f5'};
  color: ${props => props.selected ? 'white' : props.disabled ? '#bbb' : '#333'};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  box-shadow: ${props => props.selected ? '0 4px 10px rgba(37, 165, 95, 0.3)' : 'none'};
  transform: ${props => props.selected ? 'translateY(-2px)' : 'none'};
  
  &:hover {
    background-color: ${props => props.selected ? '#25A55F' : '#e0e0e0'};
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 8px 2px;
  }
`;

const DayName = styled.div`
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  margin-bottom: 5px;
`;

const DayNumber = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const FieldsContainer = styled.div`
  margin-top: 30px;
`;

const FieldCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  }
`;

const FieldName = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: #1a1a1a;
`;

const SlotGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
`;

const TimeSlot = styled.button`
  padding: 10px 15px;
  border-radius: 30px;
  border: 2px solid ${props => props.disabled ? '#cccccc' : '#25A55F'};
  background-color: ${props => {
  if (props.disabled) return '#f0f0f0';
  if (props.selected) return '#25A55F';
  return 'transparent';
}};
  color: ${props => {
  if (props.disabled) return '#999999';
  if (props.selected) return 'white';
  return '#25A55F';
}};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  &:hover {
    background-color: ${props => {
  if (props.disabled) return '#f0f0f0';
  if (props.selected) return '#1e8f4e';
  return 'rgba(37, 165, 95, 0.1)';
}};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const ReservationInfo = styled.div`
  margin-top: 25px;
  padding: 15px;
  border-radius: 10px;
  background-color: rgba(37, 165, 95, 0.1);
  border-left: 4px solid #25A55F;
  animation: ${slideIn} 0.3s ease-out;
`;

const ReservationText = styled.p`
  margin: 0 0 15px 0;
  font-size: 1rem;
  color: #333;
  
  strong {
    color: #1a1a1a;
    font-weight: 600;
  }
`;

const ReservationButton = styled.button`
  padding: 12px 25px;
  border-radius: 30px;
  border: none;
  background-color: #25A55F;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #1e8f4e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 165, 95, 0.3);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const NoSlotsMessage = styled.p`
  text-align: center;
  padding: 15px;
  color: #666;
  font-style: italic;
`;

// Tournaments section styled components
const TournamentsSection = styled(Section)`
  background: linear-gradient(to bottom, #f9f9f9, white);
`;

const TournamentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  margin-top: 50px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TournamentCard = styled.div`
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  }
`;

const TournamentImage = styled.div`
  height: 180px;
  background-color: #25A55F;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5));
  }
`;

const TournamentLabel = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #25A55F;
  color: white;
  padding: 5px 12px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 1;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const TournamentContent = styled.div`
  padding: 25px;
`;

const TournamentTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: #1a1a1a;
`;

const TournamentDetails = styled.div`
  margin-bottom: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const DetailIcon = styled.span`
  color: #25A55F;
  margin-right: 10px;
  font-size: 1.2rem;
`;

const DetailText = styled.span`
  color: #555;
  font-size: 1rem;
  
  strong {
    font-weight: 600;
    color: #333;
  }
`;

const TournamentButton = styled(Link)`
  display: inline-block;
  padding: 12px 25px;
  border-radius: 30px;
  background-color: #25A55F;
  color: white;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #1e8f4e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 165, 95, 0.3);
  }
`;

const SeeAllButton = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 40px;
  font-weight: 600;
  color: #25A55F;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    color: #1e8f4e;
    text-decoration: underline;
  }
`;

// Home Component
const Accueil = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // New states for Créneaux section
  const [startOfWeek, setStartOfWeek] = useState(moment().startOf("week").add(1, "day"));
  const [jours, setJours] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [terrains, setTerrains] = useState([
    { id: 1, nom: "Terrain Foot 1" },
    { id: 2, nom: "Terrain Foot 2" },
    { id: 3, nom: "Terrain Foot 3" },
    { id: 4, nom: "Terrain Foot 4" }
  ]);
  const [creneaux, setCreneaux] = useState([]);
  const [newReservation, setNewReservation] = useState({});

  // Gérer le scroll pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Simuler un défilement automatique des témoignages
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 4);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Générer les jours pour la sélection de date
  useEffect(() => {
    const today = moment().startOf("day");
    const joursSemaine = [];

    for (let i = 0; i < 7; i++) {
      const jour = moment(startOfWeek).add(i, "day");
      if (jour.isSameOrAfter(today)) {
        joursSemaine.push(jour);
      }
    }

    setJours(joursSemaine);
  }, [startOfWeek]);

  // Simuler la récupération des créneaux disponibles
  const fetchCreneaux = (date) => {
    // Ici, nous simulons des créneaux disponibles
    const creneauxSimules = [
      {
        id: 1,
        terrain: { id: 1, nom: "Terrain Principal" },
        date: date,
        dateHeureDebut: `${date}T09:00:00`,
        dateHeureFin: `${date}T10:30:00`,
        disponible: true
      },
      {
        id: 2,
        terrain: { id: 1, nom: "Terrain Principal" },
        date: date,
        dateHeureDebut: `${date}T11:00:00`,
        dateHeureFin: `${date}T12:30:00`,
        disponible: true
      },
      {
        id: 3,
        terrain: { id: 1, nom: "Terrain Principal" },
        date: date,
        dateHeureDebut: `${date}T14:00:00`,
        dateHeureFin: `${date}T15:30:00`,
        disponible: false // déjà réservé
      },
      {
        id: 4,
        terrain: { id: 1, nom: "Terrain Principal" },
        date: date,
        dateHeureDebut: `${date}T16:00:00`,
        dateHeureFin: `${date}T17:30:00`,
        disponible: true
      },
      {
        id: 5,
        terrain: { id: 2, nom: "Terrain Secondaire" },
        date: date,
        dateHeureDebut: `${date}T10:00:00`,
        dateHeureFin: `${date}T11:30:00`,
        disponible: false // déjà réservé
      },
      {
        id: 6,
        terrain: { id: 2, nom: "Terrain Secondaire" },
        date: date,
        dateHeureDebut: `${date}T12:00:00`,
        dateHeureFin: `${date}T13:30:00`,
        disponible: true
      },
      {
        id: 7,
        terrain: { id: 3, nom: "Terrain Extérieur" },
        date: date,
        dateHeureDebut: `${date}T15:00:00`,
        dateHeureFin: `${date}T16:30:00`,
        disponible: true
      },
      {
        id: 8,
        terrain: { id: 3, nom: "Terrain Extérieur" },
        date: date,
        dateHeureDebut: `${date}T17:00:00`,
        dateHeureFin: `${date}T18:30:00`,
        disponible: false // déjà réservé
      },
      {
        id: 9,
        terrain: { id: 3, nom: "Terrain Extérieur" },
        date: date,
        dateHeureDebut: `${date}T19:00:00`,
        dateHeureFin: `${date}T20:30:00`,
        disponible: true,
        horsPeriode: moment().hour() > 20 // horaire dépassé pour aujourd'hui
      }
    ];

    // Si la date sélectionnée est aujourd'hui, marquer les créneaux passés comme indisponibles
    if (moment(date).isSame(moment(), 'day')) {
      const heureActuelle = moment().hour();
      creneauxSimules.forEach(creneau => {
        const heureCreneau = moment(creneau.dateHeureDebut).hour();
        if (heureCreneau <= heureActuelle) {
          creneau.horsPeriode = true;
        }
      });
    }

    setCreneaux(creneauxSimules);
  };

  // Gérer la redirection vers la page d'inscription
  const handleRedirectToSignup = () => {
    window.location.href = "/register";
  };

  // Gérer la tentative de réservation d'un créneau
  const handleSlotSelection = (creneau) => {
    if (!creneau.disponible || creneau.horsPeriode) return;

    if (!isAuthenticated) {
      setSelectedSlot(creneau);
      setShowAuthModal(true);
      return;
    }

    setNewReservation({
      date: creneau.date,
      startTime: creneau.dateHeureDebut,
      endTime: creneau.dateHeureFin,
      terrainId: creneau.terrain.id,
      creneauId: creneau.id,
    });
  };

  // Gérer le défilement vers une section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Gérer la sélection de date
  const handleDateSelect = (jour) => {
    const iso = jour.format("YYYY-MM-DD");
    setSelectedDate(iso);
    fetchCreneaux(iso);
  };

  // Gérer le changement de semaine
  const handlePrevWeek = () => setStartOfWeek((prev) => moment(prev).subtract(7, "days"));
  const handleNextWeek = () => setStartOfWeek((prev) => moment(prev).add(7, "days"));

  // Simuler une réservation
  const submitReservation = () => {
    alert(`Réservation pour le ${moment(newReservation.date).format("DD/MM/YYYY")} de ${moment(newReservation.startTime).format("HH:mm")} à ${moment(newReservation.endTime).format("HH:mm")} sur le ${terrains.find(t => t.id === newReservation.terrainId)?.nom} confirmée!`);
    setNewReservation({});
  };

  // Données des tournois
  const tournois = [
    {
      id: 1,
      title: "TOURNOI AMATEUR",
      date: "15 Mars 2025",
      equipes: 8,
      prix: "900 MAD/équipe",
      image: "https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      label: "Amateur"
    },
    {
      id: 2,
      title: "TOURNOI ENTREPRISE",
      date: "22 Mars 2025",
      equipes: 12,
      prix: "1200 MAD/équipe",
      image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      label: "Entreprise"
    },
    {
      id: 3,
      title: "COUPE DE LA VILLE",
      date: "5-6 Avril 2025",
      equipes: 16,
      prix: "1500 MAD/équipe",
      image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      label: "Compétition"
    },
    {
      id: 4,
      title: "TOURNOI RAMADAN",
      date: "15-30 Mars 2025",
      equipes: 24,
      prix: "1000 MAD/équipe",
      image: "ramadan.jpg",
      label: "Spécial Ramadan"
    }
  ];

  // Données des témoignages
  const testimonials = [
    {
      id: 1,
      text: "Cette plateforme a révolutionné notre façon d'organiser des tournois. La gestion des équipes et le suivi des matchs sont devenus d'une simplicité incroyable!",
      author: "KANBA BILAL",
      role: "Organisateur de tournois",
      avatar: "bilal.jpeg"
    },
    {
      id: 2,
      text: "Je cherchais un moyen efficace de réserver des terrains pour mon équipe. Cette plateforme m'offre exactement ce dont j'avais besoin, avec une interface claire et intuitive.",
      author: "NAOUFAL KODAD",
      role: "Capitaine d'équipe",
      avatar: "naoufal.jpg"
    },
    {
      id: 3,
      text: "Les statistiques avancées me permettent d'analyser précisément les performances de notre équipe et d'identifier nos points forts et nos faiblesses pour progresser.",
      author: "WIAM BOUHMIDI",
      role: "Entraîneuse de futsal",
      avatar: "wiam.jpg"
    },
    {
      id: 4,
      text: "Trouver des adversaires de notre niveau n'a jamais été aussi facile. La plateforme nous met en relation avec des équipes compatibles pour des matchs toujours passionnants.",
      author: "WAIL GUERROUJ",
      role: "Joueur amateur",
      avatar: "wail.jpeg"
    }
  ];

  return (
      <PageContainer>
        {/* Boîte de dialogue d'authentification */}
        {showAuthModal && (
            <ModalOverlay onClick={() => setShowAuthModal(false)}>
              <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalTitle>Authentification requise</ModalTitle>
                <ModalText>
                  Vous devez être connecté pour réserver ce créneau. Souhaitez-vous vous inscrire maintenant ?
                </ModalText>
                <ModalButtonsContainer>
                  <ModalCancelButton onClick={() => setShowAuthModal(false)}>
                    Annuler
                  </ModalCancelButton>
                  <ModalActionButton onClick={handleRedirectToSignup}>
                    S'inscrire
                  </ModalActionButton>
                </ModalButtonsContainer>
              </ModalContainer>
            </ModalOverlay>
        )}

        {/* Navbar */}
        <NavbarContainer scrolled={scrolled}>
          <NavbarContent>
            <Logo to="/" scrolled={scrolled}>
              <LogoIcon>⚽</LogoIcon>
              <span>FUTSAL</span>
            </Logo>

            <NavLinks>
              <NavLink as="span" onClick={() => scrollToSection('features')} scrolled={scrolled} style={{cursor: 'pointer'}}>Fonctionnalités</NavLink>
              <NavLink as="span" onClick={() => scrollToSection('pricing')} scrolled={scrolled} style={{cursor: 'pointer'}}>Tarifs</NavLink>
              <NavLink as="span" onClick={() => scrollToSection('creneaux')} scrolled={scrolled} style={{cursor: 'pointer'}}>Créneaux</NavLink>
              <NavLink as="span" onClick={() => scrollToSection('tournois')} scrolled={scrolled} style={{cursor: 'pointer'}}>Tournois</NavLink>
              <NavLink as="span" onClick={() => scrollToSection('contact')} scrolled={scrolled} style={{cursor: 'pointer'}}>Contact</NavLink>
            </NavLinks>

            <AuthButtons>
              <LoginButton to="/login" scrolled={scrolled}>Connexion</LoginButton>
              <SignupButton to="/register">Inscription</SignupButton>
            </AuthButtons>

            <MobileMenuButton
                scrolled={scrolled}
                onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </MobileMenuButton>
          </NavbarContent>
        </NavbarContainer>

        {/* Mobile Menu */}
        <MobileMenu open={mobileMenuOpen}>
          <CloseButton onClick={() => setMobileMenuOpen(false)}>×</CloseButton>

          <MobileNavLink as="span" onClick={() => {scrollToSection(''); setMobileMenuOpen(false)}} style={{cursor: 'pointer'}}>Accueil</MobileNavLink>
          <MobileNavLink as="span" onClick={() => {scrollToSection('features'); setMobileMenuOpen(false)}} style={{cursor: 'pointer'}}>Fonctionnalités</MobileNavLink>
          <MobileNavLink as="span" onClick={() => {scrollToSection('pricing'); setMobileMenuOpen(false)}} style={{cursor: 'pointer'}}>Tarifs</MobileNavLink>
          <MobileNavLink as="span" onClick={() => {scrollToSection('creneaux'); setMobileMenuOpen(false)}} style={{cursor: 'pointer'}}>Créneaux</MobileNavLink>
          <MobileNavLink as="span" onClick={() => {scrollToSection('tournois'); setMobileMenuOpen(false)}} style={{cursor: 'pointer'}}>Tournois</MobileNavLink>
          <MobileNavLink as="span" onClick={() => {scrollToSection('contact'); setMobileMenuOpen(false)}} style={{cursor: 'pointer'}}>Contact</MobileNavLink>

          <LoginButton to="/login" scrolled={true} style={{ marginTop: 20 }}>Connexion</LoginButton>
          <SignupButton to="/register">Inscription</SignupButton>
        </MobileMenu>

        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <HeroTitle>
              Organisez vos matchs de <span>futsal</span> comme jamais auparavant
            </HeroTitle>
            <HeroSubtitle>
              La plateforme ultime pour gérer vos équipes, planifier vos matchs et suivre vos performances avec simplicité et efficacité.
            </HeroSubtitle>
            <HeroButton to="/register">Commencer maintenant</HeroButton>
          </HeroContent>

          <ScrollDownButton onClick={() => scrollToSection('features')}>
            ↓
          </ScrollDownButton>
        </HeroSection>

        {/* Features Section */}
        <Section id="features">
          <SectionContent>
            <SectionHeader>
              <SectionTitle>Tout ce dont vous avez besoin</SectionTitle>
              <SectionSubtitle>
                Notre plateforme de gestion de futsal offre tous les outils nécessaires pour organiser des matchs exceptionnels
              </SectionSubtitle>
            </SectionHeader>

            <FeaturesGrid>
              <FeatureCard>
                <FeatureIcon>🏆</FeatureIcon>
                <FeatureTitle>Gestion des matchs</FeatureTitle>
                <FeatureDescription>
                  Planifiez facilement vos matchs, gérez les disponibilités et enregistrez automatiquement les résultats.
                </FeatureDescription>
                <FeatureLink to="/features/matches">
                  <span>En savoir plus</span> →
                </FeatureLink>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>👥</FeatureIcon>
                <FeatureTitle>Gestion d'équipe</FeatureTitle>
                <FeatureDescription>
                  Gérez les profils de joueurs, les statistiques individuelles et la composition de votre équipe sans effort.
                </FeatureDescription>
                <FeatureLink to="/features/team">
                  <span>En savoir plus</span> →
                </FeatureLink>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>📊</FeatureIcon>
                <FeatureTitle>Statistiques avancées</FeatureTitle>
                <FeatureDescription>
                  Analysez les performances de votre équipe avec des statistiques détaillées et des visualisations intuitives.
                </FeatureDescription>
                <FeatureLink to="/features/stats">
                  <span>En savoir plus</span> →
                </FeatureLink>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>🤝</FeatureIcon>
                <FeatureTitle>Système de défis</FeatureTitle>
                <FeatureDescription>
                  Défiez d'autres équipes, organisez des tournois et créez une communauté autour de votre passion.
                </FeatureDescription>
                <FeatureLink to="/features/challenges">
                  <span>En savoir plus</span> →
                </FeatureLink>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>🏟️</FeatureIcon>
                <FeatureTitle>Réservation de terrains</FeatureTitle>
                <FeatureDescription>
                  Trouvez et réservez les meilleurs terrains de futsal dans votre région en quelques clics.
                </FeatureDescription>
                <FeatureLink to="/features/fields">
                  <span>En savoir plus</span> →
                </FeatureLink>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>📱</FeatureIcon>
                <FeatureTitle>Application mobile</FeatureTitle>
                <FeatureDescription>
                  Accédez à toutes les fonctionnalités en déplacement grâce à notre application mobile intuitive.
                </FeatureDescription>
                <FeatureLink to="/features/app">
                  <span>En savoir plus</span> →
                </FeatureLink>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>🔍</FeatureIcon>
                <FeatureTitle>Recherche de partenaires</FeatureTitle>
                <FeatureDescription>
                  Trouvez facilement des partenaires de jeu ou des équipes adverses pour compléter vos matchs.
                </FeatureDescription>
                <FeatureLink to="/features/partners">
                  <span>En savoir plus</span> →
                </FeatureLink>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>💰</FeatureIcon>
                <FeatureTitle>Historique des paiements</FeatureTitle>
                <FeatureDescription>
                  Suivez et gérez facilement tous vos paiements de réservations et de tournois en un seul endroit.
                </FeatureDescription>
                <FeatureLink to="/features/payments">
                  <span>En savoir plus</span> →
                </FeatureLink>
              </FeatureCard>
            </FeaturesGrid>
          </SectionContent>
        </Section>

        {/* Créneaux Disponibles Section */}
        <Section dark id="creneaux">
          <SectionContent>
            <SectionHeader>
              <SectionTitle>Réservez votre créneau</SectionTitle>
              <SectionSubtitle>
                Trouvez et réservez facilement un terrain de futsal pour votre prochain match
              </SectionSubtitle>
            </SectionHeader>

            <SlotsContainer>
              <SlotsHeader>
                <SlotsTitle>Créneaux disponibles</SlotsTitle>
                <DateNavigation>
                  <NavButton onClick={handlePrevWeek}>
                    ←
                  </NavButton>
                  <CurrentMonth>
                    {startOfWeek.format('MMMM YYYY')}
                  </CurrentMonth>
                  <NavButton onClick={handleNextWeek}>
                    →
                  </NavButton>
                </DateNavigation>
              </SlotsHeader>

              <DaysGrid>
                {jours.map((jour, idx) => (
                    <DayCell
                        key={idx}
                        selected={selectedDate === jour.format('YYYY-MM-DD')}
                        onClick={() => handleDateSelect(jour)}
                    >
                      <DayName>{jour.format('ddd')}</DayName>
                      <DayNumber>{jour.format('D')}</DayNumber>
                    </DayCell>
                ))}
              </DaysGrid>

              {selectedDate ? (
                  <FieldsContainer>
                    <h4 style={{ marginBottom: '20px', fontWeight: '600' }}>
                      Créneaux disponibles pour le {moment(selectedDate).format('DD MMMM YYYY')}
                    </h4>

                    {terrains.map((terrain) => {
                      const terrainCreneaux = creneaux.filter(
                          (c) => c.terrain.id === terrain.id
                      );

                      return (
                          <FieldCard key={terrain.id}>
                            <FieldName>{terrain.nom}</FieldName>

                            {terrainCreneaux.length === 0 ? (
                                <NoSlotsMessage>Aucun créneau disponible</NoSlotsMessage>
                            ) : (
                                <SlotGrid>
                                  {terrainCreneaux.map((creneau) => {
                                    const heureDebut = moment(creneau.dateHeureDebut).format("HH:mm");
                                    const heureFin = moment(creneau.dateHeureFin).format("HH:mm");

                                    return (
                                        <TimeSlot
                                            key={creneau.id}
                                            selected={newReservation.creneauId === creneau.id}
                                            disabled={!creneau.disponible || creneau.horsPeriode}
                                            onClick={() => handleSlotSelection(creneau)}
                                        >
                                          {heureDebut} - {heureFin}
                                        </TimeSlot>
                                    );
                                  })}
                                </SlotGrid>
                            )}
                          </FieldCard>
                      );
                    })}

                    {newReservation.terrainId && (
                        <ReservationInfo>
                          <ReservationText>
                            Vous allez réserver le{" "}
                            <strong>{moment(newReservation.date).format("DD MMMM YYYY")}</strong>{" "}
                            de{" "}
                            <strong>{moment(newReservation.startTime).format("HH:mm")}</strong>{" "}
                            à{" "}
                            <strong>{moment(newReservation.endTime).format("HH:mm")}</strong>{" "}
                            sur le{" "}
                            <strong>
                              {terrains.find((t) => t.id === newReservation.terrainId)?.nom}
                            </strong>
                          </ReservationText>

                          <ReservationButton onClick={submitReservation}>
                            Confirmer la réservation
                          </ReservationButton>
                        </ReservationInfo>
                    )}
                  </FieldsContainer>
              ) : (
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                      Sélectionnez une date pour voir les créneaux disponibles
                    </p>
                  </div>
              )}
            </SlotsContainer>
          </SectionContent>
        </Section>

        {/* Stats Section */}
        <Section>
          <SectionContent>
            <StatsGrid>
              <StatItem>
                <StatValue>10,000+</StatValue>
                <StatLabel>Joueurs actifs</StatLabel>
              </StatItem>

              <StatItem>
                <StatValue>1,200+</StatValue>
                <StatLabel>Équipes inscrites</StatLabel>
              </StatItem>

              <StatItem>
                <StatValue>20,000+</StatValue>
                <StatLabel>Matchs organisés</StatLabel>
              </StatItem>

              <StatItem>
                <StatValue>98%</StatValue>
                <StatLabel>Clients satisfaits</StatLabel>
              </StatItem>
            </StatsGrid>
          </SectionContent>
        </Section>

        {/* Tournaments Section */}
        <TournamentsSection id="tournois">
          <SectionContent>
            <SectionHeader>
              <SectionTitle>Tournois à venir</SectionTitle>
              <SectionSubtitle>
                Rejoignez nos tournois organisés et affrontez les meilleures équipes
              </SectionSubtitle>
            </SectionHeader>

            <TournamentsGrid>
              {tournois.map((tournoi) => (
                  <TournamentCard key={tournoi.id}>
                    <TournamentImage image={tournoi.image} />
                    <TournamentLabel>{tournoi.label}</TournamentLabel>
                    <TournamentContent>
                      <TournamentTitle>{tournoi.title}</TournamentTitle>

                      <TournamentDetails>
                        <DetailRow>
                          <DetailIcon>📅</DetailIcon>
                          <DetailText>
                            <strong>Date:</strong> {tournoi.date}
                          </DetailText>
                        </DetailRow>

                        <DetailRow>
                          <DetailIcon>👥</DetailIcon>
                          <DetailText>
                            <strong>{tournoi.equipes} équipes max</strong>
                          </DetailText>
                        </DetailRow>

                        <DetailRow>
                          <DetailIcon>💰</DetailIcon>
                          <DetailText>
                            <strong>Prix:</strong> {tournoi.prix}
                          </DetailText>
                        </DetailRow>
                      </TournamentDetails>

                      <TournamentButton to={`/tournois/${tournoi.id}`}>
                        Voir détails
                      </TournamentButton>
                    </TournamentContent>
                  </TournamentCard>
              ))}
            </TournamentsGrid>

            <SeeAllButton to="/tournois">
              Voir tous les tournois →
            </SeeAllButton>
          </SectionContent>
        </TournamentsSection>

        {/* How It Works Section */}
        <Section>
          <SectionContent>
            <SectionHeader>
              <SectionTitle>Comment ça marche</SectionTitle>
              <SectionSubtitle>
                Commencez à utiliser notre plateforme en quelques étapes simples
              </SectionSubtitle>
            </SectionHeader>

            <HowItWorksSteps>
              <Step>
                <StepNumber>1</StepNumber>
                <StepTitle>Créez votre équipe</StepTitle>
                <StepDescription>
                  Inscrivez-vous et créez votre équipe avec tous les joueurs et leurs profils.
                </StepDescription>
              </Step>

              <StepLine />

              <Step>
                <StepNumber>2</StepNumber>
                <StepTitle>Planifiez vos matchs</StepTitle>
                <StepDescription>
                  Organisez des matchs ou lancez des défis à d'autres équipes inscrites.
                </StepDescription>
              </Step>

              <StepLine />

              <Step>
                <StepNumber>3</StepNumber>
                <StepTitle>Jouez et suivez</StepTitle>
                <StepDescription>
                  Enregistrez les résultats et suivez les statistiques de votre équipe.
                </StepDescription>
              </Step>
            </HowItWorksSteps>
          </SectionContent>
        </Section>

        {/* Testimonials Section */}
        <Section dark>
          <SectionContent>
            <SectionHeader>
              <SectionTitle>Ce que disent nos utilisateurs</SectionTitle>
              <SectionSubtitle>
                Découvrez l'expérience de ceux qui utilisent notre plateforme au quotidien
              </SectionSubtitle>
            </SectionHeader>

            <TestimonialsContainer>
              {testimonials.map((testimonial, index) => (
                  <TestimonialCard
                      key={testimonial.id}
                      style={{ display: index === activeTestimonial ? 'block' : 'none' }}
                  >
                    <TestimonialText>
                      {testimonial.text}
                    </TestimonialText>
                    <TestimonialAuthor>
                      <AuthorAvatar>
                        <img src={testimonial.avatar} alt={testimonial.author} />
                      </AuthorAvatar>
                      <AuthorInfo>
                        <AuthorName>{testimonial.author}</AuthorName>
                        <AuthorRole>{testimonial.role}</AuthorRole>
                      </AuthorInfo>
                    </TestimonialAuthor>
                  </TestimonialCard>
              ))}

              <TestimonialDots>
                {testimonials.map((_, index) => (
                    <Dot
                        key={index}
                        active={index === activeTestimonial}
                        onClick={() => setActiveTestimonial(index)}
                    />
                ))}
              </TestimonialDots>
            </TestimonialsContainer>
          </SectionContent>
        </Section>

        {/* CTA Section */}
        <CTASection>
          <SectionContent>
            <CTATitle>Prêt à transformer votre expérience de futsal?</CTATitle>
            <CTAText>
              Rejoignez des milliers d'équipes qui ont déjà amélioré leur façon de gérer et de jouer au futsal.
            </CTAText>
            <CTAButton to="/register">Commencer gratuitement</CTAButton>
          </SectionContent>
        </CTASection>

        {/* Footer */}
        <Footer>
          <FooterContent>
            <div>
              <FooterLogo>
                <LogoIcon>⚽</LogoIcon>
                <span>FUTSAL</span>
              </FooterLogo>
              <FooterDescription>
                Votre partenaire de confiance pour organiser, gérer et profiter pleinement de votre passion pour le futsal. Rejoignez notre communauté grandissante!
              </FooterDescription>
              <SocialLinks>
                <SocialLink href="#" aria-label="Facebook"><FaFacebookF /></SocialLink>
                <SocialLink href="#" aria-label="Tiktok"><FaTiktok /></SocialLink>
                <SocialLink href="#" aria-label="Instagram"><FaInstagram /></SocialLink>
                <SocialLink href="#" aria-label="YouTube"><FaYoutube /></SocialLink>
              </SocialLinks>
            </div>

            <div>
              <FooterTitle>Nos Services</FooterTitle>
              <FooterLinks>
                <FooterLink><a href="#">Réservation de terrains</a></FooterLink>
                <FooterLink><a href="#">Organisation de tournois</a></FooterLink>
                <FooterLink><a href="#">Gestion d'équipes</a></FooterLink>
                <FooterLink><a href="#">Statistiques & Analyses</a></FooterLink>
              </FooterLinks>
            </div>

            <div>
              <FooterTitle>Aide & Support</FooterTitle>
              <FooterLinks>
                <FooterLink><a href="#">FAQ</a></FooterLink>
                <FooterLink><a href="#">Centre d'aide</a></FooterLink>
                <FooterLink><a href="#">Contactez-nous</a></FooterLink>
                <FooterLink><a href="#">Signaler un problème</a></FooterLink>
              </FooterLinks>
            </div>

            <div>
              <FooterTitle>Informations</FooterTitle>
              <FooterLinks>
                <FooterLink><a href="#">À propos de nous</a></FooterLink>
                <FooterLink><a href="#">Nos terrains partenaires</a></FooterLink>
                <FooterLink><a href="#">Actualités</a></FooterLink>
              </FooterLinks>
            </div>
          </FooterContent>

          <FooterBottom>
            <Copyright>© {new Date().getFullYear()} Futsal Center. Tous droits réservés.</Copyright>
            <BottomLinks>
              <a href="#">Conditions générales</a>
              <a href="#">Politique de confidentialité</a>
            </BottomLinks>
          </FooterBottom>
        </Footer>
      </PageContainer>
  );
};

export default Accueil;