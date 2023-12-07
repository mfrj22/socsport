import React, { useState } from 'react';

const FootballStats = () => {
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [yellowCards, setYellowCards] = useState(0);
  const [redCards, setRedCards] = useState(0);

  return (
    <div>
      <h4>Statistiques de football :</h4>
      <div>
        <label>Buts :</label>
        <input type="number" value={goals} onChange={(e) => setGoals(e.target.value)} />
      </div>
      <div>
        <label>Passes décisives :</label>
        <input type="number" value={assists} onChange={(e) => setAssists(e.target.value)} />
      </div>
      <div>
        <label>Cartons jaunes :</label>
        <input type="number" value={yellowCards} onChange={(e) => setYellowCards(e.target.value)} />
      </div>
      <div>
        <label>Cartons rouges :</label>
        <input type="number" value={redCards} onChange={(e) => setRedCards(e.target.value)} />
      </div>
    </div>
  );
};

export default FootballStats;
