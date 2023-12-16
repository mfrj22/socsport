import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NearbyFields = ({ fields, onGetDirectionsClick, sports }) => {
  
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [selectedDistance, setSelectedDistance] = useState('all');

  const sortedFields = [...fields].sort((a, b) => a.distance - b.distance);

  const nearestFields = sortedFields.slice(0, 7);

  const isEmpty = nearestFields.length === 0;

  if (isEmpty) {
    return null;
  }

  // Filtrer les terrains en fonction des options sélectionnées
  const filteredFields = nearestFields.filter((field) => {
    // Filtrer par sport
    if (selectedSport && !field.sports.includes(selectedSport)) {
      return false;
    }

    // Filtrer par horaire
    if (
      selectedStartTime &&
      field.horaire_ouverture.localeCompare(selectedStartTime) > 0
    ) {
      return false;
    }

    if (
      selectedEndTime &&
      field.horaire_fermeture.localeCompare(selectedEndTime) < 0
    ) {
      return false;
    }

    // Filtrer par distance
    if (selectedDistance === 'under1' && field.distance >= 1) {
      return false;
    }

    if (selectedDistance === '1to5' && (field.distance < 1 || field.distance > 5)) {
      return false;
    }

    if (selectedDistance === 'over5' && field.distance <= 5) {
      return false;
    }

    return true;
  });

  return (
    <div>
      <h2>Terrains proches :</h2>

      {/* Ajouter les options de filtrage ici */}
      <div>
        <label>Sport :</label>
        <select onChange={(e) => setSelectedSport(e.target.value)}>
          <option value="">Tous les sports</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.name}>
              {sport.name}
            </option>
          ))}
        </select>

        <label>Début de séance :</label>
        <input
          type="time"
          value={selectedStartTime}
          onChange={(e) => setSelectedStartTime(e.target.value)}
        />

        <label>Fin de séance :</label>
        <input
          type="time"
          value={selectedEndTime}
          onChange={(e) => setSelectedEndTime(e.target.value)}
        />

        <label>Distance :</label>
        <select onChange={(e) => setSelectedDistance(e.target.value)}>
          <option value="all">Toutes les distances</option>
          <option value="under1">Moins d'1 km</option>
          <option value="1to5">Entre 1 et 5 km</option>
          <option value="over5">Plus de 5 km</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Terrain</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Distance (km)</th>
            <th>Horaire d'ouverture</th>
            <th>Horaire de fermeture</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredFields.map((field, index) => (
            <tr key={index}>
              <td>{field.id}</td>
              <td>
                <Link to={`/create-event/${field.id}`}>{field.nom}</Link>
              </td>
              <td>{field.latitude}</td>
              <td>{field.longitude}</td>
              <td>{field.distance} km</td>
              <td>{field.horaire_ouverture}</td>
              <td>{field.horaire_fermeture}</td>
              <td>
                <button onClick={() => onGetDirectionsClick(field)}>Obtenir l'itinéraire</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NearbyFields;
