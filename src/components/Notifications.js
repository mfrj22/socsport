import React, { useEffect, useState } from 'react';

function Notifications({ updateNotificationCount }) {
  const [evenements, setEvenements] = useState([]);
  // const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Récupérer les données nécessaires depuis le localStorage
    const storedEvenements = JSON.parse(localStorage.getItem('evenements')) || [];
    console.log('storedEvenements', storedEvenements);
    // Filtrer les événements distincts et avec une date dans la semaine à venir
    const filteredEvenements = filterEvenements(storedEvenements);
    console.log('filteredEvenements', filteredEvenements);

    // Mettre à jour le nombre de notifications
    updateNotificationCount(filteredEvenements.length);
    
    setEvenements(filteredEvenements);
  }, []);

  // Fonction pour filtrer les événements distincts et avec une date dans la semaine à venir
  const filterEvenements = (evenements) => {
    const filtered = [];
    const uniqueIds = new Set();

    const currentDate = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(currentDate.getDate() + 7);

    evenements.forEach((evenement) => {
      // Vérifier si l'événement a une date dans la semaine à venir
      console.log('evenement.date', evenement.date)
      const eventDate = new Date(evenement.date);
      if (eventDate <= oneWeekFromNow && eventDate >= currentDate) {
        // Vérifier si l'ID de l'événement est unique
        if (!uniqueIds.has(evenement.id)) {
          uniqueIds.add(evenement.id);
          filtered.push(evenement);
        }
      }
    });

    return filtered;
  };

//   fonction pour calculer le nombre de jours restants
  const getDaysLeft = (date) => {
    const currentDate = new Date();
    const eventDate = new Date(date);
    const timeDifference = eventDate.getTime() - currentDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
  }

  return (
    <div>
      <h2>Notifications</h2>
      {evenements.length > 0 ? (
        <ul>
          {evenements.map((evenement) => (
            <li key={evenement.id}>
              L'événement {evenement.nom} a lieu dans {getDaysLeft(evenement.date)+1} jours.
              <br />
              {evenement.date} à {evenement.heure_debut}
            </li>
          ))}
        </ul>
      ) : (
        <p>Vous n'êtes inscrit à aucun événement correspondant à vos critères.</p>
      )}
      {/* Ajoutez d'autres informations ou mises en page nécessaires */}
    </div>
  );
}

export default Notifications;
