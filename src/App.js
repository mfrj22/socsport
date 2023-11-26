import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import LocationInput from './components/LocationInput';
import NearbyFields from './components/NearbyFields';
import EventForm from './components/EventForm';
import Notifications from './components/Notifications';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AddTerrainForm from './components/AddTerrainForm';
import AddReservationForm from './components/AddReservationForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestFields, setNearestFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sports, setSports] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  // compter le nombre de notif
  

  const handleAddTerrain = (terrainData) => {
    console.log("Terrain data submitted", terrainData);

    fetch('http://localhost:5000/ajouter-terrain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(terrainData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Terrain added successfully:', data);
      })
      .catch((error) => {
        console.error('Error adding terrain:', error);
      });
  };

  const handleLocationSubmit = (location) => {
    setUserLocation(location);
  };

  useEffect(() => {
    fetch('http://localhost:5000/sports')
      .then((response) => response.json())
      .then((data) => {
        console.log('Sports data:', data);
        setSports(data);
      })
      .catch((error) => {
        console.error('Error fetching sports:', error);
      });
  }, []);

  useEffect(() => {
    if (userLocation) {
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
        <Link to="/notifications">
          <FontAwesomeIcon icon={faBell} size="2x" />
          {notificationCount > 0 && <span style={{ marginLeft: '5px' }}>{notificationCount}</span>}
        </Link>
        <h1>SocSport</h1>
        <div className="location-input">
          <LocationInput onLocationSubmit={handleLocationSubmit} />
        </div>
        <Routes>
          <Route path="/" element={<NearbyFields fields={nearestFields} />} />
          <Route
            path="/notifications"
            element={<Notifications updateNotificationCount={setNotificationCount} />}
          />
          <Route
            path="/add-terrain"
            element={<AddTerrainForm onTerrainSubmit={handleAddTerrain} sports={sports} />}
          />
          <Route path="/add-reservation/:eventId" element={<AddReservationForm />} />
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
          <Route path="/create-event/:fieldId" element={<EventForm setSelectedEvent={setSelectedEvent} />} />
          <Route path="/add-reservation/:eventId" element={<AddReservationForm selectedEvent={selectedEvent} />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
  <MapContainer center={userLocation || initialLocation} zoom={userLocation ? 13 : 1} style={{ height: '400px', width: '100%' }}>
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

    <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}></div>
</MapContainer>

<div className="carousel-container">
          <Slider {...settings}>
            {nearestFields.slice(0, 3).map((field) => (
              <div key={field.id} className="carousel-item">
                <img src={getStadiumImage(field.nom)} alt={field.nom}  style={{ height: "300px", objectFit: "cover", margin: "0 auto" }} />
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