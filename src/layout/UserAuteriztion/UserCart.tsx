import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../autoeization/AuthContext';

const LoginComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Что-то пошло не так');
      }
      login(data.user, data.token); // Передаем данные пользователя и токен

      // Логирование данных пользователя для отладки
      console.log('Данные пользователя после входа:', data.user);

      if (data.user.role === 'admin' || data.user.role === 'courier') {
        navigate('/admin'); // Перенаправляем админа и курьера в админ панель
      } else {
        navigate('/'); // Перенаправляем других пользователей на главную страницу
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Ошибка входа:', errorMessage);
      alert(errorMessage); // Отобразите сообщение об ошибке пользователю
    }
  };

  return (
    <div>
      <h1>Вход</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Имя пользователя, Email или Телефон"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default LoginComponent;
