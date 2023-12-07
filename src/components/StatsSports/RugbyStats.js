import React, { useState } from 'react';

const RugbyStats = ({ updateGlobalStats }) => {
  const [tries, setTries] = useState(0);
  const [conversions, setConversions] = useState(0);
  const [penaltyGoals, setPenaltyGoals] = useState(0);
  const [dropGoals, setDropGoals] = useState(0);

  const handleStatistiquesSubmit = (e) => {
    e.preventDefault();

    updateGlobalStats({
      tries: parseInt(tries, 10),
      conversions: parseInt(conversions, 10),
      penaltyGoals: parseInt(penaltyGoals, 10),
      dropGoals: parseInt(dropGoals, 10),
    });
  };

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
