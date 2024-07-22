import React, { useState } from 'react';
import { useAuth } from '../../layout/autoeization/AuthContext';
import TextInput from '../../components/textinputs/TextInput';
import styled from 'styled-components';
import ButtonWithRipple from '../../styles/btns/ButtonStyles';
import { theme } from '../../styles/Theme';
import { useTranslation } from 'react-i18next';

interface RegisterComponentProps {
  onAuthModeChange: (mode: 'login' | 'register' | '') => void;
}

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1rem;
`;

const RegisterButton = styled(ButtonWithRipple)``;

const RegisterComponent: React.FC<RegisterComponentProps> = ({ onAuthModeChange }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const { firstName, lastName, email, address, phone, password } = formData;
    if (!firstName || !lastName || !email || !address || !phone || !password) {
      return t('all_fields_required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t('invalid_email');
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null); // Сбрасываем ошибку перед новым запросом
    setIsSubmitting(true);
    try {
      const response = await fetch("https://enddel.com/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t('something_went_wrong'));
      }

      alert(t('success'));
      onAuthModeChange('login');
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(t('error'), errorMessage);
      setError(errorMessage); // Отобразите сообщение об ошибке пользователю
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <LoginTitle>{t('title')}</LoginTitle>
      <RegisterForm onSubmit={handleSubmit}>
        <TextInput
          label={t('first_name')}
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <TextInput
          label={t('last_name')}
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <TextInput
          label={t('email')}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextInput
          label={t('address')}
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <TextInput
          label={t('phone')}
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextInput
          label={t('password')}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <RegisterButton type="submit" isActive={!isSubmitting} isDisabled={isSubmitting}>
          {isSubmitting ? t('loading') : t('register')}
        </RegisterButton>
      </RegisterForm>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

const LoginTitle = styled.h3`
  margin: 10px 0px;
`;

const ErrorMessage = styled.p`
  color: ${theme.button.errorbtn};
  margin: 15px  0px;
`;

export default RegisterComponent;
