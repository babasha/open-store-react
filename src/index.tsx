  import React, { useEffect } from 'react';
  import ReactDOM from 'react-dom/client';
  import { BrowserRouter as Router } from 'react-router-dom';
  import  App  from './App';
  import { GlobalStyled } from './styles/globalStyled';
  import { CartProvider } from './layout/basket/CartContext';
  import './i18n';
  import './scripts/telegram-web-app.js'; // Обновленный путь

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  const AppWrapper = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    useEffect(() => {
      if (window.Telegram && window.Telegram.WebApp) {
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
      </>
    );
  };

  root.render(
    <React.StrictMode>
      <AppWrapper />
    </React.StrictMode>
  );
