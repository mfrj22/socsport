import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useParams } from 'react-router-dom';

const FieldDetail = () => {
  const { fieldId } = useParams();
  const [field, setField] = useState(null);
  const [weather, setWeather] = useState(null);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);

  const options = {
    method: 'GET',
    headers: {accept: 'application/json'}
  };

  const clientId = 'LKTDWVWWHKOOT5UOGJQD0QIP1DDMD0D1FFBQPWV0TXO2IYFW';
  const clientSecret = 'FPEE3SXTUEQOEPEO3PICQN1RPN5VLE14JMURXS0O4CXLTCHP';
  useEffect(() => {
    const fetchData = async () => {
      // Récupérer les informations du terrain
      const responseField = await fetch(`http://localhost:5000/fields/${fieldId}`);
      const dataField = await responseField.json();
      setField(dataField);

      // Récupérer la météo
      const responseWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${dataField.latitude}&lon=${dataField.longitude}&appid=e46c347779f1d83501e8fda216cf14e1`);
      const dataWeather = await responseWeather.json();
      setWeather(dataWeather);

      // Récupérer les points d'intérêt
      const responsePOI = await fetch(`https://api.foursquare.com/v3/places/search?client_id=${clientId}&client_secret=${clientSecret}&ll=${dataField.latitude},${dataField.longitude}`, options);
      const dataPOI = await responsePOI.json();
      setPointsOfInterest(dataPOI.response.venues);
    };

    fetchData();
  }, [fieldId]);

  if (!field || !weather) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{field.nom}</h1>
      <p>Latitude: {field.latitude}</p>
      <p>Longitude: {field.longitude}</p>
      <img src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt="Weather Icon" style={{ marginRight: '5px' }} />
      {weather.name} : {Math.round(weather.main.temp - 273.15)}°C

      <MapContainer center={[field.latitude, field.longitude]} zoom={13}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[field.latitude, field.longitude]}>
          <Popup>{field.name}</Popup>
        </Marker>
        {pointsOfInterest && pointsOfInterest.map((poi) => (
          <Marker position={[poi.location.lat, poi.location.lng]} key={poi.id}>
            <Popup>{poi.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default FieldDetail;
