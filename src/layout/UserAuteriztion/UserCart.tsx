import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      setIsForgotPassword(false);
      setIsResetPassword(true);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("https://enddel.com/auth/login", {
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
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      console.error(t('error_login'), errorMessage);
      alert(errorMessage); // Отобразите сообщение об ошибке пользователю
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch("https://enddel.com/auth/request-reset-password", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при сбросе пароля');
      }
      alert('Письмо для сброса пароля отправлено');
      setIsForgotPassword(false);
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      console.error('Ошибка при сбросе пароля:', errorMessage);
      alert(errorMessage);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://enddel.com/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: resetPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при сбросе пароля');
      }
      alert('Пароль успешно изменен');
      navigate('/auth/login');
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      console.error('Ошибка при сбросе пароля:', errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <div>
      <LoginTitle>{t('titlelogin')}</LoginTitle>
      <LoginForm onSubmit={isResetPassword ? handleResetPassword : handleLogin}>
        {!isResetPassword && (
          <>
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
          </>
        )}
        {isResetPassword && (
          <>
            <TextInput
              label="Введите новый пароль"
              type="password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
            />
            <LoginButton type="submit" isActive={true} isDisabled={false}>
              Сбросить пароль
            </LoginButton>
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
