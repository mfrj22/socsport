import React, { useEffect, useState } from 'react';

function NotificationsPage() {
  const [evenementId, setEvenementId] = useState('');

  useEffect(() => {
    // Récupérer les données nécessaires depuis le localStorage
    const storedEvenementId = localStorage.getItem('evenements');
    setEvenementId(storedEvenementId);
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {evenementId && (
        <p>Vous êtes inscrit à l'événement avec l'ID : {evenementId}</p>
      )}
      {/* Ajoutez d'autres informations ou mises en page nécessaires */}
    </div>
  );
}

export default NotificationsPage;
