import React, { useState } from 'react';

interface Item {
  productId: number;
  productName: string;
  quantity: number;
}

interface Props {
  items: Item[];
  handleQuantityChange: (productId: number, newQuantity: number) => void;
  handleConfirmChange: (productId: number, newQuantity: number) => void;
}

const OrderProductList: React.FC<Props> = ({ items, handleQuantityChange, handleConfirmChange }) => {
  const [localItems, setLocalItems] = useState(items);

  const handleLocalQuantityChange = (productId: number, change: number) => {
    setLocalItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity: item.quantity + change } : item
      )
    );
  };

  return (
    <div>
      <p>Продукты:</p>
      <ul>
        {localItems.map((item) => (
          <li key={item.productId}>
            Продукт: {item.productName} (ID: {item.productId}) - Количество: {item.quantity}
            <button onClick={() => handleLocalQuantityChange(item.productId, 1)}>+</button>
            <button onClick={() => handleLocalQuantityChange(item.productId, -1)} disabled={item.quantity <= 0}>-</button>
            {item.quantity !== items.find(i => i.productId === item.productId)?.quantity && (
              <button onClick={() => handleConfirmChange(item.productId, item.quantity)}>Подтвердить</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderProductList;
