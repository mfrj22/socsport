import React, { useState } from 'react';
import './Form.css'

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
    
    <form onSubmit={handleSubmit} className="form">
    <div>
        <label>
        Préférez-vous les sports en équipe ou individuels ?
        <div>
            <input
            type="radio"
            id="equipe"
            name="teamOrIndividual"
            value="equipe"
            checked={formData.teamOrIndividual === "equipe"}
            onChange={handleChange}
            />
            <label htmlFor="equipe">En équipe</label>
        </div>
        <div>
            <input
            type="radio"
            id="individuel"
            name="teamOrIndividual"
            value="individuel"
            checked={formData.teamOrIndividual === "individuel"}
            onChange={handleChange}
            />
            <label htmlFor="individuel">Individuel</label>
        </div>
        </label>
    </div>

    <div>
        <label>
        Préférez-vous les sports de ballon, de raquette ou de combat ?
        <div>
            <input
            type="radio"
            id="ballon"
            name="typeSport"
            value="ballon"
            checked={formData.typeSport === "ballon"}
            onChange={handleChange}
            />
            <label htmlFor="ballon">De ballon</label>
        </div>
        <div>
            <input
            type="radio"
            id="raquette"
            name="typeSport"
            value="raquette"
            checked={formData.typeSport === "raquette"}
            onChange={handleChange}
            />
            <label htmlFor="raquette">De raquette</label>
        </div>
        <div>
            <input
            type="radio"
            id="combat"
            name="typeSport"
            value="combat"
            checked={formData.typeSport === "combat"}
            onChange={handleChange}
            />
            <label htmlFor="combat">De combat</label>
        </div>
        </label>
    </div>

    <div>
        <label>
        Préférez-vous jouer à la main ou au pied ?
        <div>
            <input
            type="radio"
            id="main"
            name="playStyle"
            value="main"
            checked={formData.playStyle === "main"}
            onChange={handleChange}
            />
            <label htmlFor="main">À la main</label>
        </div>
        <div>
            <input
            type="radio"
            id="pied"
            name="playStyle"
            value="pied"
            checked={formData.playStyle === "pied"}
            onChange={handleChange}
            />
            <label htmlFor="pied">Au pied</label>
        </div>
        <div>
            <input
            type="radio"
            id="deux"
            name="playStyle"
            value="deux"
            checked={formData.playStyle === "deux"}
            onChange={handleChange}
            />
            <label htmlFor="deux">Les deux</label>
        </div>
        </label>
    </div>

    <div>
        <label>
        Préférez-vous les sports d'intérieur ou d'extérieur ?
        <div>
            <input
            type="radio"
            id="interieur"
            name="indoorOutdoor"
            value="interieur"
            checked={formData.indoorOutdoor === "interieur"}
            onChange={handleChange}
            />
            <label htmlFor="interieur">En intérieur</label>
        </div>
        <div>
            <input
            type="radio"
            id="exterieur"
            name="indoorOutdoor"
            value="exterieur"
            checked={formData.indoorOutdoor === "exterieur"}
            onChange={handleChange}
            />
            <label htmlFor="exterieur">En extérieur</label>
        </div>
        </label>
    </div>

    <button type="submit">Valider</button>
    </form>
  );
};

export default ChooseSportPageForm;