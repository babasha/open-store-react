import React from 'react';
import MapPicker from '../../components/MapPicker';
import { MapModal, MapContent, CloseButton } from './RegisterStyles';
import { useTranslation } from 'react-i18next';

interface MapModalComponentProps {
  showMapPicker: boolean;
  handleClose: () => void;
  handleAddressSelect: (address: string, lat: number, lon: number) => void;
}

const MapModalComponent: React.FC<MapModalComponentProps> = ({ showMapPicker, handleClose, handleAddressSelect }) => {
  const { t } = useTranslation();

  if (!showMapPicker) return null;

  return (
    <MapModal>
      <MapContent>
        <CloseButton onClick={handleClose}>{t('close')}</CloseButton>
        <MapPicker onAddressSelect={handleAddressSelect} isForRegister={true} /> {/* Передаем пропс */}
      </MapContent>
    </MapModal>
  );
};

export default MapModalComponent;
