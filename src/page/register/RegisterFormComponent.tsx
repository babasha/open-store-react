import React, { useState } from 'react';
import TextInput from '../../components/textinputs/TextInput';
import { useTranslation } from 'react-i18next';
import { RegisterButton, RegisterForm, ErrorMessage, LoginTitle } from './RegisterStyles';

interface RegisterFormComponentProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  error: string | null;
  handleAddressFocus: () => void;
}

const RegisterFormComponent: React.FC<RegisterFormComponentProps> = ({
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  error,
  handleAddressFocus,
}) => {
  const { t } = useTranslation();

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
          onFocus={handleAddressFocus}
          readOnly
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

export default RegisterFormComponent;
