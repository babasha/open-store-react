import React, { useEffect, useState } from 'react';
import { ListItem, Section, SectionTitle, Button } from '../../styles/AdminPanelStyles';

interface Courier {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  telegram_username: string;
  created_at: string;
  status: string;
}

const CourierList: React.FC = () => {
  const [courier, setCourier] = useState<Courier | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/couriers/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch courier');
        }
        return response.json();
      })
      .then((data) => {
        setCourier(data);
      })
      .catch((error) => {
        console.error('Error fetching courier:', error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const updateStatus = (newStatus: string) => {
    const token = localStorage.getItem('token');
    fetch('/couriers/me/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update status');
        }
        return response.json();
      })
      .then((updatedCourier) => {
        setCourier(updatedCourier);
      })
      .catch((error) => {
        console.error('Error updating status:', error);
        setError(error.message);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!courier) {
    return <p>No courier data found.</p>;
  }

  return (
    <Section>
      <SectionTitle>Courier Data</SectionTitle>
      <ListItem key={courier.id}>
        <p>{courier.first_name} {courier.last_name}</p>
        <p>Email: {courier.email}</p>
        <p>Address: {courier.address}</p>
        <p>Phone: {courier.phone}</p>
        <p>Telegram: {courier.telegram_username}</p>
        <p>Created At: {new Date(courier.created_at).toLocaleString()}</p>
        <p>Status: {courier.status}</p>
        <Button onClick={() => updateStatus('working')}>Работаю</Button>
        <Button onClick={() => updateStatus('not working')}>Не работаю</Button>
      </ListItem>
    </Section>
  );
};

export default CourierList;
