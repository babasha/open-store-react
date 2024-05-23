import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const LoginWithTelegram = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    // Определение функции обратного вызова
    (window as any).onTelegramAuth = (user: any) => {
      alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
      // Отправляем данные на сервер для проверки аутентификации
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
          setIsAuthenticated(true);
        }
      });
    };
  }, []);

  return (
    <div>
      <h1>Login</h1>
      <div id="telegram-login-container"></div>
      {isAuthenticated ? (
        <p>Welcome, you are authenticated!</p>
      ) : (
        <p>Please authenticate with Telegram.</p>
      )}
    </div>
  );
};

export default LoginWithTelegram;
