import React from 'react';
import { Navigate } from 'react-router-dom';

// Version simplifiée pour un premier démarrage
// Ne vérifie pas réellement le statut admin pour le moment
const RequireAdmin = ({ children }) => {
  // Pour le moment, on suppose que l'utilisateur est admin
  // Vous implémenterez la vérification réelle plus tard
  const isAdmin = true;

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default RequireAdmin;