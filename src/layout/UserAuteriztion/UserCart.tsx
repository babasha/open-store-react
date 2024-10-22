// LoginComponent.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoginFormComponent from './LoginFormComponent';
import ForgotPasswordComponent from './ForgotPasswordComponent';
import ResetPasswordComponent from './ResetPasswordComponent';
import TelegramLoginButton from '../../components/telegram/TelegramLoginButton'; // Импортируем TelegramLoginButton
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../autoeization/AuthContext'; // Импортируем useAuth

const LoginTitle = styled.h3`
  margin: 15px 0px 25px 5px;
  font-size: 22px;
`;

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const LoginComponent: React.FC = () => {
  const { t } = useTranslation();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { token } = useParams<{ token: string }>();
  const { login } = useAuth(); // Получаем функцию login
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setIsForgotPassword(false);
      setIsResetPassword(true);
    }
  }, [token]);

  // Обработчик аутентификации через Telegram
  const handleTelegramAuth = async (telegramUser: TelegramUser) => {
    console.log('Данные, полученные от Telegram:', telegramUser);
    try {
      const response = await axios.post('https://enddel.com/auth/telegram', telegramUser, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { user: appUser, token } = response.data;
      login(appUser, token); // Авторизуем пользователя

      // Перенаправляем пользователя в зависимости от роли
      if (appUser.role === 'admin' || appUser.role === 'courier') {
        navigate('/admin'); // Перенаправляем админа и курьера в админ панель
      } else {
        navigate('/'); // Перенаправляем других пользователей на главную страницу
      }
    } catch (error: any) {
      console.error('Telegram аутентификация не удалась:', error);
      // Здесь вы можете добавить отображение ошибки пользователю
    }
  };

  return (
    <div>
      <LoginTitle>{t('titlelogin')}</LoginTitle>
      {!isResetPassword ? (
        !isForgotPassword ? (
          <div>
            <LoginFormComponent setIsForgotPassword={setIsForgotPassword} />
            {/* Добавляем кнопку входа через Telegram */}
            <TelegramLoginButton botName="enddel_com_bot" onAuth={handleTelegramAuth} />
          </div>
        ) : (
          <ForgotPasswordComponent setIsForgotPassword={setIsForgotPassword} />
        )
      ) : (
        <ResetPasswordComponent />
      )}
    </div>
  );
};

export default LoginComponent;
