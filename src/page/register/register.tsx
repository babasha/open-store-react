// src/components/RegisterComponent.tsx
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

const RegisterButton = styled(ButtonWithRipple)`

`;

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
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Сбрасываем ошибку перед новым запросом
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

      // Переключаемся на режим авторизации после успешной регистрации
      alert('Регистрация прошла успешно');
      onAuthModeChange('login');
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Ошибка регистрации:', errorMessage);
      setError(errorMessage); // Отобразите сообщение об ошибке пользователю
    }
  };

  return (
    <div>
      <h1>Регистрация</h1>
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
        <RegisterButton type="submit" isActive={true} isDisabled={false}>Зарегистрироваться</RegisterButton>
      </RegisterForm>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RegisterComponent;
