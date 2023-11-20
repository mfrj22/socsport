import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LocationInput from './components/LocationInput';
import NearbyFields from './components/NearbyFields';
import EventForm from './EventForm';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // Import de Leaflet
import 'leaflet/dist/leaflet.css';
import './App.css';
import L from 'leaflet'; // Importez Leaflet
function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestFields, setNearestFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);

  const handleLocationSubmit = (location) => {
    setUserLocation(location);
  };

  useEffect(() => {
    if (userLocation) {
      // Effectuer une requête au backend pour obtenir les terrains proches
      fetch('http://localhost:5000/nearest-fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userLocation),
      })
        .then((response) => response.json())
        .then((data) => setNearestFields(data))
        .catch((error) => {
          console.error('Erreur lors de la récupération des terrains:', error);
        });
    }
  }, [userLocation]);

  const getStadiumImage = (stadiumName) => {
    console.log("Nom du stade transmis :", stadiumName);
  
    if (stadiumName === "Stade Jean Coteau") {
      return "./stade jean coteau.jpg";
    } else if (stadiumName === "Stade Gabriel Péri") {
      return "./Stade-Gabriel-Peri.jpg";
    } else if (stadiumName === "Stade du Parc") {
      return "./stade-du-parc.jpg";
    } else if (stadiumName === "Stade Emile Anthoine") {
      return "./stade-emile-anthoine.jpg";
    } else if (stadiumName === "Stade des Glacières") {
      return "./stade-glaciere.jpg";
    } else if (stadiumName === "Stade de Gournail") {
      return "./stade-gournail.png";
    } else if (stadiumName === "Stade Jean Moulin") {
      return "./stade-jean-moulin.jpg";
    } else if (stadiumName === "Stade Landy") {
      return "./stade-landy.jpg";
    } else if (stadiumName === "Stade Léon Rabbot") {
      return "./stade-léon-rabbot.jpg";
    } else if (stadiumName === "Stade Vincent Pascucci") {
      return "./stade-vincent-pascucci.jpg";
    } else if (stadiumName === "Stade Albert Smirlian") {
      return "./Albert-Smirlian.jpg";
    } else {
      console.log("Aucune correspondance trouvée, utilisant l'image par défaut");
      // Si aucun nom de stade correspondant n'est trouvé, retourner l'image par défaut
      return "./default-image.jpg";
    }
  };
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const initialLocation = { lat: 0, lng: 0 }; // Valeur par défaut
  return (
    <Router>
      <div className="App">
        <h1>SocSport</h1>
        <div className="location-input">
          <LocationInput onLocationSubmit={handleLocationSubmit} />
        </div>
        <Routes>
          <Route path="/" element={<NearbyFields fields={nearestFields} />} />
          {nearestFields.map((field) => (
            <Route
              key={field.id}
              path={`/field/${field.id}`}
              element={
                <div>
                  <Link className="field-link" to={`/create-event/${field.id}`} onClick={() => setSelectedField(field)}>
                    {field.name}
                  </Link>
                </div>
              }
            />
          ))}
          <Route path="/create-event/:fieldId" element={<EventForm selectedField={selectedField} />} />
        </Routes>
       < MapContainer center={userLocation || initialLocation} zoom={userLocation ? 13 : 1} style={{ height: '500px', width: '100%' }}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  />
  {userLocation && userLocation.lat && userLocation.lng && (
    <Marker position={[userLocation.lat, userLocation.lng]}>
      <Popup>Votre position actuelle</Popup>
    </Marker>
  )}

  {/* Définissez vos icônes personnalisées */}
  {(() => {
    const stadiumIcon = L.icon({
      iconUrl: 'icon-markeur.png',
      iconSize: [40, 40], // Taille de l'icône
      iconAnchor: [20, 40], // Position de l'ancre de l'icône
      popupAnchor: [0, -40], // Position du popup par rapport à l'icône
    });

    // Utilisez les icônes pour afficher les marqueurs
    return nearestFields.slice(0, 3).map((field) => (
      <Marker
        key={field.id}
        position={[field.latitude, field.longitude]}
        icon={stadiumIcon}
      >
        <Popup>{field.nom}</Popup>
      </Marker>
    ));
  })()}
</MapContainer>



        {/* Affichage des images des stades */}
        <div className="carousel-container">
          <Slider {...settings}>
            {nearestFields.slice(0, 3).map((field) => (
              <div key={field.id} className="carousel-item">
                <img src={getStadiumImage(field.nom)} alt={field.nom} />
                <p className="legend">{field.nom}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </Router>
  );
}

export default App;