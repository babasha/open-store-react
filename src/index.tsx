import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';
import { GlobalStyled } from './styles/globalStyled';
import { CartProvider } from './layout/cart/CartContext';
import './i18n';
import { Mobilemenu } from './components/mobilemenu/mobilemenu'; // Ensure correct import path

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const AppWrapper = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <GlobalStyled isOpen={isOpen} />
      <Router>
        <CartProvider>
          <App />
        </CartProvider>
      </Router>
      <Mobilemenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
