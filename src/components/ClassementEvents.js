import React, { useState, useEffect } from 'react';

const ClassementEvents = () => {
  const [classement, setClassement] = useState([]);

  useEffect(() => {
    // Récupérer les moyennes des notes depuis l'API
    fetch('http://localhost:5000/average-notes')
      .then((response) => response.json())
      .then((data) => {
        // Mettre à jour l'état avec le classement trié
        setClassement(data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération du classement des événements:', error);
      });
  }, []); // Utilisation de la dépendance vide pour s'assurer que cela s'exécute une seule fois après le rendu initial

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
