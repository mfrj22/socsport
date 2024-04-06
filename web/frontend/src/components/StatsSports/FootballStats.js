import React, { useState } from 'react';

const FootballStats = ({ updateGlobalStats }) => {
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [yellowCards, setYellowCards] = useState(0);
  const [redCards, setRedCards] = useState(0);

  const handleStatistiquesSubmit = (e) => {
    e.preventDefault();

    updateGlobalStats({
      football: {
        goals: parseInt(goals, 10),
        assists: parseInt(assists, 10),
        yellowCards: parseInt(yellowCards, 10),
        redCards: parseInt(redCards, 10),
      }
    });
  };

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
      <button type="submit" onClick={handleStatistiquesSubmit}>Valider</button>
    </div>
  );
};

export default FootballStats;
