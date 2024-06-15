import React, { useState, useEffect } from 'react';
import { Section, SectionTitle, List, ListItem, UserDetails, Input, Button, RoleSelect } from '../../styles/AdminPanelStyles';
import * as XLSX from 'xlsx';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  telegram_username: string;
  role: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetch('/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "Users.xlsx");
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    fetch(`/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update role');
        }
        return response.json();
      })
      .then((updatedUser) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      })
      .catch((error) => console.error('Error updating role:', error));
  };

  return (
    <Section>
      <SectionTitle>Users List</SectionTitle>
      <Input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Button onClick={exportToExcel}>Export to Excel</Button>
      <List>
        {filteredUsers.map((user) => (
          <ListItem key={user.id}>
            {user.first_name} {user.last_name} - {user.email}
            <UserDetails>
              <p>Address: {user.address}</p>
              <p>Phone: {user.phone}</p>
              <p>Telegram: {user.telegram_username}</p>
              <p>Role: {user.role}</p>
              <RoleSelect
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
              >
                <option value="courier">Courier</option>
                <option value="user">User</option>
              </RoleSelect>
            </UserDetails>
          </ListItem>
        ))}
      </List>
    </Section>
  );
};

export default UserList;
