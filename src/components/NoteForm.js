import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NoteForm = () => {
  const { eventId } = useParams(); // Récupère l'ID de l'événement depuis l'URL
  const [note, setNote] = useState(''); // État pour stocker la note

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    
    // Envoi de la note au serveur, par exemple via une requête POST
    fetch(`http://localhost:5000/note-event/${eventId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note }), // Envoyer la note dans le corps de la requête
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success('Note ajoutée avec succès');
        // Gérer la réponse du serveur si nécessaire
        console.log('Réponse du serveur:', data);
        // Réinitialiser l'état de la note après l'enregistrement
        setNote('');
      })
      .catch((error) => {
        console.error('Erreur lors de l\'enregistrement de la note:', error);
      });
  };

  return (
    <div>
        <ToastContainer />
      <h2>Évaluer l'événement {eventId}</h2>
      <form onSubmit={handleNoteSubmit}>
        <label>Note :</label>
        <input
          type="number"
          min="1"
          max="5"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit">Enregistrer la note</button>
      </form>
    </div>
  );
};

export default NoteForm;
