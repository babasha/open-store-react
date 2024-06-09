// src/layout/orderList/OrderProductList.tsx

import React, { useState, useEffect } from 'react';

interface Item {
  productId: number;
  productName: string;
  quantity: number;
  ready: boolean;
}

interface Props {
  items: Item[];
  handleQuantityChange: (productId: number, newQuantity: number) => void;
  handleConfirmChange: (productId: number, newQuantity: number) => void;
  handleReadyChange: (productId: number, ready: boolean) => void;
  showCheckboxes: boolean;
}

const OrderProductList: React.FC<Props> = ({ items, handleQuantityChange, handleConfirmChange, handleReadyChange, showCheckboxes }) => {
  const [localItems, setLocalItems] = useState(items);
  const [changedItems, setChangedItems] = useState<number[]>([]);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleLocalQuantityChange = (productId: number, change: number) => {
    setLocalItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity: item.quantity + change } : item
      )
    );
    setChangedItems(prevChangedItems =>
      prevChangedItems.includes(productId)
        ? prevChangedItems
        : [...prevChangedItems, productId]
    );
  };

  const handleConfirmClick = (productId: number, newQuantity: number) => {
    handleConfirmChange(productId, newQuantity);
    setChangedItems(prevChangedItems => prevChangedItems.filter(id => id !== productId));
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
            {changedItems.includes(item.productId) && (
              <button onClick={() => handleConfirmClick(item.productId, item.quantity)}>Подтвердить</button>
            )}
            {showCheckboxes && (
              <label>
                <input 
                  type="checkbox" 
                  checked={item.ready} 
                  onChange={(e) => handleReadyChange(item.productId, e.target.checked)} 
                />
                Готово
              </label>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderProductList;
