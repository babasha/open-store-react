import React, { useState, useEffect } from 'react';
import { Section, SectionTitle, List, ListItem, OrderDetails } from '../../styles/AdminPanelStyles';

interface Item {
  productId: number;
  productName: string;
  quantity: number;
}

interface Order {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  address: string;
  items: Item[];
  total: number;
  status: string;
  created_at: string;
}

const OrderList: React.FC = () => {
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
      .then((data: Order[]) => {
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
                <p>User: {order.first_name} {order.last_name}</p>
                <p>Address: {order.address}</p>
                <p>Total: ${order.total}</p>
                <p>Status: {order.status}</p>
                <p>Products:</p>
                <ul>
                  {order.items.map((item: Item) => (
                    <li key={item.productId}>
                      Product: {item.productName} (ID: {item.productId}) - Quantity: {item.quantity}
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
