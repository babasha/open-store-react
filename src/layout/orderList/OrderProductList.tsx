import React from 'react';

interface Item {
  productId: number;
  productName: string;
  quantity: number;
}

interface Props {
  items: Item[];
}

const OrderProductList: React.FC<Props> = ({ items }) => {
  return (
    <div>
      <p>Продукты:</p>
      <ul>
        {items.map((item) => (
          <li key={item.productId}>
            Продукт: {item.productName} (ID: {item.productId}) - Количество: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderProductList;
