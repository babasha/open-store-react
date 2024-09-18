import React, { useState } from 'react';
import TextInput from '../../components/textinputs/TextInput';
import styled from 'styled-components';
import ButtonWithRipple from '../../styles/btns/ButtonStyles';
import { theme } from '../../styles/Theme';
import { useTranslation } from 'react-i18next';
import MapPicker from '../../components/MapPicker'; // Исправлен путь до MapPicker

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
  /* Add additional styles here if needed */
`;

const Modal = styled.div`
  position: fixed;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  background-color: white;
  z-index: 1000;
  border: 1px solid #ccc;
  overflow: auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
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

  // State for controlling the modal
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
          onClick={handleAddressClick}
          readOnly
          onChange={() => {}} // Добавили пустую функцию
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

      {/* Modal for MapPicker */}
      {isModalOpen && (
        <>
          <ModalOverlay onClick={handleModalClose} />
          <Modal>
            <CloseButton onClick={handleModalClose}>✕</CloseButton>
            <MapPicker onAddressSelect={handleAddressSelect} />
          </Modal>
        </>
      )}
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
