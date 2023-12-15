import React, { useState } from 'react';

const ChooseSportPageForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    teamSports: '',
    individualSports: '',
    favoriteSport: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Passez les données du formulaire au parent via la fonction onSubmit
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Préférez-vous les sports : 
          <select name="teamSports" value={formData.teamSports} onChange={handleChange}>
            <option value="">Sélectionnez</option>
            <option value="equipe">En équipe</option>
            <option value="indiv">Individuel</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Préférez-vous les sports :
          <select name="individualSports" value={formData.individualSports} onChange={handleChange}>
            <option value="">Sélectionnez</option>
            <option value="ballon">De ballon</option>
            <option value="raquette">De raquette</option>
            <option value="combat">De combat</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Préférez-vous jouer :
          <select name="individualSports" value={formData.individualSports} onChange={handleChange}>
            <option value="">Sélectionnez</option>
            <option value="main">A la main</option>
            <option value="pied">Au pied</option>
          </select>
        </label>
      </div>

      <div>
        <label>
            Préférez-vous les sports d'intérieur ou d'extérieur ?
            <select name="indoorOutdoor" value={formData.indoorOutdoor} onChange={handleChange}>
            <option value="">Sélectionnez</option>
            <option value="interieur">En intérieur</option>
            <option value="exterieur">En extérieur</option>
            </select>
        </label>
        </div>
        
      <button type="submit">Valider</button>
    </form>
  );
};

export default ChooseSportPageForm;
