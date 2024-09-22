import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void; // Добавлено здесь
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        socket.emit('login', parsedUser.id);
      } catch (error) {
        console.error('Ошибка при парсинге данных пользователя из localStorage:', error);
        
      }
    
    }
    
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.withCredentials = true;
    socket.emit('login', user.id);
    console.log('User data from server:', user);

  };

  const logout = () => {
    if (user) {
      socket.emit('logout', user.id);
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/auth');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      const updatedUser = { ...prevUser, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return <AuthContext.Provider value={{ user, login, logout, updateUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
