import React, { useState } from 'react';

const RugbyStats = () => {
  const [tries, setTries] = useState(0);
  const [conversions, setConversions] = useState(0);
  const [penaltyGoals, setPenaltyGoals] = useState(0);
  const [dropGoals, setDropGoals] = useState(0);

  return (
    <div>
      <h4>Statistiques de rugby :</h4>
      <div>
        <label>Essais :</label>
        <input type="number" value={tries} onChange={(e) => setTries(e.target.value)} />
      </div>
      <div>
        <label>Transformations :</label>
        <input type="number" value={conversions} onChange={(e) => setConversions(e.target.value)} />
      </div>
      <div>
        <label>Pénalités réussies :</label>
        <input type="number" value={penaltyGoals} onChange={(e) => setPenaltyGoals(e.target.value)} />
      </div>
      <div>
        <label>Drops réussis :</label>
        <input type="number" value={dropGoals} onChange={(e) => setDropGoals(e.target.value)} />
      </div>
    </div>
  );
};

export default RugbyStats;
