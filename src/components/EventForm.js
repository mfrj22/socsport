import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// import AddReservationForm from './components/AddReservationForm';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventForm = () => {
  const { fieldId } = useParams(); // 

  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventNbP,setEventNbP] = useState('');
  const [events, setEvents] = useState([]); // État pour stocker la liste des événements
  // const [selectedEventId, setSelectedEventId] = useState(null);
  //

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
    //

    // Créez l'objet d'événement avec les informations
    const eventData = {
      name: eventName,
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      nbParticipants : eventNbP
    };
    //
    
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
      toast.success('Evènement créé avec succès');
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
      <ToastContainer />
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

        <label>Nombre de participants:</label>
        <input type="number" value={eventNbP} onChange={(e) => setEventNbP(e.target.value)} />

        {/* <input type="hidden" value={fieldId} /> */}
        <button type="submit">Créer l'événement</button>
      </form>

      <div>
        <h2>Événements pour le terrain avec l'ID {fieldId}</h2>
        <Link to="/add-terrain">Ajouter un terrain</Link>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Date</th>
            <th>Heure début</th>
            <th>Heure fin</th>
            <th>Nombre de participants</th>
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
            </tr>
        ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default EventForm;