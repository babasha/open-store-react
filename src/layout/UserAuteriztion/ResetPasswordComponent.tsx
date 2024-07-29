import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextInput from '../../components/textinputs/TextInput';
import styled from 'styled-components';
import ButtonWithRipple from '../../styles/btns/ButtonStyles';

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const LoginButton = styled(ButtonWithRipple)``;
const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const ResetPasswordComponent: React.FC = () => {
  const [resetPassword, setResetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    setError(null);
    e.preventDefault();

    if (resetPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

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
      navigate('/');
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      console.error('Ошибка при сбросе пароля:', errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <LoginForm onSubmit={handleResetPassword}>
      <TextInput
        label="Введите новый пароль"
        type="password"
        value={resetPassword}
        onChange={(e) => setResetPassword(e.target.value)}
      />
      <TextInput
        label="Подтвердите новый пароль"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <LoginButton type="submit" isActive={true} isDisabled={false}>
        Сбросить пароль
      </LoginButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </LoginForm>
  );
};

export default ResetPasswordComponent;
