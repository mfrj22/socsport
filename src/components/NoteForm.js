import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Form.css'
const NoteForm = () => {
  const { eventId } = useParams(); 
  const [note, setNote] = useState(''); 
  const handleNoteSubmit = (e) => {
    e.preventDefault();
    
    fetch(`http://localhost:5000/note-event/${eventId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note }), 
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success('Note ajoutée avec succès');
        console.log('Réponse du serveur:', data);
        setNote('');
      })
      .catch((error) => {
        console.error('Erreur lors de l\'enregistrement de la note:', error);
      });
  };

  return (
    <div className="form">
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
