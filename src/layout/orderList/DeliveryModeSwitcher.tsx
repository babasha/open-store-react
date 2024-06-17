// // src/layout/orderList/DeliveryModeSwitcher.tsx

// import React from 'react';

// interface DeliveryModeSwitcherProps {
//   deliveryMode: 'courier' | 'manual' | 'self';
//   setDeliveryMode: (mode: 'courier' | 'manual' | 'self') => void;
//   updateDeliveryMode: (mode: 'courier' | 'manual' | 'self') => void; // Обновлен тип
// }

// const DeliveryModeSwitcher: React.FC<DeliveryModeSwitcherProps> = ({ deliveryMode, setDeliveryMode, updateDeliveryMode }) => {
//   const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const newMode = event.target.value as 'courier' | 'manual' | 'self'; // Приведение типа
//     setDeliveryMode(newMode);
//     updateDeliveryMode(newMode); // Вызов функции при изменении режима
//   };

//   return (
//     <select value={deliveryMode} onChange={handleChange}>
//       <option value="courier">Курьер</option>
//       <option value="manual">Ручной</option>
//       <option value="self">Самовывоз</option>
//     </select>
//   );
// };

// export default DeliveryModeSwitcher;
import React from 'react';
import axios from 'axios';

interface DeliveryModeSwitcherProps {
  deliveryMode: 'courier' | 'manual' | 'self';
  setDeliveryMode: (mode: 'courier' | 'manual' | 'self') => void;
  updateDeliveryMode: (mode: 'courier' | 'manual' | 'self') => void;
}

const DeliveryModeSwitcher: React.FC<DeliveryModeSwitcherProps> = ({ deliveryMode, setDeliveryMode, updateDeliveryMode }) => {
  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value as 'courier' | 'manual' | 'self';
    setDeliveryMode(newMode);

    try {
      await axios.put('http://localhost:3000/delivery-mode', { deliveryMode: newMode }, { withCredentials: true });
    } catch (error) {
      console.error('Ошибка при обновлении режима доставки:', error);
    }

    updateDeliveryMode(newMode);
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
