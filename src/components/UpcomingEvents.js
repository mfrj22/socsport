import React, { useEffect, useState } from 'react';

function UpcomingEvents() {
    const [events, setEvents] = useState([]);

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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UpcomingEvents;
