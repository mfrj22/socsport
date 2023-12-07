import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FootballStats from './StatsSports/FootballStats'; 
import BasketballStats from './StatsSports/BasketballStats'; 
import BoxeStats from './StatsSports/BoxeStats'; 
import TennisStats from './StatsSports/TennisStats'; 
import RugbyStats from './StatsSports/RugbyStats'; 
import HandballStats from './StatsSports/HandballStats';
import AthletismeStats from './StatsSports/AthletismeStats'; 

const AddStatistiquesForm = () => {
  const { eventId } = useParams();

  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [statistiquesData, setStatistiquesData] = useState({
    buts: 0,
    passes: 0,
    tirs: 0,
  });
  const [selectedSportComponent, setSelectedSportComponent] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/sports')
      .then((response) => response.json())
      .then((data) => setSports(data))
      .catch((error) => console.error('Erreur lors de la récupération des sports:', error));
  }, []);

  const handleSportChange = (selectedSport) => {
    setSelectedSport(selectedSport);

    switch (selectedSport) {
      case 'Football':
        setSelectedSportComponent(<FootballStats />);
        break;
      case 'Basketball':
        setSelectedSportComponent(<BasketballStats />);
        break;
      case 'Boxe':
        setSelectedSportComponent(<BoxeStats />);
        break;
      case 'Tennis':
        setSelectedSportComponent(<TennisStats />);
        break;
      case 'Rugby':
        setSelectedSportComponent(<RugbyStats />);
        break;
      case 'Handball':
        setSelectedSportComponent(<HandballStats />);
        break;
      case 'Athlétisme':
        setSelectedSportComponent(<AthletismeStats />);
        break;
      default:
        setSelectedSportComponent(null);
    }
  };

  const handleStatistiquesSubmit = (e) => {
    e.preventDefault();

    if (!selectedSport) {
      alert('Veuillez sélectionner un sport');
      return;
    }

    const statistiquesEventData = {
      sport: selectedSport,
      buts: statistiquesData.buts,
      passes: statistiquesData.passes,
      tirs: statistiquesData.tirs,
    };

    fetch(`http://localhost:5000/add-statistiques/${eventId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statistiquesEventData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Statistiques added successfully') {
          toast.success('Statistiques ajoutées avec succès');
          setSelectedSport('');
          setStatistiquesData({
            buts: 0,
            passes: 0,
            tirs: 0,
          });
        } else {
          alert('Erreur lors de l\'ajout des statistiques');
        }
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout des statistiques:', error);
      });
  };

  return (
    <div>
      <ToastContainer />
      <h2>Ajouter des statistiques pour l'événement avec l'ID {eventId}</h2>
      <Link to={`/add-reservation/${eventId}`}>Retour à l'événement</Link>
      <form onSubmit={handleStatistiquesSubmit}>
        <div>
          <label>Sport:</label>
          <select value={selectedSport} onChange={(e) => handleSportChange(e.target.value)}>
            <option value="">Sélectionnez un sport</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.name}>
                {sport.name}
              </option>
            ))}
          </select>
        </div>
        {selectedSportComponent && (
          <div>
            <h3>Statistiques spécifiques au sport</h3>
            {selectedSportComponent}
          </div>
        )}
        <button type="submit">Ajouter les statistiques</button>
      </form>
    </div>
  );
};

export default AddStatistiquesForm;
