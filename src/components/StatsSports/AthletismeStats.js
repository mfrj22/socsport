import React, { useState } from 'react';

const AthletismeStats = () => {
  const [sprintTime, setSprintTime] = useState('');
  const [longJumpDistance, setLongJumpDistance] = useState(0);
  const [shotPutDistance, setShotPutDistance] = useState(0);
  const [highJumpHeight, setHighJumpHeight] = useState(0);

  return (
    <div>
      <h4>Statistiques d'athlétisme :</h4>
      <div>
        <label>Temps de sprint :</label>
        <input type="text" value={sprintTime} onChange={(e) => setSprintTime(e.target.value)} />
      </div>
      <div>
        <label>Distance de saut en longueur :</label>
        <input type="number" value={longJumpDistance} onChange={(e) => setLongJumpDistance(e.target.value)} />
      </div>
      <div>
        <label>Distance de lancer du poids :</label>
        <input type="number" value={shotPutDistance} onChange={(e) => setShotPutDistance(e.target.value)} />
      </div>
      <div>
        <label>Hauteur de saut en hauteur :</label>
        <input type="number" value={highJumpHeight} onChange={(e) => setHighJumpHeight(e.target.value)} />
      </div>
    </div>
  );
};

export default AthletismeStats;
