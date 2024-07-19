import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';
import { GlobalStyled } from './styles/globalStyled';
import { CartProvider } from './layout/cart/CartContext';
import './i18n';
import './scripts/telegram-web-app.js'; // Обновленный путь
import { AuthProvider, useAuth } from './layout/autoeization/AuthContext'; // Импорт контекста авторизации

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const AppWrapper = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { login } = useAuth(); // Использование функции login из контекста авторизации

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      
      const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
      if (initDataUnsafe && initDataUnsafe.user) {
        // Отправка данных пользователя на сервер для верификации
        fetch(`${process.env.PUBLIC_URL}/auth/telegram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: initDataUnsafe.user }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.token) {
              login(data.user, data.token); // Логин через Telegram
            }
          })
          .catch(error => {
            console.error('Ошибка при авторизации через Telegram:', error);
          });
      }
    }
  }, [login]);

  return (
    <>
      <GlobalStyled isOpen={isOpen} />
      <Router>
        <CartProvider>
          <App />
        </CartProvider>
      </Router>
    </>
  );
};

root.render(
  <AuthProvider>
    <React.StrictMode>
      <AppWrapper />
    </React.StrictMode>
  </AuthProvider>
);
