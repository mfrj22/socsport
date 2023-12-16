import React, { useEffect, useState } from 'react';

function HistoriqueReservation({ updateNotificationCount }) {
  const [evenements, setEvenements] = useState([]);
  
  useEffect(() => {
    // Récupérer les données nécessaires depuis le localStorage
    const storedEvenements = JSON.parse(localStorage.getItem('evenements')) || [];
    console.log('storedEvenements', storedEvenements);
    // Filtrer les événements distincts et avec une date dans la semaine à venir
    const filteredEvenements = filterEvenements(storedEvenements);
    console.log('filteredEvenements', filteredEvenements);
    
    setEvenements(filteredEvenements);
  }, []);

  // Fonction pour filtrer les événements distincts et avec une date dans la semaine à venir
  const filterEvenements = (evenements) => {
    const filtered = [];
    const uniqueIds = new Set();

    const currentDate = new Date();
    const passedDate = new Date();
    passedDate.setDate(currentDate.getDate() - 1);
    console.log('passedDate', passedDate);

    evenements.forEach((evenement) => {
        // Vérifier si l'événement a une date dans la semaine à venir
        console.log('evenement.date', evenement.date)
        const eventDate = new Date(evenement.date);
        if (eventDate <= passedDate) {
            // Vérifier si l'ID de l'événement est unique
            if (!uniqueIds.has(evenement.id)) {
            uniqueIds.add(evenement.id);
            filtered.push(evenement);
            }
        }
        });
        
    // const oneWeekFromNow = new Date();
    // oneWeekFromNow.setDate(currentDate.getDate() + 7);

    // evenements.forEach((evenement) => {
    //   // Vérifier si l'événement a une date dans la semaine à venir
    //   console.log('evenement.date', evenement.date)
    //   const eventDate = new Date(evenement.date);
    //   if (eventDate <= oneWeekFromNow && eventDate >= currentDate) {
    //     // Vérifier si l'ID de l'événement est unique
    //     if (!uniqueIds.has(evenement.id)) {
    //       uniqueIds.add(evenement.id);
    //       filtered.push(evenement);
    //     }
    //   }
    // });

    return filtered;
  };



  return (
    <div className="historiques-container">
      <h2>Historique</h2>
      {evenements.length > 0 ? (
        <table className="historiques-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Date</th>
              <th>Heure de début</th>
              <th>Heure de fin</th>
            </tr>
          </thead>
          <tbody>
            {evenements.map((evenement) => (
              <tr key={evenement.id} className="historiques-item">
                <td>{evenement.nom}</td>
                <td>{evenement.date}</td>
                <td>{evenement.heure_debut}</td>
                <td>{evenement.heure_fin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Vous n'êtes inscrit à aucun événement correspondant à vos critères.</p>
      )}
    </div>
  );
};

export default HistoriqueReservation;