import React, { useState, useEffect } from 'react';
import { Section, SectionTitle, List, ListItem, OrderDetails } from '../../styles/AdminPanelStyles';

interface Order {
  id: number;
  user_id: number;
  products: Array<{ id: number; name: string; quantity: number; price: number }>;
  total: number;
  status: string;
}

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch('/orders')
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  return (
    <Section>
      <SectionTitle>Orders List</SectionTitle>
      <List>
        {orders.map((order) => (
          <ListItem key={order.id}>
            <OrderDetails>
              <p>Order ID: {order.id}</p>
              <p>User ID: {order.user_id}</p>
              <p>Total: ${order.total}</p>
              <p>Status: {order.status}</p>
              <p>Products:</p>
              <ul>
                {order.products.map((product) => (
                  <li key={product.id}>
                    {product.name} - {product.quantity} x ${product.price}
                  </li>
                ))}
              </ul>
            </OrderDetails>
          </ListItem>
        ))}
      </List>
    </Section>
  );
};

export default OrderList;
