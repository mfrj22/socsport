import React, { useState } from 'react';

const TennisStats = ({ updateGlobalStats }) => {
  const [aces, setAces] = useState(0);
  const [doubleFaults, setDoubleFaults] = useState(0);
  const [firstServePercentage, setFirstServePercentage] = useState(0);
  const [winningPercentage, setWinningPercentage] = useState(0);

  const handleStatistiquesSubmit = (e) => {
    e.preventDefault();

    updateGlobalStats({
      tennis: {
        aces: parseInt(aces, 10),
        doubleFaults: parseInt(doubleFaults, 10),
        firstServePercentage: parseInt(firstServePercentage, 10),
        winningPercentage: parseInt(winningPercentage, 10),
        }
    });
  };

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
      <button type="submit" onClick={handleStatistiquesSubmit}>Valider</button>
    </div>
  );
};

export default TennisStats;
