import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '../../components/textinputs/TextInput';
import styled from 'styled-components';
import { EditButton } from '../../styles/btns/secondBtns';

const ForgotPasswordButton = styled(EditButton)`
 margin-top: 10px;
`;
const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

interface ForgotPasswordComponentProps {
  setIsForgotPassword: (value: boolean) => void;
}

const ForgotPasswordComponent: React.FC<ForgotPasswordComponentProps> = ({ setIsForgotPassword }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async () => {
    setError(null);
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
      setError(errorMessage);
    }
  };

  return (
    <>
      <TextInput
        label={t('loginforget')}
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <ForgotPasswordButton type="button" onClick={handleForgotPassword}>
        {t('reset_password')}
      </ForgotPasswordButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
};

export default ForgotPasswordComponent;
