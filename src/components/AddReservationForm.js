import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Form.css'
function AddReservationForm() {
  const [reservationData, setReservationData] = useState({
    nom_participant: '',
    prenom_participant: '',
    email_participant: '',
    tel_participant: '',
    event_password: '',
  });

  const { eventId } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData({ ...reservationData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = localStorage.getItem('username');

    if(!username) {
      toast.error('Vous devez être connecté pour réserver!'); // Affichage de la notification
      return;
    }

    fetch(`http://localhost:5000/add-reservation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        evenement_id: eventId,
        username: localStorage.getItem('username'),
        ...reservationData,
      }),
    })
      .then((response)  => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })

      .then((data) => {
        console.log('Reservation created successfully:', data);
        toast.success('Réservation avec succès');
      })
      .catch((error) =>  {
      console.error('Error creating reservation:', error);
      if (error.message === 'Network response was not ok') {
        toast.error('Vous ne pouvez plus reserver!'); // Affichage de la notification
      }
      // jusque la a peu pres
      
    });
    console.log('username:', localStorage.getItem('username'));

  };

  return (
    <div className="form">
       <ToastContainer />
      <h2>Formulaire de Réservation</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nom :
          <input
            type="text"
            name="nom_participant"
            value={reservationData.nom_participant}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Prénom :
          <input
            type="text"
            name="prenom_participant"
            value={reservationData.prenom_participant}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Email :
          <input
            type="email"
            name="email_participant"
            value={reservationData.email_participant}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Téléphone :
          <input
            type="tel"
            name="tel_participant"
            value={reservationData.tel_participant}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Mot de passe :
          <input
            type="password"
            name="event_password"
            value={reservationData.event_password}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Réserver</button>
      </form>
    </div>
  );
}

export default AddReservationForm;