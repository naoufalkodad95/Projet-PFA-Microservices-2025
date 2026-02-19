import React from "react";
import { Container } from 'react-bootstrap';
import JoueurNavbar from '../../../components/JoueurNavbar';


function JoueurDashboard() { 
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const role = localStorage.getItem("role");

  return (
  
      <>
      <JoueurNavbar /> 
        <Container>
        {/* <div className="mb-3">
            <p><strong>ID:</strong> {userId}</p>
            <p><strong>Prénom:</strong> {firstName}</p>
            <p><strong>Nom:</strong> {lastName}</p>
            <p><strong>Role:</strong> {role}</p>
          </div> */}
        </Container>

        </>


      
       
 

      );}
export default JoueurDashboard;
