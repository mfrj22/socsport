import React, { useEffect, useState } from 'react';

function Notifications({ updateNotificationCount }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const username = localStorage.getItem('username');
      fetch(`http://localhost:5000/notifications/${username}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      })
      .then(response => response.json())
      .then(data => {
        setNotifications(data);
        updateNotificationCount(notifications.length);
        console.log('Success:', notifications.length);
      })
      .catch((error) => {
          console.error('Error:', error);
        });
  }, []);
  

//   fonction pour calculer le nombre de jours restants
  const getDaysLeft = (date) => {
    const currentDate = new Date();
    const eventDate = new Date(date);
    const timeDifference = eventDate.getTime() - currentDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
  }

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index} className="notification-item">
              L'événement {notification.evenement_nom} a lieu dans {getDaysLeft(notification.evenement_date)+1} jours.
              <br />
              {notification.evenement_date} à {notification.evenement_heure_debut}
            </li>
          ))}
        </ul>
      ) : (
        <p>Vous n'êtes inscrit à aucun événement correspondant à vos critères.</p>
      )}
      {/* Ajoutez d'autres informations ou mises en page nécessaires */}
    </div>
  );
}

export default Notifications;
