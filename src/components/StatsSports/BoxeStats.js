import React, { useState } from 'react';

const BoxeStats = ({ updateGlobalStats }) => {
  const [roundsWon, setRoundsWon] = useState(0);
  const [totalPunches, setTotalPunches] = useState(0);
  const [knockouts, setKnockouts] = useState(0);
  const [penalties, setPenalties] = useState(0);

  const handleStatistiquesSubmit = (e) => {
    e.preventDefault();

    updateGlobalStats({
      boxe: {
        roundsWon: parseInt(roundsWon, 10),
        totalPunches: parseInt(totalPunches, 10),
        knockouts: parseInt(knockouts, 10),
        penalties: parseInt(penalties, 10),
      }
    });
  };

  return (
    <div>
      <h4>Statistiques de boxe :</h4>
      <div>
        <label>Rounds remportés :</label>
        <input type="number" value={roundsWon} onChange={(e) => setRoundsWon(e.target.value)} />
      </div>
      <div>
        <label>Total des coups :</label>
        <input type="number" value={totalPunches} onChange={(e) => setTotalPunches(e.target.value)} />
      </div>
      <div>
        <label>KO :</label>
        <input type="number" value={knockouts} onChange={(e) => setKnockouts(e.target.value)} />
      </div>
      <div>
        <label>Pénalités :</label>
        <input type="number" value={penalties} onChange={(e) => setPenalties(e.target.value)} />
      </div>
      <button type="submit" onClick={handleStatistiquesSubmit}>Valider</button>
    </div>
  );
};

export default BoxeStats;
