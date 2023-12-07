import React from 'react';
import { Link } from 'react-router-dom';

const NearbyFields = ({ fields, onGetDirectionsClick }) => {
  const sortedFields = [...fields].sort((a, b) => a.distance - b.distance);

  const nearestFields = sortedFields.slice(0, 3);

  const isEmpty = nearestFields.length === 0;

  if (isEmpty) {
    return null;
  }

  return (
    <div>
      <h2>Terrains proches :</h2>
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
          {nearestFields.map((field, index) => (
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
