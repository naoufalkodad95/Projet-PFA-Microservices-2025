// src/components/Classement/ClassementTournoiPlayer.jsx
import React from 'react';

const ClassementTournoiPlayer = ({ classement }) => {
  return (
    <div>
      <h3>Classement des équipes</h3>
      <ul>
        {classement.map((equipe, index) => (
          <li key={index}>
            {index + 1}. {equipe.equipe} - {equipe.points} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassementTournoiPlayer;
