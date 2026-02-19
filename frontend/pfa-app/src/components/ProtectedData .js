
import React, { useEffect, useState } from 'react';

const ProtectedData  = () => {
  const [data, setData] = useState(null); // Pour stocker la réponse de l'API
  const [error, setError] = useState(null); // Pour gérer les erreurs

  useEffect(() => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('token');

    // Vérifier si le token existe avant de faire la requête
    if (token) {
      fetch('http://localhost:5000/api/protected', {
        method: 'GET',  // Méthode GET pour récupérer les données
        headers: {
          'Authorization': `Bearer ${token}`,  // Ajouter le token dans les en-têtes
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('La requête a échoué');
          }
          return response.json();  // Convertir la réponse en JSON
        })
        .then((data) => setData(data))  // Stocker les données reçues
        .catch((error) => setError(error.message));  // Gérer les erreurs
    } else {
      setError('Token non trouvé. Vous devez vous connecter.');
    }
  }, []);  // Le tableau vide [] garantit que l'effet ne s'exécute qu'une seule fois après le montage du composant

  if (error) {
    return <div>Erreur : {error}</div>;  // Afficher une erreur si elle existe
  }

  if (!data) {
    return <div>Chargement...</div>;  // Afficher un message de chargement
  }

  return (
    <div>
      <h1>Données protégées</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>  {/* Afficher les données récupérées */}
    </div>
  );
};

export default ProtectedData ;
