// MapPicker.js
import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import styled from 'styled-components';
import markerIcon from './path-to-your-marker-icon.png'; // Замените на путь к вашему значку маркера
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';

import 'leaflet/dist/leaflet.css'; // Импортируем стили Leaflet

// Решение проблемы с отсутствующим значком маркера по умолчанию в Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapWrapper = styled.div`
  position: relative;
  height: 400px;
  margin-top: 10px;
`;

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const LoadingIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 1000;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  box-sizing: border-box;
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 42px;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  z-index: 1000;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const SuggestionItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
`;

const AdditionalFields = styled.div`
  margin-top: 10px;
`;

const MapPicker = ({ onAddressSelect }) => {
  const { t, i18n } = useTranslation();
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [entrance, setEntrance] = useState('');
  const [apartment, setApartment] = useState('');

  const batumiBounds = [
    [41.5796, 41.5881], // Юго-западная точка
    [41.6704, 41.6968], // Северо-восточная точка
  ];

  const isPointInBounds = (lat, lon) => {
    const [swLat, swLon] = batumiBounds[0];
    const [neLat, neLon] = batumiBounds[1];
    return lat >= swLat && lat <= neLat && lon >= swLon && lon <= neLon;
  };

  // Дебаунсинг функции fetchSuggestions
  const fetchSuggestions = useCallback(
    debounce(async (inputValue) => {
      if (!inputValue) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: inputValue,
            format: 'json',
            addressdetails: 1,
            city: 'Batumi',
            countrycodes: 'GE',
            limit: 5,
            'accept-language': i18n.language,
          },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error(t('fetch_address_error'), error);
      }
    }, 500),
    [i18n.language, t]
  );

  useEffect(() => {
    return () => {
      // Отменяем отложенные вызовы при размонтировании компонента
      fetchSuggestions.cancel();
    };
  }, [fetchSuggestions]);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const fetchAddress = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1,
          'accept-language': i18n.language,
        },
      });
      const addressData = response.data.address;
      const shortAddress = `${addressData.road || ''} ${addressData.house_number || ''}`.trim();
      setAddress(shortAddress);
      setSearchInput(shortAddress);
      onAddressSelect(shortAddress, lat, lon, entrance, apartment);
    } catch (error) {
      console.error(t('fetch_address_error'), error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    const { lat, lon, display_name } = suggestion;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isPointInBounds(latitude, longitude)) {
      setPosition([latitude, longitude]);
      setAddress(display_name);
      setSearchInput(display_name);
      setSuggestions([]);
      onAddressSelect(display_name, latitude, longitude, entrance, apartment);
    } else {
      alert(t('location_outside_batumi'));
    }
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (isPointInBounds(lat, lng)) {
          setPosition([lat, lng]);
          fetchAddress(lat, lng);
        } else {
          alert(t('location_outside_batumi'));
        }
      },
    });

    useEffect(() => {
      if (position) {
        map.flyTo(position, 16);
      }
    }, [position, map]);

    return position === null ? null : (
      <Marker position={position} icon={customIcon}></Marker>
    );
  };

  const handleEntranceChange = (e) => {
    setEntrance(e.target.value);
  };

  const handleApartmentChange = (e) => {
    setApartment(e.target.value);
  };

  return (
    <div>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder={t('enter_address')}
          value={searchInput}
          onChange={handleInputChange}
        />
        {suggestions.length > 0 && (
          <SuggestionsList>
            {suggestions.map((suggestion, index) => (
              <SuggestionItem key={index} onClick={() => handleSelectSuggestion(suggestion)}>
                {suggestion.display_name}
              </SuggestionItem>
            ))}
          </SuggestionsList>
        )}
      </SearchContainer>
      <MapWrapper>
        <MapContainer
          center={[41.6168, 41.6367]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          maxBounds={batumiBounds}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
        {loading && <LoadingIndicator>{t('loading')}</LoadingIndicator>}
      </MapWrapper>
      {address && (
        <div>
          <p>{t('selected_address')}: {address}</p>
          <AdditionalFields>
            <label>
              {t('entrance_number')}:
              <input type="text" value={entrance} onChange={handleEntranceChange} />
            </label>
            <br />
            <label>
              {t('apartment_number')}:
              <input type="text" value={apartment} onChange={handleApartmentChange} />
            </label>
          </AdditionalFields>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
