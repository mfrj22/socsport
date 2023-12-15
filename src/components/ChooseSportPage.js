import React, { useState, useEffect } from 'react';
import ChooseSportForm from './ChooseSportForm';

const ChooseSportPage = () => {
  const [sports, setSports] = useState([]);

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
  };

  return (
    <div>
      <h2>Formulaire de recommandation de sport</h2>
      <ChooseSportForm onSubmit={recommendSport} />
    </div>
  );
};

export default ChooseSportPage;
