import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddStatistiquesForm = () => {
  const { eventId } = useParams();

  const [sports, setSports] = useState([]); // Ajoutez cet état pour stocker la liste des sports
  const [selectedSport, setSelectedSport] = useState('');
  const [statistiquesData, setStatistiquesData] = useState({
    // Ajoutez d'autres champs de statistiques au besoin
    buts: 0,
    passes: 0,
    tirs: 0,
  });

  useEffect(() => {
    // Chargez la liste des sports depuis la base de données
    fetch('http://localhost:5000/sports') // Assurez-vous d'utiliser le bon endpoint pour récupérer les sports
      .then((response) => response.json())
      .then((data) => setSports(data))
      .catch((error) => console.error('Erreur lors de la récupération des sports:', error));
  }, []);

  const handleStatistiquesSubmit = (e) => {
    e.preventDefault();

    if (!selectedSport) {
      alert('Veuillez sélectionner un sport');
      return;
    }

    // Construisez l'objet de données des statistiques
    const statistiquesEventData = {
      sport: selectedSport,
      // Ajoutez d'autres champs de statistiques au besoin
      buts: statistiquesData.buts,
      passes: statistiquesData.passes,
      tirs: statistiquesData.tirs,
    };

    // Appelez le serveur pour créer les statistiques de l'événement
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
          // Réinitialisez les champs du formulaire après la soumission réussie
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
          <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
            <option value="">Sélectionnez un sport</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.name}>
                {sport.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Buts:</label>
          <input
            type="number"
            value={statistiquesData.buts}
            onChange={(e) => setStatistiquesData({ ...statistiquesData, buts: e.target.value })}
          />
        </div>

        <div>
          <label>Passes:</label>
          <input
            type="number"
            value={statistiquesData.passes}
            onChange={(e) => setStatistiquesData({ ...statistiquesData, passes: e.target.value })}
          />
        </div>

        <div>
          <label>Tirs:</label>
          <input
            type="number"
            value={statistiquesData.tirs}
            onChange={(e) => setStatistiquesData({ ...statistiquesData, tirs: e.target.value })}
          />
        </div>

        <button type="submit">Ajouter les statistiques</button>
      </form>
    </div>
  );
};

export default AddStatistiquesForm;
