import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LocationInput from './components/LocationInput';
import NearbyFields from './components/NearbyFields';
import EventForm from './components/EventForm';
import NoteForm from './components/NoteForm';
import Notifications from './components/Notifications';
import AddStatistiquesForm from './components/AddStatistiquesForm';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AddTerrainForm from './components/AddTerrainForm';
import AddReservationForm from './components/AddReservationForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import ChooseSportPage from './components/ChooseSportPage';
import HistoriqueReservation from './components/HistoriqueReservation';
import ClassementEvents from './components/ClassementEvents';
import LoginForm from './components/LoginForm';
import DeleteReservationForm from './components/DeleteReservationForm';
import UpcomingEvents from './components/UpcomingEvents';
import EventConnaissance from './components/EventConnaissance';
import FieldDetail from './components/FieldDetail'

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestFields, setNearestFields] = useState([]);
  const [setSelectedField] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sports, setSports] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [weather, setWeather] = useState(null);
  const [directions, setDirections] = useState(null);
  const mapRef = useRef();
  const prevUserLocation = useRef();
  const [initialZoom, setInitialZoom] = useState(13);
  const [username, setUsername] = useState('');
  const [selectedDirectionField, setSelectedDirectionField] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Ajoutez cette ligne
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatboxVisible, setIsChatboxVisible] = useState(true);


  const fetchDirections = async (startLocation, endLocation) => {
    const apiKey = '5b3ce3597851110001cf6248f0d06cd0df8640da9da60b6f7788f270'; // Remplacez par votre clé API OpenRouteService
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startLocation.lng},${startLocation.lat}&end=${endLocation.lng},${endLocation.lat}`;

    try {
      const response = await axios.get(url);
      setDirections(response.data.features[0].geometry.coordinates);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  useEffect(() => {
    if (selectedDirectionField && userLocation) {
      fetchDirections(
        { lat: userLocation.lat, lng: userLocation.lng },
        { lat: selectedDirectionField.latitude, lng: selectedDirectionField.longitude }
      );
    }
  }, [selectedDirectionField, userLocation]);


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

  function handleChatSubmit(event) {
    event.preventDefault();
    const message = event.target.elements.message.value;
    setMessages([...messages, { role: 'user', content: message }]);
    sendMessage(message);
  }

  function sendMessage(message) {
    setIsLoading(true); // Active l'indicateur de chargement
    fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message }),
    })
    .then(response => response.json())
    .then(data => {
      setMessages(messages => [...messages, { role: 'bot', content: data.response }]);
      setIsLoading(false); // Désactive l'indicateur de chargement
    })
    .catch((error) => {
      console.error('Error:', error);
      setIsLoading(false); // Désactive l'indicateur de chargement en cas d'erreur
    });
  }
  

  const handleLocationSubmit = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setInitialZoom(13); // Définir le niveau de zoom initial
          // Optionally, you can also fetch weather data here
          fetchWeatherData(latitude, longitude);
          // Zoomer vers la nouvelle position de l'utilisateur
          mapRef.current.flyTo([latitude, longitude], initialZoom);
        },
        (error) => {
          console.error('Error getting user location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const zoomToNearestFields = () => {
    if (nearestFields.length > 0) {
      const bounds = L.latLngBounds(nearestFields.slice(0, 3).map(field => [field.latitude, field.longitude]));
      mapRef.current.fitBounds(bounds);
    }
  };
  const fetchWeatherData = async (lat, lon) => {
    try {
      const apiKey = "e46c347779f1d83501e8fda216cf14e1";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
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
    if (userLocation && userLocation !== prevUserLocation.current) { // Vérifier si userLocation a changé
      prevUserLocation.current = userLocation; // Mettre à jour l'état précédent
      fetch('http://localhost:5000/nearest-fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: userLocation.lat,
          longitude: userLocation.lng,
        }),
      })
      
        .then((response) => response.json())
        .then((data) => setNearestFields(data))
        .catch((error) => {
          console.error('Erreur lors de la récupération des terrains:', error);
        });
    }
    if (mapRef.current && userLocation) {
      zoomToNearestFields();
    }
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      fetchWeatherData(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  useEffect(() => {
    console.log('userLocation:', userLocation);
  
    if (userLocation) {
      fetchWeatherData(userLocation.lat, userLocation.lng);
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
  const initialLocation = { lat: 0, lng: 0 }; 

  // const handleGetDirectionsClick = (field) => {
  //   setSelectedDirectionField(field);
  // };
  const buildDirectionsUrl = (startLocation, endLocation) => {
    // Utilisez les coordonnées pour construire l'URL de l'itinéraire
    const url = `https://www.openstreetmap.org/directions?engine=graphhopper_foot&route=${startLocation.lat}%2C${startLocation.lng}%3B${endLocation.lat}%2C${endLocation.lng}`;
    return url;
  };
  

  const handleGetDirectionsClick = (field) => {
    setSelectedDirectionField(field);
  };

  
  const userLocationIcon = L.icon({
    iconUrl: 'user-icon.png', 
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });


  return (
    <Router>
      <div className="App centered-container">
        <div className="menu">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src="./logo-socsport.jpg" alt="SocSport Logo" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
              </Link>
            </div>
            <h1 style={{ margin: 0 }}>SocSport</h1>
          </div>
          
          {isAuthenticated && (
            <p style={{ margin: '0', paddingLeft: '10px' }}>Connecté en tant que {username}</p>
          )}
  
          <Link to="/add-terrain" className="menu-button">Ajouter un terrain</Link>
          <Link to="/classement-events" className="menu-button">Classement</Link>
  
          <Link to="/notifications" className="menu-button">
            <FontAwesomeIcon icon={faBell} size="2x" />
            {notificationCount > 0 && <span style={{ marginLeft: '5px' }}>{notificationCount}</span>}
          </Link>
          <Link to="/choose-sport" className="menu-button">Choisir son sport</Link>
          <Link to="/historique-reservation" className="menu-button">Historique des réservations</Link>
          <Link to="/recommandation-events" className="menu-button">Recommandations</Link>
          <Link to="/event-connaissance" className="menu-button">Connaissance</Link>
          <Link to="/login" className="menu-button">
            {isAuthenticated ? 'Déconnexion' : 'Connexion'}
          </Link>
          <div>
          {weather && (
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <img src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt="Weather Icon" style={{ marginRight: '5px' }} />
                {weather.name} : {Math.round(weather.main.temp - 273.15)}°C
              </span>
            </div>
          )}
        </div>
        </div>
        {/* <h1>SocSport</h1> */}
        <div className="location-input">
          <LocationInput onLocationSubmit={handleLocationSubmit} />
        </div>
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <NearbyFields fields={nearestFields} onGetDirectionsClick={handleGetDirectionsClick} sports= {sports}/>
                <MapContainer
                    ref={mapRef}
                    center={
                      userLocation && userLocation.lat && userLocation.lng
                        ? [userLocation.lat, userLocation.lng]
                        : [initialLocation.lat, initialLocation.lng]
                    }
                    zoom={userLocation ? 13 : 1}
                    style={{ height: "400px", objectFit: "cover", width: '60%', margin: "0 auto" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {userLocation && userLocation.lat && userLocation.lng && (
                      <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                        <Popup>Votre position actuelle</Popup>
                      </Marker>
                    )}
                    {(() => {
                      const stadiumIcon = L.icon({
                        iconUrl: 'icon-markeur.png',
                        iconSize: [40, 40],
                        iconAnchor: [20, 40],
                        popupAnchor: [0, -40],
                      });

                      return nearestFields.slice(0, 7).map((field) => (
                        <Marker
                          key={field.id}
                          position={[field.latitude, field.longitude]}
                          icon={stadiumIcon}
                        >
                          <Popup>
                            <Link to={`/field/${field.id}`}>
                               {field.nom}
                            </Link>
                          </Popup>
                        </Marker>
                      ));
                    })()}
                    {directions && (
                      <Polyline
                        positions={directions.map(coord => [coord[1], coord[0]])}
                        color="blue"
                      />
                    )}
                  </MapContainer>

                <div className="carousel-container">
                  <Slider {...settings}>
                    {nearestFields.slice(0, 7).map((field) => (
                      <div key={field.id} className="carousel-item">
                        <img src={getStadiumImage(field.nom)} alt={field.nom}  style={{ height: "300px", objectFit: "cover", margin: "0 auto" }} />
                        <p className="legend" style={{ textAlign: 'center', fontSize: '16px', marginTop: '10px' }}>{field.nom}</p>
                      </div>
                    ))}
                  </Slider>
                </div>
                <button className="minimize-chatbox" onClick={() => setIsChatboxVisible(!isChatboxVisible)}>
                  {isChatboxVisible ? '−' : '□'} {/* Use appropriate symbols or icons */}
                </button>

                <div className="chat">
  <div className="chat-header">
    <button className="minimize-chatbox" onClick={() => setIsChatboxVisible(!isChatboxVisible)}>
      {isChatboxVisible ? '−' : '□'}
    </button>
  </div>
  {isChatboxVisible && (
    <div className="chat-messages">
      {/* Chat messages and input form */}
      {messages.map((message, index) => (
        <div key={index} className={message.role}>
          <p>{message.content}</p>
        </div>
      ))}
      {isLoading && <p>Chargement...</p>}
      <form onSubmit={handleChatSubmit}>
        <input name="message" type="text" />
        <button type="submit">Send</button>
      </form>
    </div>
  )}
</div>

              </>
            } />

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

          <Route path="/create-event/:fieldId" element={<EventForm setSelectedEvent={setSelectedEvent} latitude={userLocation?.lat} longitude={userLocation?.lng} />} />

          <Route path="/add-reservation/:eventId" element={<AddReservationForm selectedEvent={selectedEvent} />} />

          <Route path="/notifications" element={<Notifications />} />

          <Route path="/stats-event/:eventId" element={<AddStatistiquesForm />} />

          <Route path="/choose-sport" element={<ChooseSportPage />} />
       
          <Route path="/note-event/:eventId" element={<NoteForm />} />

          <Route path="/historique-reservation" element={<HistoriqueReservation />} />

          <Route path="/classement-events" element={<ClassementEvents />} />

          <Route path="/login" element={<LoginForm isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} username={username} setUsername={setUsername} />} />

          <Route path="/delete-reservation/:reservationId" element={<DeleteReservationForm />} />

          <Route path="/recommandation-events" element={<UpcomingEvents />} />

          <Route path="/event-connaissance" element={<EventConnaissance />} />
          <Route path="/field/:fieldId" element={<FieldDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;