// src/layout/orderList/DeliveryModeSwitcher.tsx

import React from 'react';
import axios from 'axios';
import { SwitcherContainer, SwitcherButton } from '../../styles/OrderListStyles'; 

interface DeliveryModeSwitcherProps {
  deliveryMode: 'courier' | 'manual' | 'self';
  setDeliveryMode: (mode: 'courier' | 'manual' | 'self') => void;
  updateAllOrdersDeliveryMode: (mode: 'courier' | 'manual' | 'self') => void;
}

const DeliveryModeSwitcher: React.FC<DeliveryModeSwitcherProps> = ({
  deliveryMode,
  setDeliveryMode,
  updateAllOrdersDeliveryMode
}) => {
  const handleModeChange = (mode: 'courier' | 'manual' | 'self') => {
    setDeliveryMode(mode);
    updateAllOrdersDeliveryMode(mode);
  };

  return (
    <SwitcherContainer>
      <SwitcherButton 
        active={deliveryMode === 'courier'} 
        onClick={() => handleModeChange('courier')}
      >
        Курьеры забирают сами
      </SwitcherButton>
      <SwitcherButton 
        active={deliveryMode === 'manual'} 
        onClick={() => handleModeChange('manual')}
      >
        Ручной выбор курьеров
      </SwitcherButton>
      <SwitcherButton 
        active={deliveryMode === 'self'} 
        onClick={() => handleModeChange('self')}
      >
        Доставлю самостоятельно
      </SwitcherButton>
    </SwitcherContainer>
  );
};

export default DeliveryModeSwitcher;
