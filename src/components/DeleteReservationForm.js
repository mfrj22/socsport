import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteReservationForm = () => {
  const { reservationId } = useParams();
  console.log('reservationId:', reservationId);
  const navigate = useNavigate();

  const handleDelete = () => {
    fetch(`http://localhost:5000/delete-reservation/${reservationId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Reservation with provided ID does not exist' : response.statusText);
      }
      return response.json();
    })
    .then(data => {
      if (data.message === 'Reservation deleted successfully') {
        toast.success('Réservation supprimée avec succès');
        navigate(-1);
      }
    })
    .catch(error => {
      console.error('Erreur lors de la suppression de la réservation:', error);
      toast.error('Erreur lors de la suppression de la réservation: ' + error.message);
    });
};



  return (
    <div>
      <ToastContainer />
      <h2>Êtes-vous sûr de vouloir supprimer cette réservation ?</h2>
      <button onClick={handleDelete}>Oui, supprimer</button>
      <button onClick={() => navigate(-1)}>Non, retourner</button>
    </div>
  );
};

export default DeleteReservationForm;
