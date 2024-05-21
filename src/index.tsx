import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { App } from './App';
import { GlobalStyled } from './styles/globalStyled';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from './layout/cart/CartContext';
import './i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GlobalStyled />
    <Router>
      <CartProvider>
        <App />
      </CartProvider>
    </Router>
  </React.StrictMode>
);


reportWebVitals();
