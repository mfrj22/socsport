import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const EventForm = () => {
  const { fieldId } = useParams();

  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [events, setEvents] = useState([]); // État pour stocker la liste des événements

  useEffect(() => {
    // Récupérez la liste des événements sur le terrain du backend
    fetch(`http://localhost:5000/events-for-field/${fieldId}`)
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Erreur lors de la récupération des événements:', error));
  }, [fieldId]);

  const handleEventSubmit = (e) => {
    e.preventDefault();

    // Validez les champs (vous pouvez ajouter davantage de validation)
    if (!eventName || !eventDate || !eventStartTime || !eventEndTime) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Créez l'objet d'événement avec les informations
    const eventData = {
      name: eventName,
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
    };

    
    console.log('Événements dans le composant EventForm :', events);

    // Appelez le serveur pour créer l'événement
// Dans EventForm.js, à l'intérieur de la fonction handleEventSubmit
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
      // Événement créé avec succès, vous pouvez effectuer une action ici (par exemple, redirection)
      // Réinitialisez les champs du formulaire
      setEventName('');
      setEventDate('');
      setEventStartTime('');
      setEventEndTime('');
      
      // Maintenant, appelez la route pour obtenir les événements pour le terrain
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

  return (
    <div>
      <h2>Créer un événement pour le terrain avec l'ID {fieldId}</h2>
      <Link to="/">Retour aux terrains</Link>
      <form onSubmit={handleEventSubmit}>
        {/* ... Reste du formulaire */}
        <label>Nom de l'événement:</label>
        <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />

        <label>Date:</label>
        <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />

        <label>Heure de début:</label>
        <input type="time" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)} />

        <label>Heure de fin:</label>
        <input type="time" value={eventEndTime} onChange={(e) => setEventEndTime(e.target.value)} />

        {/* <input type="hidden" value={fieldId} /> */}
        <button type="submit">Créer l'événement</button>
      </form>

      <div>
        <h2>Événements pour le terrain avec l'ID {fieldId}</h2>
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              {event.nom} - {event.date} - {event.heure_debut} - {event.heure_fin}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventForm;
