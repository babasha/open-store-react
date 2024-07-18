import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Courier {
  id: number;
  first_name: string;
  last_name: string;
}

interface CourierSwitcherProps {
  orderId: number; // Добавлено: идентификатор заказа
  selectedCourierId: number | null;
  setSelectedCourierId: (id: number) => void;
}

const CourierSwitcher: React.FC<CourierSwitcherProps> = ({ orderId, selectedCourierId, setSelectedCourierId }) => {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkingCouriers = async () => {
    try {
      const response = await axios.get('http://45.146.164.162:3000/couriers/working', { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении списка курьеров:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadCouriers = async () => {
      try {
        const couriers = await fetchWorkingCouriers();
        setCouriers(couriers);
      } catch (error) {
        setError('Ошибка при загрузке списка курьеров');
      } finally {
        setLoading(false);
      }
    };

    loadCouriers();
  }, []);

  useEffect(() => {
    const assignCourier = async () => {
      if (selectedCourierId) {
        try {
          await axios.put(`http://45.146.164.162:3000/orders/${orderId}/assign-courier`, { courierId: selectedCourierId }, { withCredentials: true });
          console.log('Курьер назначен');
        } catch (error) {
          console.error('Ошибка при назначении курьера:', error);
        }
      }
    };

    assignCourier();
  }, [selectedCourierId, orderId]);

  if (loading) {
    return <p>Загрузка курьеров...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <label>Выберите курьера:</label>
      <select
        value={selectedCourierId ?? ''}
        onChange={(e) => setSelectedCourierId(Number(e.target.value))}
      >
        <option value="" disabled>Выберите курьера</option>
        {couriers.map((courier) => (
          <option key={courier.id} value={courier.id}>
            {courier.first_name} {courier.last_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CourierSwitcher;
