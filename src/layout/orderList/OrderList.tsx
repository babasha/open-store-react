import React, { useState, useEffect } from 'react';
import { Section, SectionTitle, List, ListItem, OrderDetails } from '../../styles/AdminPanelStyles';

interface Order {
  id: number;
  user_id: number;
  items: Array<{ productId: number; quantity: number }>;
  total: number;
  status: string;
  created_at: string;
}

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch('/orders', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message) });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched orders:', data); // Логирование полученных данных
        setOrders(data);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        alert(`Error fetching orders: ${error.message}`);
      });
  }, []);

  return (
    <Section>
      <SectionTitle>Orders List</SectionTitle>
      <List>
        {orders.length > 0 ? (
          orders.map((order) => (
            <ListItem key={order.id}>
              <OrderDetails>
                <p>Order ID: {order.id}</p>
                <p>User ID: {order.user_id}</p>
                <p>Total: ${order.total}</p>
                <p>Status: {order.status}</p>
                <p>Products:</p>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.productId}>
                      Product ID: {item.productId} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
                <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
              </OrderDetails>
            </ListItem>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </List>
    </Section>
  );
};

export default OrderList;
