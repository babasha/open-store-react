// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email?: string; // Сделано необязательным
  address?: string;
  phone?: string; // Сделано необязательным
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Объявляем глобальные переменные для TypeScript
declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    console.log('storedUser:', storedUser);
    console.log('storedToken:', storedToken);
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        socket.emit('login', parsedUser.id);

        // Настраиваем данные пользователя в Crisp, если они доступны
        if (window.$crisp) {
          if (parsedUser.email) {
            window.$crisp.push(["set", "user:email", [parsedUser.email]]);
          }
          window.$crisp.push(["set", "user:nickname", [`${parsedUser.first_name} ${parsedUser.last_name}`]]);
          if (parsedUser.phone) {
            window.$crisp.push(["set", "user:phone", [parsedUser.phone]]);
          }
          window.$crisp.push(["set", "session:data", [[["user_id", parsedUser.id.toString()]]]]);
        }
      } catch (error) {
        console.error('Ошибка при парсинге данных пользователя из localStorage:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    socket.emit('login', user.id);

    // Настраиваем данные пользователя в Crisp
    if (window.$crisp) {
      if (user.email) {
        window.$crisp.push(["set", "user:email", [user.email]]);
      }
      window.$crisp.push(["set", "user:nickname", [`${user.first_name} ${user.last_name}`]]);
      if (user.phone) {
        window.$crisp.push(["set", "user:phone", [user.phone]]);
      }
      window.$crisp.push(["set", "session:data", [[["user_id", user.id.toString()]]]]);
    }
  };

  const logout = () => {
    if (user) {
      socket.emit('logout', user.id);
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');

    // Сбрасываем сессию Crisp при выходе пользователя
    if (window.$crisp) {
      window.$crisp.push(["do", "session:reset", []]);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
