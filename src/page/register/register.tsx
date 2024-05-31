import React, { useState } from 'react';
import { useAuth } from '../../layout/autoeization/AuthContext';

const RegisterComponent: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          address,
          phone,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      console.log('User registered', data);
      login(data.user, data.token); // Передаем данные пользователя и токен
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Registration error:', errorMessage);
      alert(errorMessage); // Отобразите сообщение об ошибке пользователю
    }
  };

  return (
    <div>
      <h1>Регистрация</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Имя"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Адрес"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default RegisterComponent;