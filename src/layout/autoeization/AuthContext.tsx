import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket'; // Импортируйте ваш socket

interface AuthContextType {
  user: any;
  login: (userData: any, token: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3000/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setUser(data.user);
        })
        .catch(error => {
          console.error('Ошибка при получении данных пользователя:', error);
        });
    }
  }, []);

  const login = (userData: any, token: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
    socket.emit('login', userData.id); // Подключение к сокету при входе
  };

  const logout = () => {
    socket.emit('logout', user.id); // Отключение от сокета при выходе
    setUser(null);
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
