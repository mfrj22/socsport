import React from 'react';
import ChooseSportForm from './ChooseSportForm';

const ChooseSportPage = () => {
  const recommendSport = (formData) => {

    const { teamOrIndividual, typeSport, playStyle, indoorOutdoor } = formData;

    let recommendedSport = '';

    if (teamOrIndividual === 'equipe' && typeSport === 'ballon' && playStyle === 'pied') {
      recommendedSport = 'football';
    } else if (teamOrIndividual === 'equipe' && typeSport === 'ballon' && playStyle === 'main' && indoorOutdoor === 'interieur') {
      recommendedSport = 'handball';
    } else if (teamOrIndividual === 'equipe' && typeSport === 'ballon' && playStyle === 'main' && indoorOutdoor === 'exterieur') {
      recommendedSport = 'basketball';
    } else if (teamOrIndividual === 'equipe' && typeSport === 'ballon' && playStyle === 'deux' && indoorOutdoor === 'exterieur') {
      recommendedSport = 'rugby';
    } else if (typeSport === 'raquette') {
      recommendedSport = 'tennis';
    } else if (typeSport === 'combat') {
      recommendedSport = 'boxe';
    } else {
      recommendedSport = 'football';
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