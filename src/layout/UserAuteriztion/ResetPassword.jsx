import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://enddel.com/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при сбросе пароля');
      }
      alert('Пароль успешно изменен');
      navigate('/auth/login');
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Введите новый пароль" 
        required 
      />
      <button type="submit">Сбросить пароль</button>
    </form>
  );
};

export default ResetPassword;
