// src/components/Match/MatchListPlayer.jsx
import React from 'react';

const MatchListPlayer = ({ matchs }) => {
  return (
    <div>
      <h3>Liste des matchs</h3>
      <ul>
        {matchs.map((match) => (
          <li key={match.id}>
            {match.equipe1} vs {match.equipe2} - Score: {match.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchListPlayer;
