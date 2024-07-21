import React, { useState } from 'react';
import { useAuth } from '../../layout/autoeization/AuthContext';
import TextInput from '../../components/textinputs/TextInput';
import styled from 'styled-components';
import ButtonWithRipple from '../../styles/btns/ButtonStyles';

interface RegisterComponentProps {
  onAuthModeChange: (mode: 'login' | 'register' | '') => void;
}

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const RegisterButton = styled(ButtonWithRipple)``;

const RegisterComponent: React.FC<RegisterComponentProps> = ({ onAuthModeChange }) => {
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
      return 'Все поля должны быть заполнены';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Неверный формат email';
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
        throw new Error(data.error || 'Что-то пошло не так');
      }

      alert('Регистрация прошла успешно');
      onAuthModeChange('login');
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Ошибка регистрации:', errorMessage);
      setError(errorMessage); // Отобразите сообщение об ошибке пользователю
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <LoginTitle>Регистрация</LoginTitle>
      <RegisterForm onSubmit={handleSubmit}>
        <TextInput
          label="Имя"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <TextInput
          label="Фамилия"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <TextInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextInput
          label="Адрес"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <TextInput
          label="Телефон"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextInput
          label="Пароль"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <RegisterButton type="submit" isActive={!isSubmitting} isDisabled={isSubmitting}>
          {isSubmitting ? 'Загрузка...' : 'Зарегистрироваться'}
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
  color: red;
  margin: 15px  0px;
`;

export default RegisterComponent;
