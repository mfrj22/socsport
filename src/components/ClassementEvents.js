import React, { useState, useEffect } from 'react';

const ClassementEvents = () => {
  const [classement, setClassement] = useState([]);

  useEffect(() => {
    // Récupérer les moyennes des notes depuis l'API
    fetch('http://localhost:5000/average-notes')
      .then((response) => response.json())
      .then((data) => {
        // Convertir le dictionnaire de moyennes des notes en un tableau d'objets
        const classementArray = Object.entries(data).map(([event_id, note_moyenne]) => ({
          id: event_id,
          note_moyenne: parseFloat(note_moyenne), // Assurez-vous que la note moyenne est un nombre
        }));

        // Trier le tableau par note moyenne de manière décroissante
        const classementSorted = classementArray.sort((a, b) => b.note_moyenne - a.note_moyenne);

        // Mettre à jour l'état avec le classement trié
        setClassement(classementSorted);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération du classement des événements:', error);
      });
  }, []); // Utilisation de la dépendance vide pour s'assurer que cela s'exécute une seule fois après le rendu initial

  return (
    <div className="classement-container">
      <h2>Classement des événements par note moyenne</h2>
      {classement.length > 0 ? (
        <table className="classement-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>ID</th>
              <th>Note moyenne</th>
            </tr>
          </thead>
          <tbody>
            {classement.map((event, index) => (
              <tr key={event.id} className="classement-item">
                <td>{index + 1}</td>
                <td>{event.id}</td>
                <td>{event.note_moyenne}</td>
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
