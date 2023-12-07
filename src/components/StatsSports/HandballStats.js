import React, { useState } from 'react';

const HandballStats = ({ updateGlobalStats }) => {
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [saves, setSaves] = useState(0);
  const [penalties, setPenalties] = useState(0);

  const handleStatistiquesSubmit = (e) => {
    e.preventDefault();

    updateGlobalStats({
      goals: parseInt(goals, 10),
      assists: parseInt(assists, 10),
      saves: parseInt(saves, 10),
      penalties: parseInt(penalties, 10),
    });
  };

  return (
    <div>
      <h4>Statistiques de handball :</h4>
      <div>
        <label>Buts marqués :</label>
        <input type="number" value={goals} onChange={(e) => setGoals(e.target.value)} />
      </div>
      <div>
        <label>Passes décisives :</label>
        <input type="number" value={assists} onChange={(e) => setAssists(e.target.value)} />
      </div>
      <div>
        <label>Arrêts :</label>
        <input type="number" value={saves} onChange={(e) => setSaves(e.target.value)} />
      </div>
      <div>
        <label>Pénalties marqués :</label>
        <input type="number" value={penalties} onChange={(e) => setPenalties(e.target.value)} />
      </div>
    </div>
  );
};

export default HandballStats;
