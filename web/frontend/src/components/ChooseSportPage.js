import React, { useState, useEffect } from 'react';
import ChooseSportForm from './ChooseSportForm';
import { Link } from 'react-router-dom';

const ChooseSportPage = () => {
  const [sports, setSports] = useState([]);
  const [recommendedSport, setRecommendedSport] = useState('');
  const [recommendedEvents, setRecommendedEvents] = useState([]);

  useEffect(() => {
    // Effectuer une requête vers le backend pour obtenir la liste des sports
    fetch('http://localhost:5000/sports')
      .then(response => response.json())
      .then(data => setSports(data))
      .catch(error => console.error('Erreur lors de la récupération des sports :', error));
  }, []);

  const recommendSport = (formData) => {
    const { teamOrIndividual, typeSport, playStyle, indoorOutdoor } = formData;

    let recommendedSport = '';

    if (teamOrIndividual === 'equipe' && typeSport === 'ballon' && playStyle === 'pied') {
        recommendedSport = sports.find(sport => sport.name.toLowerCase() === 'football');
    } else if (teamOrIndividual === 'equipe' && typeSport === 'ballon' && playStyle === 'main' && indoorOutdoor === 'interieur') {
        recommendedSport = sports.find(sport => sport.name.toLowerCase() === 'handball');
    } else if (teamOrIndividual === 'equipe' && typeSport === 'ballon' && playStyle === 'main' && indoorOutdoor === 'exterieur') {
        recommendedSport = sports.find(sport => sport.name.toLowerCase() === 'basketball');
    } else if (teamOrIndividual === 'equipe' && typeSport === 'ballon' && playStyle === 'deux' && indoorOutdoor === 'exterieur') {
        recommendedSport = sports.find(sport => sport.name.toLowerCase() === 'rugby');
    } else if (typeSport === 'raquette') {
        recommendedSport = sports.find(sport => sport.name.toLowerCase() === 'tennis');
    } else if (typeSport === 'combat') {
        recommendedSport = sports.find(sport => sport.name.toLowerCase() === 'boxe');
    } else {
        recommendedSport = sports.find(sport => sport.name.toLowerCase() === 'football');
    }

    console.log('Sport recommandé :', recommendedSport);
    setRecommendedSport(recommendedSport);

    if (recommendedSport) {
      fetch(`http://localhost:5000/events-for-sport/${recommendedSport.id}`)
        .then(response => response.json())
        .then(data => setRecommendedEvents(data))
        .catch(error => console.error('Erreur lors de la récupération des événements :', error));
    }
  };

  return (
    <div>
      <h2>Formulaire de recommandation de sport</h2>
      <ChooseSportForm onSubmit={recommendSport} />
      <p>Votre sport de prédilection est : {recommendedSport ? recommendedSport.name : ''}</p>
      

      {/* Afficher les événements recommandés */}
      {recommendedEvents.length > 0 && (
        <>
        <div>
        <h2>Evenements associés à votre sport :</h2>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Date</th>
              <th>Terrain</th>
            </tr>
          </thead>
          <tbody>
            {recommendedEvents.map(event => (
              <tr key={event.id}>
                <td>
                  <Link to={`/add-reservation/${event.id}`}>{event.nom}</Link>
                </td>
                <td>{event.date}</td>
                <td>{event.terrain.nom}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </>
      )}
    </div>
  );
};

export default ChooseSportPage;
