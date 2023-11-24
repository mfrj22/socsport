import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function AddReservationForm() {
  const [reservationData, setReservationData] = useState({
    nom_participant: '',
    prenom_participant: '',
    email_participant: '',
    tel_participant: '',
  });

  const { eventId } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData({ ...reservationData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/add-reservation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        evenement_id: eventId,
        ...reservationData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Reservation created successfully:', data);
        // Vous pouvez rediriger l'utilisateur vers une autre page après la création de la réservation
        // navigate(`/nouvelle-page`);
      })
      .catch((error) => {
        console.error('Error creating reservation:', error);
      });
  };

  return (
    <div>
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
        <button type="submit">Réserver</button>
      </form>
    </div>
  );
}

export default AddReservationForm;
