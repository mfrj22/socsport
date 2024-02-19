import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const FieldDetail = () => {
  const { fieldId } = useParams();
  const [field, setField] = useState(null);
  const [weather, setWeather] = useState(null);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les informations du terrain
        const responseField = await fetch(`http://localhost:5000/fields/${fieldId}`);
        const dataField = await responseField.json();
        setField(dataField);

        // Récupérer la météo
        const responseWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${dataField.latitude}&lon=${dataField.longitude}&appid=e46c347779f1d83501e8fda216cf14e1`);
        const dataWeather = await responseWeather.json();
        setWeather(dataWeather);

        // Récupérer les points d'intérêt depuis l'API Foursquare
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'fsq3v0NQyvk7WzGQR2Au4aTz5YcvcOw9WNci7Th+6nxDI9g='
          }
        };
        const responsePOI = await fetch(`https://api.foursquare.com/v3/places/search?ll=${dataField.latitude},${dataField.longitude}`, options);
        const dataPOI = await responsePOI.json();

        if (dataPOI.results) {
          setPointsOfInterest(dataPOI.results);
        } else {
          console.error('Réponse invalide de l\'API Foursquare :', dataPOI);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, [fieldId]);

  if (!field || !weather) {
    return <div>Loading...</div>;
  }

  // Définition de l'icône personnalisée pour le marqueur du terrain
  const fieldIcon = L.icon({
    iconUrl: '/icon-markeur.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  // Définition de l'icône personnalisée pour les points d'intérêt
  const stadiumIcon = L.icon({
    iconUrl: '/icon-interet.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  return (
    <div>
      <h1>{field.nom}</h1>
      <p>Latitude: {field.latitude}</p>
      <p>Longitude: {field.longitude}</p>
      <img src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt="Weather Icon" style={{ marginRight: '5px' }} />
      {weather.name} : {Math.round(weather.main.temp - 273.15)}°C <br/>
      <h2>Points d'intérêt à proximité :</h2>
      <MapContainer center={[field.latitude, field.longitude]} zoom={12} style={{ height: '400px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Marqueur pour le terrain */}
        <Marker position={[field.latitude, field.longitude]} icon={fieldIcon}>
          <Popup>{field.nom}</Popup>
        </Marker>
        
        {/* Marqueurs pour les points d'intérêt */}
        {pointsOfInterest && pointsOfInterest.length > 0 && pointsOfInterest.map((poi) => (
          <Marker position={[poi.geocodes.main.latitude, poi.geocodes.main.longitude]} key={poi.id} icon={stadiumIcon}>
            <Popup>{poi.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default FieldDetail;
