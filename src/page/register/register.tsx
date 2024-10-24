// src/components/Register/RegisterComponent.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import RegisterForm from './RegisterForm';
import Modal from './Modal';
import ErrorMessage from './ErrorMessage';
import { theme } from '../../styles/Theme';

interface RegisterComponentProps {
  onAuthModeChange: (mode: 'login' | 'register' | '') => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginTitle = styled.h3` 
  margin: 15px 0px 25px 0px;
  font-size: 22px;
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddressClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddressSelect = (selectedAddress: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      address: selectedAddress,
    }));
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = (): string | null => {
    const { firstName, lastName, email, phone, password } = formData;

    if (!firstName || !lastName || !email || !phone || !password) {
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
    console.log('Submitting form'); // Добавлено

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
    <Container>
      <LoginTitle>{t('register')}</LoginTitle>
      <RegisterForm
        formData={formData}
        onChange={handleChange}
        onAddressClick={handleAddressClick}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      {error && <ErrorMessage message={error} />}

      {isModalOpen && (
        <Modal onClose={handleModalClose} onAddressSelect={handleAddressSelect} />
      )}
    </Container>
  );
};

export default RegisterComponent;
