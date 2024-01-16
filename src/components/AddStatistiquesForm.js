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
import './Form.css'
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
      default:
        setSelectedSportComponent(null);
    }
  };

  const updateGlobalStats = (stats) => {
    setGlobalStats((prevStats) => ({ ...prevStats, ...stats }));
  };

  const handleStatistiquesSubmit = (e) => {
    e.preventDefault();

    if (!selectedSport) {
      alert('Veuillez sélectionner un sport');
      return;
    }

    const totalScore = calculateTotalScore();

    fetch('http://localhost:5000/add-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: localStorage.getItem('username'),
        score: totalScore,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout du score');
        }
        return response.json();
      })
      .then((data) => {
        toast.success(data.message);
        localStorage.setItem('globalStats', JSON.stringify(globalStats));
        console.log('Statistiques globales:', localStorage.getItem('globalStats'));
      })
      .catch((error) => {
        toast.error(error.message);
      });
      console.log('username:', localStorage.getItem('username'));
};


  const calculateTotalScore = () => {
    const { football, basketball, boxe, tennis, rugby, handball } = globalStats;
  
    const coefficients = {
      football: {
        goals: 2,         
        assists: 1,      
        yellowCards: -0.5, 
        redCards: -1,
      },
      basketball: {
        points: 1,      
        rebounds: 1.5,  
        steals: 2,   
        assists: 1,     
      },
      boxe: {
        roundsWon: 2,      
        totalPunches: 1,  
        knockouts: 5,   
        penalties: -1,     
      },
      tennis: {
        aces: 1,      
        doubleFaults: -1.5,  
        firstServePercentage: 0.2,   
        winningPercentage: 0.2,     
      },
      rugby: {
        tries: 1,      
        conversions: 1.5,  
        penaltyGoals: 2,   
        dropGoals: 1,     
      },
      handball: {
        goals: 1,      
        assists: 1.5,  
        saves: 2,   
        penalties: -1,     
      },
    };
  
    let totalScore = 0;
  
    totalScore += isFinite(football.goals) ? football.goals * coefficients.football.goals : 0;
    totalScore += isFinite(football.assists) ? football.assists * coefficients.football.assists : 0;
    totalScore += isFinite(football.yellowCards) ? football.yellowCards * coefficients.football.yellowCards : 0;
    totalScore += isFinite(football.redCards) ? football.redCards * coefficients.football.redCards : 0;
  
    totalScore += isFinite(basketball.points) ? basketball.points * coefficients.basketball.points : 0;
    totalScore += isFinite(basketball.rebounds) ? basketball.rebounds * coefficients.basketball.rebounds : 0;
    totalScore += isFinite(basketball.steals) ? basketball.steals * coefficients.basketball.steals : 0;
    totalScore += isFinite(basketball.assists) ? basketball.assists * coefficients.basketball.assists : 0;
    
    totalScore += isFinite(boxe.roundsWon) ? boxe.roundsWon * coefficients.boxe.roundsWon : 0;
    totalScore += isFinite(boxe.totalPunches) ? boxe.totalPunches * coefficients.boxe.totalPunches : 0;
    totalScore += isFinite(boxe.knockouts) ? boxe.knockouts * coefficients.boxe.knockouts : 0;
    totalScore += isFinite(boxe.penalties) ? boxe.penalties * coefficients.boxe.penalties : 0;
    
    totalScore += isFinite(tennis.aces) ? tennis.aces * coefficients.tennis.aces : 0;
    totalScore += isFinite(tennis.doubleFaults) ? tennis.doubleFaults * coefficients.tennis.doubleFaults : 0;
    totalScore += isFinite(tennis.firstServePercentage) ? tennis.firstServePercentage * coefficients.tennis.firstServePercentage : 0;
    totalScore += isFinite(tennis.winningPercentage) ? tennis.winningPercentage * coefficients.tennis.winningPercentage : 0;

    totalScore += isFinite(rugby.tries) ? rugby.tries * coefficients.rugby.tries : 0;
    totalScore += isFinite(rugby.conversions) ? rugby.conversions * coefficients.rugby.conversions : 0;
    totalScore += isFinite(rugby.penaltyGoals) ? rugby.penaltyGoals * coefficients.rugby.penaltyGoals : 0;
    totalScore += isFinite(rugby.dropGoals) ? rugby.dropGoals * coefficients.rugby.dropGoals : 0;
    
    totalScore += isFinite(handball.goals) ? handball.goals * coefficients.handball.goals : 0;
    totalScore += isFinite(handball.assists) ? handball.assists * coefficients.handball.assists : 0;
    totalScore += isFinite(handball.saves) ? handball.saves * coefficients.handball.saves : 0;
    totalScore += isFinite(handball.penalties) ? handball.penalties * coefficients.handball.penalties : 0;

    return totalScore;
  };
  

  return (
    <div className="form">
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
        {selectedSport && (
          <div>
            <h3>Score total :</h3>
            <p>{calculateTotalScore()}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddStatistiquesForm;