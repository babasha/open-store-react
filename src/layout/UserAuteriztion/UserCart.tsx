import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../autoeization/AuthContext';
import TextInput from '../../components/textinputs/TextInput';
import styled from 'styled-components';
import ButtonWithRipple from '../../styles/btns/ButtonStyles';
import { useTranslation } from 'react-i18next';

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const LoginButton = styled(ButtonWithRipple)``;

const ForgotPasswordButton = styled.button``;

const LoginComponent: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t('error_login'));
      }
      login(data.user, data.token); // Передаем данные пользователя и токен

      // Логирование данных пользователя для отладки
      console.log(t('user_data'), data.user);

      if (data.user.role === 'admin' || data.user.role === 'courier') {
        navigate('/admin'); // Перенаправляем админа и курьера в админ панель
      } else {
        navigate('/'); // Перенаправляем других пользователей на главную страницу
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(t('error_login'), errorMessage);
      alert(errorMessage); // Отобразите сообщение об ошибке пользователю
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/request-reset-password", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || t('error_reset_password'));
      }
      alert(t('reset_password_email_sent'));
      setIsForgotPassword(false); // Вернуть в режим логина после отправки запроса
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(t('error_reset_password'), errorMessage);
      alert(errorMessage); // Отобразите сообщение об ошибке пользователю
    }
  };

  return (
    <div>
      <LoginTitle>{t('titlelogin')}</LoginTitle>
      <LoginForm onSubmit={handleLogin}>
        <TextInput
          label={t('username')}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {!isForgotPassword && (
          <TextInput
            label={t('password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        {!isForgotPassword ? (
          <>
            <LoginButton type="submit" isActive={true} isDisabled={false}>
              {t('login_button')}
            </LoginButton>
            <ForgotPasswordButton type="button" onClick={() => setIsForgotPassword(true)}>
              {t('forgot_password')}
            </ForgotPasswordButton>
          </>
        ) : (
          <>
            <ForgotPasswordButton type="button" onClick={handleForgotPassword}>
              {t('reset_password')}
            </ForgotPasswordButton>
          </>
        )}
      </LoginForm>
    </div>
  );
};

const LoginTitle = styled.h3`
  margin: 10px 0px;
`;

export default LoginComponent;
