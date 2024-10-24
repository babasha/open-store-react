// src/components/Register/RegisterForm.tsx
import React from 'react';
import TextInput from '../../components/textinputs/TextInput';
import styled from 'styled-components';
import ButtonWithRipple from '../../styles/btns/ButtonStyles';
import { useTranslation } from 'react-i18next';

interface RegisterFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    password: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressClick: () => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // Добавлено
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1rem;
`;

const RegisterButton = styled(ButtonWithRipple)`
  /* Дополнительные стили при необходимости */
`;

const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  onChange,
  onAddressClick,
  isSubmitting,
  onSubmit, // Добавлено
}) => {
  const { t } = useTranslation();

  return (
    <Form>
      <TextInput
        label={t('first_name')}
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={onChange}
        required
      />
      <TextInput
        label={t('last_name')}
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={onChange}
        required
      />
      <TextInput
        label={t('email')}
        type="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        required
      />
      <TextInput
        label={t('address')}
        type="text"
        name="address"
        value={formData.address}
        onClick={onAddressClick}
        readOnly
        onChange={() => {}} // Пустая функция, так как поле только для чтения
      />
      <TextInput
        label={t('phone')}
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={onChange}
        required
      />
      <TextInput
        label={t('password')}
        type="password"
        name="password"
        value={formData.password}
        onChange={onChange}
        required
      />
      <RegisterButton type="submit" isDisabled={isSubmitting} isActive={!isSubmitting}>
        {isSubmitting ? t('loading') : t('register')}
      </RegisterButton>
    </Form>
  );
};

export default RegisterForm;
