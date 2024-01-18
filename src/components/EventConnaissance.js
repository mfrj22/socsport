import React, { useEffect, useState } from 'react';

function EventConnaissance() {
  const [events, setEvents] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetch(`http://localhost:5000/events-connaissance/${username}`)
      .then(response => response.json())
      .then(data => setEvents(data));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Date</th>
          <th>Heure de début</th>
          <th>Heure de fin</th>
          <th>Nom du terrain</th>
          <th>Connaissance</th>
        </tr>
      </thead>
      <tbody>
        {events.map(event => (
          <tr key={event.evenement_id}>
            <td>{event.evenement_nom}</td>
            <td>{event.evenement_date}</td>
            <td>{event.evenement_heure_debut}</td>
            <td>{event.evenement_heure_fin}</td>
            <td>{event.terrain_nom}</td>
            <td>{event.connaissance_nom}</td>
         </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EventConnaissance;
