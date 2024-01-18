import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function EventConnaissance() {
  const [events, setEvents] = useState([]);
  const [reservations, setReservations] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetch(`http://localhost:5000/events-connaissance/${username}`)
      .then(response => response.json())
      .then(data => {
        setEvents(data);
        console.log('Events:', data);
      });
  }, []);
  

  useEffect(() => {
    fetch(`http://localhost:5000/historique/${username}`)
      .then(response => response.json())
      .then(data => setReservations(data));
  }, [username]);

  const isEventReserved = (event) => {
    return reservations.some(reservation => reservation.evenement_id === event.evenement_id);
  };

  const isEventPassed = (event) => {
    const eventDateObj = new Date(event.evenement_date);
    const currentDate = new Date();
    return eventDateObj < currentDate;
  };

  const getReservationId = (event) => {
    const reservation = reservations.find(reservation => reservation.evenement_id === event.evenement_id);
    return reservation ? reservation.id : null;
  };

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
          <th>Réservation</th>
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
            <td>
              {!isEventReserved(event) && !isEventPassed(event) && (
                <Link to={`/add-reservation/${event.evenement_id}`}>Réserver</Link>
              )}
              {isEventReserved(event) && !isEventPassed(event) && (
                <Link to={`/delete-reservation/${getReservationId(event)}`}>Annuler réservation</Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EventConnaissance;
