import React, { useState, useEffect } from 'react';

const ClassementEvents = () => {
  const [classement, setClassement] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/classement-events')
      .then((response) => response.json())
      .then((data) => {
        const classementData = data.map((event) => ({
          ...event,
          average_note: parseFloat(event.average_note),
        }));
        const classementTri = classementData.sort((a, b) => b.average_note - a.average_note);
        setClassement(classementTri);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération du classement des événements:', error);
      });
  }, []); 

  return (
    <div className="classement-container">
      <h2>Classement des événements</h2>
      {classement.length > 0 ? (
        <table className="classement-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Nom de l'événement</th>
              <th>Moyenne</th>
            </tr>
          </thead>
          <tbody>
            {classement.map((event, index) => (
              <tr key={event.evenement_id} className="classement-item">
                <td>{index + 1}</td>
                <td>{event.evenement_nom}</td>
                <td>{event.average_note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun événement disponible pour le classement.</p>
      )}
    </div>
  );
};

export default ClassementEvents;
