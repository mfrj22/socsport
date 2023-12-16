import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventForm = () => {
  const { fieldId } = useParams();

  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventNbP, setEventNbP] = useState('');
  const [events, setEvents] = useState([]);
  const [averageNotes, setAverageNotes] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/average-notes')
      .then((response) => response.json())
      .then((data) => setAverageNotes(data))
      .catch((error) => console.error('Erreur lors de la récupération des moyennes des notes:', error));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/events-for-field/${fieldId}`)
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Erreur lors de la récupération des événements:', error));
  }, [fieldId]);

  const handleEventSubmit = (e) => {
    e.preventDefault();

    if (!eventName || !eventDate || !eventStartTime || !eventEndTime) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const eventData = {
      name: eventName,
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      nbParticipants: eventNbP,
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

  const isEventInFuture = (event) => {
    const eventDateObj = new Date(event.date);
    const currentDate = new Date();
    return eventDateObj < currentDate;
  };

  const isEventInLocalStorage = (event) => {
    const storedEvenements = JSON.parse(localStorage.getItem('evenements')) || [];
    const eventIds = storedEvenements.map((evenement) => evenement.id);
    return eventIds.includes(event.id);
  }

  const round = (number, decimals) => {
    return Number(Math.round(number + 'e' + decimals) + 'e-' + decimals);
  };


  return (
    <div>
      <ToastContainer />
      <h2>Créer un événement pour le terrain avec l'ID {fieldId}</h2>
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
        {/* <input type="hidden" value={fieldId} /> */}
        <button type="submit">Créer l'événement</button>
      </form>

      <div>
        <h2>Événements pour le terrain avec l'ID {fieldId}</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
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
                <td>{event.id}</td>
                <td>
                  <Link to={`/add-reservation/${event.id}`}>{event.nom}</Link>
                </td>
                <td>{event.date}</td>
                <td>{event.heure_debut}</td>
                <td>{event.heure_fin}</td>
                <td>{event.nb_participants}</td>
                <td>
                  {isEventInFuture(event) && isEventInLocalStorage(event) && (
                    <Link to={`/stats-event/${event.id}`}>Statistiques</Link>
                  )}
                </td>
                <td>
                  {isEventInFuture(event) && isEventInLocalStorage(event) && (
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
  );
};

export default EventForm;