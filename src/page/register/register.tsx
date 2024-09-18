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

const RegisterButton = styled(ButtonWithRipple)`
  /* Вы можете добавить дополнительные стили здесь */
`;

const RegisterComponent: React.FC<RegisterComponentProps> = ({ onAuthModeChange }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = (): string | null => {
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

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('https://enddel.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || t('something_went_wrong');
        throw new Error(errorMessage);
      }

      alert(t('success'));
      onAuthModeChange('login');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('something_went_wrong');
      console.error(t('error'), errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <LoginTitle>{t('register')}</LoginTitle>
      <RegisterForm onSubmit={handleSubmit}>
        <TextInput
          label={t('first_name')}
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <TextInput
          label={t('last_name')}
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <TextInput
          label={t('email')}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextInput
          label={t('address')}
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <TextInput
          label={t('phone')}
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <TextInput
          label={t('password')}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <RegisterButton type="submit" isDisabled={isSubmitting} isActive={!isSubmitting}>
          {isSubmitting ? t('loading') : t('register')}
        </RegisterButton>
      </RegisterForm>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

const LoginTitle = styled.h3`
  margin: 10px 0;
`;

const ErrorMessage = styled.p`
  color: ${theme.button.errorbtn};
  margin: 15px 0;
`;

export default RegisterComponent;
