import React from 'react';
import { Link } from 'react-router-dom';

const NearbyFields = ({ fields }) => {
  // Trier les terrains en fonction de la distance (ordre croissant)
  const sortedFields = [...fields].sort((a, b) => a.distance - b.distance);

  // Prendre seulement les premiers terrains (les plus proches)
  const nearestFields = sortedFields.slice(0, 3);

  // Vérifier si la liste des terrains proches est vide
  const isEmpty = nearestFields.length === 0;

  if (isEmpty) {
    // Si la liste est vide, `null` pour ne rien afficher
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NearbyFields;
