import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LocationInput = ({ onLocationSubmit }) => {
  const [isLocating, setIsLocating] = useState(false);
  const [manualLatitude, setManualLatitude] = useState('');
  const [manualLongitude, setManualLongitude] = useState('');
  const navigate = useNavigate();

  const handleLocateClick = () => {
    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationSubmit({ latitude, longitude });
          setIsLocating(false);
          navigate('/');
        },
        (error) => {
          console.error('Erreur de géolocalisation :', error);
          setIsLocating(false);
        }
      );
    } else {
      console.error("La géolocalisation n'est pas prise en charge par votre navigateur.");
      setIsLocating(false);
    }
  };

  const handleManualSubmit = () => {
    const latitude = parseFloat(manualLatitude);
    const longitude = parseFloat(manualLongitude);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      onLocationSubmit({ latitude, longitude });
      navigate('/');
    } else {
      alert('Veuillez entrer des coordonnées GPS valides.');
    }
  };

  return (
    <div className="centered-container">
       <div className="input-container centered-input">
        <label>Latitude:</label>
        <input
          className="location-input"
          type="number"
          step="0.000001"
          value={manualLatitude}
          onChange={(e) => setManualLatitude(e.target.value)}
        />
      </div>
      <div className="input-container centered-input">
        <label>Longitude:</label>
        <input
          className="location-input"
          type="number"
          step="0.000001"
          value={manualLongitude}
          onChange={(e) => setManualLongitude(e.target.value)}
        />
      </div>
      <button className="button submit-button" onClick={handleManualSubmit}>
        Entrer les coordonnées
      </button>
      <button
        className={`button locate-button ${isLocating ? 'locating-button' : ''}`}
        onClick={handleLocateClick}
        disabled={isLocating}
      >
        {isLocating ? 'En cours de localisation...' : 'Obtenir ma position'}
      </button>
    </div>
  );
  
};

export default LocationInput;