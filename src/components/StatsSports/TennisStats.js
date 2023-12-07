import React, { useState } from 'react';

const TennisStats = () => {
  const [aces, setAces] = useState(0);
  const [doubleFaults, setDoubleFaults] = useState(0);
  const [firstServePercentage, setFirstServePercentage] = useState(0);
  const [winningPercentage, setWinningPercentage] = useState(0);

  return (
    <div>
      <h4>Statistiques de tennis :</h4>
      <div>
        <label>Aces :</label>
        <input type="number" value={aces} onChange={(e) => setAces(e.target.value)} />
      </div>
      <div>
        <label>Double fautes :</label>
        <input type="number" value={doubleFaults} onChange={(e) => setDoubleFaults(e.target.value)} />
      </div>
      <div>
        <label>Pourcentage de premières balles :</label>
        <input
          type="number"
          value={firstServePercentage}
          onChange={(e) => setFirstServePercentage(e.target.value)}
        />
      </div>
      <div>
        <label>Pourcentage de victoires :</label>
        <input type="number" value={winningPercentage} onChange={(e) => setWinningPercentage(e.target.value)} />
      </div>
    </div>
  );
};

export default TennisStats;
