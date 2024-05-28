import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/Theme';
import { useAuth } from '../autoeization/AuthContext';

type UserInfo = {
  firstName: string;
  lastName: string;
  address: string;
};

const LoginWithTelegram = () => {
  const [authMode, setAuthMode] = useState(''); // 'login', 'register', 'forgotPassword'
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { login } = useAuth();

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'OpenStore_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');

    const container = document.getElementById('telegram-login-container');
    if (container) {
      container.appendChild(script);
    }

    (window as any).onTelegramAuth = (user: any) => {
      alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
      fetch(`/auth/telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated) {
          login(data.user);
          setUserInfo(data.user);
        }
      });
    };
  }, [login]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const { username, password } = target.elements as any;
    try {
      const response = await fetch(`/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      login(data.user);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Login error:', errorMessage);
      alert(errorMessage); // Отобразите сообщение об ошибке пользователю
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const { firstName, lastName, email, address, phone, telegram, password } = target.elements as any;
    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          address: address.value,
          phone: phone.value,
          telegram: telegram.value,
          password: password.value,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      console.log('User registered', data);
      setAuthMode('login');
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Registration error:', errorMessage);
      alert(errorMessage); // Отобразите сообщение об ошибке пользователю
    }
  };

  const handleForgotPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const { fullName, email, phone } = target.elements as any;
    fetch(`/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: fullName.value,
        email: email.value,
        phone: phone.value,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.resetLinkSent) {
        alert('Password reset link sent to your email.');
        setAuthMode('login');
      }
    });
  };

  return (
    <div>
      <h1>Вход</h1>
      <div id="telegram-login-container"></div>
      {authMode === '' && (
        <div>
          <button onClick={() => setAuthMode('login')}>Войти</button>
          <button onClick={() => setAuthMode('register')}>Зарегистрироваться</button>
        </div>
      )}
      {authMode === 'login' && (
        <form onSubmit={handleLogin}>
          <input type="text" name="username" placeholder="Имя пользователя, Email или Телефон" required />
          <input type="password" name="password" placeholder="Пароль" required />
          <button type="submit">Войти</button>
          <button type="button" onClick={() => setAuthMode('forgotPassword')}>Забыли пароль?</button>
        </form>
      )}
      {authMode === 'register' && (
        <form onSubmit={handleRegister}>
          <input type="text" name="firstName" placeholder="Имя" required />
          <input type="text" name="lastName" placeholder="Фамилия" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="text" name="address" placeholder="Адрес" required />
          <input type="text" name="phone" placeholder="Телефон" required />
          <input type="text" name="telegram" placeholder="Имя пользователя в Telegram (необязательно)" />
          <input type="password" name="password" placeholder="Пароль" required />
          <button type="submit">Зарегистрироваться</button>
          <button type="button" onClick={() => setAuthMode('login')}>Уже есть аккаунт? Войти</button>
        </form>
      )}
      {authMode === 'forgotPassword' && (
        <form onSubmit={handleForgotPassword}>
          <input type="text" name="fullName" placeholder="Полное имя" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="text" name="phone" placeholder="Телефон" required />
          <button type="submit">Отправить</button>
          <button type="button" onClick={() => setAuthMode('login')}>Отмена</button>
        </form>
      )}
    </div>
  );
};

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: ${theme.colors.font};
  color: white;
  cursor: pointer;
  &:hover {
    background-color: ${theme.colors.ShopWindowBg};
  }
`;

export default LoginWithTelegram;
