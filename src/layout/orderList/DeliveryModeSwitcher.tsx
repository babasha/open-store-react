// DeliveryModeSwitcher.tsx
import React, { useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface DeliveryModeSwitcherProps {
  userId: number;
  deliveryMode: 'courier' | 'manual' | 'self';
  setDeliveryMode: (mode: 'courier' | 'manual' | 'self') => void;
  updateDeliveryMode: (mode: 'courier' | 'manual' | 'self') => void;
}

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f8f8;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Option = styled.option`
  font-size: 16px;
`;

const DeliveryModeSwitcher: React.FC<DeliveryModeSwitcherProps> = ({ userId, deliveryMode, setDeliveryMode, updateDeliveryMode }) => {
  useEffect(() => {
    // Получаем текущий режим доставки при загрузке компонента
    const fetchDeliveryMode = async () => {
      try {
        const response = await axios.get('http://45.146.164.162:3000/user/me/delivery-option', { withCredentials: true });
        setDeliveryMode(response.data.delivery_option);
      } catch (error) {
        console.error('Ошибка при получении текущего режима доставки:', error);
      }
    };

    fetchDeliveryMode();
  }, [setDeliveryMode]);

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value as 'courier' | 'manual' | 'self';
    setDeliveryMode(newMode);

    try {
      await axios.put(
        `http://45.146.164.162:3000/user/me/delivery-option`, 
        { deliveryOption: newMode },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
    } catch (error) {
      console.error('Ошибка при обновлении режима доставки:', error);
    }

    updateDeliveryMode(newMode);
  };

  return (
    <Select value={deliveryMode} onChange={handleChange}>
      <Option value="courier">Курьер</Option>
      <Option value="manual">Ручной</Option>
      <Option value="self">Самовывоз</Option>
    </Select>
  );
};

export default DeliveryModeSwitcher;
