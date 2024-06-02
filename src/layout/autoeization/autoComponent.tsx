import React, { useState } from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/Theme';
import { useAuth } from '../autoeization/AuthContext';
import LoginComponent from '../UserAuteriztion/UserCart';
import RegisterComponent from '../../page/register/register';

export const AutorizationComponent: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | ''>('');
  const { user, logout } = useAuth();

  const handleSetAuthMode = (mode: 'login' | 'register' | '') => {
    setAuthMode(mode);
  };

  if (user) {
    return (
      <Container width={'100%'}>
        <CartdiInner>
          <div>
            <h2>Добро пожаловать, {user.first_name} {user.last_name}</h2>
            <p>Адрес: {user.address}</p>
            <button onClick={logout}>Выйти</button>
          </div>
        </CartdiInner>
      </Container>
    );
  }

  return (
    <Container width={'100%'}>
      <CartdiInner>
        <div>
          {authMode === '' && (
            <div>
              <button onClick={() => handleSetAuthMode('login')}>Войти</button>
              <button onClick={() => handleSetAuthMode('register')}>Зарегистрироваться</button>
            </div>
          )}
          {authMode === 'login' && (
            <div>
              <button onClick={() => handleSetAuthMode('')}>Назад</button>
              <LoginComponent />
            </div>
          )}
          {authMode === 'register' && (
            <div>
              <button onClick={() => handleSetAuthMode('')}>Назад</button>
              <RegisterComponent />
            </div>
          )}
        </div>
      </CartdiInner>
    </Container>
  );
};

const CartdiInner = styled.div`
  background-color: ${theme.colors.mainBg};
  margin-top: 10px;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
`;

export default AutorizationComponent;
