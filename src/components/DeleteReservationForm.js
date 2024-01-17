import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteReservationForm = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const handleDelete = () => {
    fetch(`http://localhost:5000/delete-reservation/${reservationId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Reservation deleted successfully') {
        toast.success('Réservation supprimée avec succès');
        navigate(-1);
      } else {
        toast.error('Erreur lors de la suppression de la réservation');
      }
    })
    .catch(error => {
      console.error('Erreur lors de la suppression de la réservation:', error);
      toast.error('Erreur lors de la suppression de la réservation');
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
