import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NearbyFields = ({ fields, onGetDirectionsClick, sports }) => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');

  const sortedFields = [...fields].sort((a, b) => a.distance - b.distance);

  const nearestFields = sortedFields.slice(0, 5);

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
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>

        <label>Horaire de début :</label>
        <input
          type="time"
          value={selectedStartTime}
          onChange={(e) => setSelectedStartTime(e.target.value)}
        />

        <label>Horaire de fin :</label>
        <input
          type="time"
          value={selectedEndTime}
          onChange={(e) => setSelectedEndTime(e.target.value)}
        />
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
