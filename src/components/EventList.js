import React from 'react';

const EventList = ({ events }) => {
  return (
    <div>
      <h2>Liste des événements :</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.nom} - {event.date} - {event.heure_debut} à {event.heure_fin}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
