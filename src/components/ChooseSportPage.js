// ChooseSportPage.js

import React from 'react';
import ChooseSportForm from './ChooseSportForm';

const ChooseSportPage = () => {
  const handleFormSubmit = (formData) => {
    // Ajoutez ici la logique pour traiter les données du formulaire
    console.log('Formulaire soumis avec les données:', formData);
  };

  return (
    <div>
      <h2>Choisissez vos préférences sportives</h2>
      <ChooseSportForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default ChooseSportPage;
