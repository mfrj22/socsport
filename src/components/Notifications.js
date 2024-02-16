import React, { useEffect, useState } from 'react';

function Notifications({ updateNotificationCount }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const username = localStorage.getItem('username');

    Promise.all([
      fetch(`http://localhost:5000/notifications/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => response.json()),
      fetch(`http://localhost:5000/events-simultanes-user/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => response.json())
    ])
    .then(([notificationsData, simultaneousEventsData]) => {
      const newNotifications = [...notificationsData];
      
      simultaneousEventsData.forEach(event => {
        newNotifications.push({
          evenement_nom: event.nom,
          evenement_date: event.date,
          evenement_heure_debut: event.heure_debut,
          isSimultaneous: true
        });
      });

      setNotifications(newNotifications);
      updateNotificationCount(newNotifications.length);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }, []);

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
              {notification.isSimultaneous ? (
                <>Un autre événement, {notification.evenement_nom}, a lieu en même temps que l'un de vos événements.<br />
                {notification.evenement_date} à {notification.evenement_heure_debut}</>
              ) : (
                <>L'événement {notification.evenement_nom} a lieu dans {getDaysLeft(notification.evenement_date)+1} jours.<br />
                {notification.evenement_date} à {notification.evenement_heure_debut}</>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Vous n'êtes inscrit à aucun événement correspondant à vos critères.</p>
      )}
    </div>
  );
}

export default Notifications;
