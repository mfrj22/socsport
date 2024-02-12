import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Form.css'

const EventForm = () => {
  const { fieldId } = useParams();
  const [fieldName, setFieldName] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventNbP, setEventNbP] = useState('');
  const [eventPassword, setEventPassword] = useState(''); // Nouvel état pour le mot de passe de l'événement
  const [events, setEvents] = useState([]);
  const [averageNotes, setAverageNotes] = useState({});
  const [reservations, setReservations] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetch(`http://localhost:5000/historique/${username}`)
      .then(response => response.json())
      .then(data => {
        console.log('Reservations:', data);
        setReservations(data);
      })
      .catch(error => console.error('Erreur lors de la récupération des réservations:', error));
  }, [username]);

  useEffect(() => {
    fetch('http://localhost:5000/average-notes')
      .then((response) => response.json())
      .then((data) => setAverageNotes(data))
      .catch((error) => console.error('Erreur lors de la récupération des moyennes des notes:', error));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/events-for-field/${fieldId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Events:', data);
        setEvents(data);
      })
      .catch((error) => console.error('Erreur lors de la récupération des événements:', error));
  }, [fieldId]);

  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (!username) {
      // Afficher un toast si l'utilisateur n'est pas connecté
      toast.error('Vous devez être connecté pour créer un événement');
      return;
    }

    if (!eventName || !eventDate || !eventStartTime || !eventEndTime || !eventPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const eventData = {
      name: eventName,
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      nbParticipants: eventNbP,
      mot_de_passe: eventPassword, // Ajout du mot de passe dans les données de l'événement
      username: username,
    };

    fetch(`http://localhost:5000/create-event/${fieldId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Event created successfully') {
          toast.success('Evènement créé avec succès');
          setEventName('');
          setEventDate('');
          setEventStartTime('');
          setEventEndTime('');
          setEventPassword(''); // Effacer le mot de passe après la création de l'événement

          fetch(`http://localhost:5000/events-for-field/${fieldId}`)
            .then((response) => response.json())
            .then((events) => {
              setEvents(events);
            })
            .catch((error) => {
              console.error('Erreur lors de la récupération des événements:', error);
            });
        } else {
          alert('Erreur lors de la création de l\'événement');
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la création de l\'événement:', error);
      });
  };

  const isEventReserved = (event) => {
    if (Array.isArray(reservations)) {
      const isReserved = reservations.some(reservation => {
        console.log('Event ID:', event.id);
        console.log('Reservation ID:', reservation.evenement_id);
        return reservation.evenement_id === event.id;
      });
      console.log('Is reserved:', isReserved);
      return isReserved;
    }
    return false;
  };

  const isEventPassed = (event) => {
    const eventDateObj = new Date(event.date);
    const currentDate = new Date();
    return eventDateObj < currentDate;
  };

  const getReservationId = (event) => {
    const reservation = reservations.find(reservation => reservation.evenement_id === event.id);
    return reservation ? reservation.id : null;
  };

  const round = (number, decimals) => {
    return Number(Math.round(number + 'e' + decimals) + 'e-' + decimals);
  };

  return (
    <>
      <div className="form">
        <ToastContainer />
        <h2>Créer un événement pour le terrain d'ID {fieldId}</h2>
        <form onSubmit={handleEventSubmit}>
          <div>
            <label>Nom de l'événement:</label>
            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
          </div>

          <div>
            <label>Date:</label>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </div>

          <div>
            <label>Heure de début:</label>
            <input type="time" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)} />
          </div>

          <div>
            <label>Heure de fin:</label>
            <input type="time" value={eventEndTime} onChange={(e) => setEventEndTime(e.target.value)} />
          </div>

          <div>
            <label>Nombre de participants:</label>
            <input type="number" value={eventNbP} onChange={(e) => setEventNbP(e.target.value)} />
          </div>

          <div>
            <label>Mot de passe de l'événement:</label>
            <input type="password" value={eventPassword} onChange={(e) => setEventPassword(e.target.value)} />
          </div>

          <button type="submit">Créer l'événement</button>
        </form>
      </div>
      <div>
        <div>
          <h2>Événements pour le terrain avec l'ID {fieldId}</h2>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Date</th>
                <th>Heure début</th>
                <th>Heure fin</th>
                <th>Nombre de participants</th>
                <th>Stats</th>
                <th>Noter</th>
                <th>Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index}>
                  <td>
                    {!isEventReserved(event) && !isEventPassed(event) && (
                      <Link to={`/add-reservation/${event.id}`}>{event.nom}</Link>
                    )}
                    {isEventReserved(event) && !isEventPassed(event) && (
                      <Link to={`/delete-reservation/${getReservationId(event)}`}>{event.nom}</Link>
                    )}
                    {isEventPassed(event) && (
                      event.nom
                    )}
                  </td>
                  <td>{event.date}</td>
                  <td>{event.heure_debut}</td>
                  <td>{event.heure_fin}</td>
                  <td>{event.nb_participants}</td>
                  <td>
                    {isEventReserved(event) && isEventPassed(event) && (
                      <Link to={`/stats-event/${event.id}`}>Statistiques</Link>
                    )}
                  </td>
                  <td>
                    {isEventReserved(event) && isEventPassed(event) && (
                      <Link to={`/note-event/${event.id}`}>Noter</Link>
                    )}
                  </td>
                  <td>
                    {averageNotes[event.id] !== undefined ? round(averageNotes[event.id], 2) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EventForm;
