import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';
import { GlobalStyled } from './styles/globalStyled';
import { CartProvider } from './layout/cart/CartContext';
import './i18n';

// Подключите скрипт Telegram Web Apps
import './telegram-web-app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const AppWrapper = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  return (
    <>
      <GlobalStyled isOpen={isOpen} />
      <Router>
        <CartProvider>
          <App />
        </CartProvider>
      </Router>
      {/* <Mobilemenu isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </>
  );
};

root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
