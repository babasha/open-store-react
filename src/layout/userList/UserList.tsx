import React, { useState, useEffect } from 'react';
import { Section, SectionTitle, List, ListItem, UserDetails } from '../../styles/AdminPanelStyles';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  telegram_username: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  return (
    <Section>
      <SectionTitle>Users List</SectionTitle>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            {user.first_name} {user.last_name} - {user.email}
            <UserDetails>
              <p>Address: {user.address}</p>
              <p>Phone: {user.phone}</p>
              <p>Telegram: {user.telegram_username}</p>
            </UserDetails>
          </ListItem>
        ))}
      </List>
    </Section>
  );
};

export default UserList;
