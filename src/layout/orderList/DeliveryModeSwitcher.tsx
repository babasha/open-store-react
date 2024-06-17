// src/layout/orderList/DeliveryModeSwitcher.tsx

import React from 'react';

interface DeliveryModeSwitcherProps {
  deliveryMode: 'courier' | 'manual' | 'self';
  setDeliveryMode: (mode: 'courier' | 'manual' | 'self') => void;
  updateDeliveryMode: (mode: 'courier' | 'manual' | 'self') => void; // Обновлен тип
}

const DeliveryModeSwitcher: React.FC<DeliveryModeSwitcherProps> = ({ deliveryMode, setDeliveryMode, updateDeliveryMode }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value as 'courier' | 'manual' | 'self'; // Приведение типа
    setDeliveryMode(newMode);
    updateDeliveryMode(newMode); // Вызов функции при изменении режима
  };

  return (
    <select value={deliveryMode} onChange={handleChange}>
      <option value="courier">Курьер</option>
      <option value="manual">Ручной</option>
      <option value="self">Самовывоз</option>
    </select>
  );
};

export default DeliveryModeSwitcher;
