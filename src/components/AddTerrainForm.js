import React, { useState } from 'react';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Form.css';
const AddTerrainForm = ({ onTerrainSubmit, sports }) => {
  const [terrainData, setTerrainData] = useState({
    nom: '',
    adresse: '',
    latitude: 0,
    longitude: 0,
    ville: '',
    horaire_ouverture: '',
    horaire_fermeture: '',
    sport: '', // Nouveau champ pour le sport sélectionné
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTerrainData({ ...terrainData, [name]: value });
  };

  // Nouvelle fonction pour gérer les changements dans la liste déroulante du sport
  // const handleSportChange = (e) => {
  //   const selectedSport = e.target.value;
  //   setTerrainData({ ...terrainData, sport: selectedSport });
  // };

  const handleSportCheckboxChange = (sportId) => {
    const selectedSports = [...terrainData.sport]; // Utilisez un tableau pour stocker les sports sélectionnés
  
    // Vérifiez si le sport est déjà sélectionné, et ajoutez ou supprimez-le en conséquence
    if (selectedSports.includes(sportId)) {
      selectedSports.splice(selectedSports.indexOf(sportId), 1);
    } else {
      selectedSports.push(sportId);
    }
  
    setTerrainData({ ...terrainData, sport: selectedSports });
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onTerrainSubmit(terrainData);
     // Afficher un toast de succès
     toast.success('Terrain ajouté avec succès!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };


  return (
    <div className="form">
       <ToastContainer />
      <h2>Ajouter un terrain</h2>
      <form onSubmit={handleSubmit}>
      <div>
        <label>Nom:</label>
        <input type="text" name="nom" value={terrainData.nom} onChange={handleChange} required />
      </div>
      <div>
        <label>Adresse:</label>
        <input type="text" name="adresse" value={terrainData.adresse} onChange={handleChange} required />
      </div>
      <div>
        <label>Latitude:</label>
        <input type="number" step="0.000001" name="latitude" value={terrainData.latitude} onChange={handleChange} required />
      </div>
      <div>
        <label>Longitude:</label>
        <input type="number" step="0.000001" name="longitude" value={terrainData.longitude} onChange={handleChange} required />
      </div>
      <div>
        <label>Ville:</label>
        <input type="text" name="ville" value={terrainData.ville} onChange={handleChange} required />
      </div>
      <div>
        <label>Code Postal:</label>
        <input type="text" name="code_postal" value={terrainData.code_postal} onChange={handleChange} required />
      </div>
      <div>
        <label>Département:</label>
        <input type="text" name="departement" value={terrainData.departement} onChange={handleChange} required />
      </div>
      <div>
        <label>Horaire d'ouverture:</label>
        <input type="time" name="horaire_ouverture" value={terrainData.horaire_ouverture} onChange={handleChange} required />
      </div>
      <div>
        <label>Horaire de fermeture:</label>
        <input type="time" name="horaire_fermeture" value={terrainData.horaire_fermeture} onChange={handleChange} required />
      </div>
      <div>
        <label>Sports:</label>
        {sports.map((sport) => (
          <div key={sport.id}>
            <input
              type="checkbox"
              id={`sport-${sport.id}`}
              name={`sport-${sport.id}`}
              value={sport.id}
              checked={terrainData.sport.includes(sport.id)}
              onChange={() => handleSportCheckboxChange(sport.id)}
            />
            <label htmlFor={`sport-${sport.id}`}>{sport.name}</label>
          </div>
        ))}
      </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AddTerrainForm;