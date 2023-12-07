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
    const [selectedSportComponent, setSelectedSportComponent] = useState(null);
    const [globalStats, setGlobalStats] = useState({
        football: {
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
    },
    basketball: {
      points: 0,
      rebounds: 0,
      steals: 0,
      assists: 0,
    },
    boxe: {
      roundsWon: 0,
      totalPunches: 0,
      knockouts: 0,
      penalties: 0,
    },
    tennis: {
      aces: 0,
      doubleFaults: 0,
      firstServePercentage: 0,
      winningPercentage: 0,
    },
    rugby: {
      tries: 0,
      conversions: 0,
      penalties: 0,
      dropGoals: 0,
    },
    athletisme: {
      sprintTime: 0,
      longJumpDistance: 0,
      shotPutDistance: 0,
      highJumpHeight: 0,
    },
    handball: {
      goals: 0,
      assists: 0,
      saves: 0,
      penalties: 0,
    },
    });

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
        setSelectedSportComponent(<FootballStats updateGlobalStats={updateGlobalStats} />);
        break;
      case 'Basketball':
        setSelectedSportComponent(<BasketballStats updateGlobalStats={updateGlobalStats} />);
        break;
      case 'Boxe':
        setSelectedSportComponent(<BoxeStats updateGlobalStats={updateGlobalStats} />);
        break;
      case 'Tennis':
        setSelectedSportComponent(<TennisStats updateGlobalStats={updateGlobalStats} />);
        break;
      case 'Rugby':
        setSelectedSportComponent(<RugbyStats updateGlobalStats={updateGlobalStats} />);
        break;
      case 'Handball':
        setSelectedSportComponent(<HandballStats updateGlobalStats={updateGlobalStats} />);
        break;
      case 'Athlétisme':
        setSelectedSportComponent(<AthletismeStats updateGlobalStats={updateGlobalStats} />);
        break;
      default:
        setSelectedSportComponent(null);
    }
  };

  const updateGlobalStats = (stats) => {
    // Mettez à jour les statistiques globales avec les nouvelles statistiques
    setGlobalStats((prevStats) => ({ ...prevStats, ...stats }));
  };

  const handleStatistiquesSubmit = (e) => {
    e.preventDefault();

    if (!selectedSport) {
      alert('Veuillez sélectionner un sport');
      return;
    }

    // Stockez les statistiques globales dans le localStorage
    localStorage.setItem('globalStats', JSON.stringify(globalStats));
    console.log('Statistiques globales:', localStorage.getItem('globalStats'));

    // Autres logiques pour la soumission du formulaire...
  };

  return (
    <div>
      <ToastContainer />
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
