// LoginFormComponent.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../autoeization/AuthContext';
import TextInput from '../../components/textinputs/TextInput';
import PasswordInput from './PasswordInput';
import styled from 'styled-components';
import ButtonWithRipple from '../../styles/btns/ButtonStyles';
import { useTranslation } from 'react-i18next';
import { EditButton } from '../../styles/btns/secondBtns';

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
`;

const LoginButton = styled(ButtonWithRipple)``;
const ForgotPasswordButton = styled(EditButton)``;
const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

interface LoginFormComponentProps {
  setIsForgotPassword: (value: boolean) => void;
}

const LoginFormComponent: React.FC<LoginFormComponentProps> = ({ setIsForgotPassword }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

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

      if (data.user.role === 'admin' || data.user.role === 'courier') {
        navigate('/admin'); // Перенаправляем админа и курьера в админ панель
      } else {
        navigate('/'); // Перенаправляем других пользователей на главную страницу
      }
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      console.error(t('error_login'), errorMessage);
      setError(errorMessage); // Отобразите сообщение об ошибке пользователю
    }
  };

  return (
    <LoginForm onSubmit={handleLogin}>
      <TextInput
        label={t('username')}
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <PasswordInput
        label={t('password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <LoginButton type="submit" isActive={true} isDisabled={false}>
        {t('login_button')}
      </LoginButton>
      <ForgotPasswordButton type="button" onClick={() => setIsForgotPassword(true)}>
        {t('forgot_password')}
      </ForgotPasswordButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </LoginForm>
  );
};

export default LoginFormComponent;
