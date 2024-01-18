import React, { useEffect, useState } from 'react';

function UpcomingEvents() {
    const [events, setEvents] = useState([]);
    const username = localStorage.getItem('username');

    const [userScore, setUserScore] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:5000/average-score/${username}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => setUserScore(data[username]))
          .catch(error => console.error('An error occurred while fetching the average score:', error));
      }, [username]);

    useEffect(() => {
        fetch('http://localhost:5000/average-score-events')
            .then(response => response.json())
            .then(data => setEvents(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Date</th>
                        <th>Heure de début</th>
                        <th>Heure de fin</th>
                        <th>Lieu</th>
                        <th>Score moyen</th>
                        <th>Recommandation</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event.evenement_id}>
                            <td>{event.evenement_nom}</td>
                            <td>{event.evenement_date}</td>
                            <td>{event.evenement_heure_debut}</td>
                            <td>{event.evenement_heure_fin}</td>
                            <td>{event.terrain_nom} ({event.ville_nom}, {event.ville_code_postal})</td>
                            <td>{event.average_score}</td>
                            <td>{(event.average_score - 5) <= userScore && userScore <= (event.average_score + 5) ? 'Recommandé' : 'Non recommandé'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UpcomingEvents;
