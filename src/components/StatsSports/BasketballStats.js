import React, { useState } from 'react';

const BasketballStats = ({ updateGlobalStats }) => {
  const [points, setPoints] = useState(0);
  const [assists, setAssists] = useState(0);
  const [rebounds, setRebounds] = useState(0);
  const [steals, setSteals] = useState(0);

  const handleStatistiquesSubmit = (e) => {
    e.preventDefault();

    // Mettez à jour les statistiques globales via la fonction fournie
    updateGlobalStats({
      basketball : {
        points: parseInt(points, 10),
        assists: parseInt(assists, 10),
        rebounds: parseInt(rebounds, 10),
        steals: parseInt(steals, 10),
      }
    });
  };

  return (
    <div>
      <h4>Statistiques de basketball :</h4>
      <div>
        <label>Points :</label>
        <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} />
      </div>
      <div>
        <label>Passes décisives :</label>
        <input type="number" value={assists} onChange={(e) => setAssists(e.target.value)} />
      </div>
      <div>
        <label>Rebonds :</label>
        <input type="number" value={rebounds} onChange={(e) => setRebounds(e.target.value)} />
      </div>
      <div>
        <label>Interceptions :</label>
        <input type="number" value={steals} onChange={(e) => setSteals(e.target.value)} />
      </div>
      <button type="submit" onClick={handleStatistiquesSubmit}>Valider</button>
    </div>
  );
};

export default BasketballStats;
