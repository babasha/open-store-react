// src/layout/orderList/DeliveryModeSwitcher.tsx

import React from 'react';
import { SelectContainer, SelectDropdown } from '../../styles/OrderListStyles'; 

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
  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = event.target.value as 'courier' | 'manual' | 'self';
    setDeliveryMode(mode);
    updateAllOrdersDeliveryMode(mode);
  };

  return (
    <SelectContainer>
      <SelectDropdown value={deliveryMode} onChange={handleModeChange}>
        <option value="courier">Курьеры забирают сами</option>
        <option value="manual">Ручной выбор курьеров</option>
        <option value="self">Доставлю самостоятельно</option>
      </SelectDropdown>
    </SelectContainer>
  );
};

export default DeliveryModeSwitcher;
