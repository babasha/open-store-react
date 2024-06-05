import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import styled from 'styled-components';

const MapWrapper = styled.div`
  height: 300px;
  width: 100%;
`;

const MapPicker = ({ onAddressSelect }) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat,
          lon,
          format: 'json'
        }
      });
      const address = response.data.display_name;
      setAddress(address);
      onAddressSelect(address);
    } catch (error) {
      console.error('Ошибка при получении адреса:', error);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        fetchAddress(e.latlng.lat, e.latlng.lng);
      }
    });

    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  };

  return (
    <MapWrapper>
      <MapContainer center={[41.6168, 41.6367]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
      {address && <p>Выбранный адрес: {address}</p>}
    </MapWrapper>
  );
};

export default MapPicker;
