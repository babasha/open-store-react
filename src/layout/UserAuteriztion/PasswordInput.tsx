// PasswordInput.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { theme } from '../../styles/Theme';

const PasswordInputContainer = styled.div`
  position: relative;
`;

const Input = styled(motion.input)`
  width: 100%; /* Ширина поля ввода пароля */
  height: 30px;
  border: 1.5px solid black;
  border-radius: 10px;
  font-size: 14px;
  padding: 0 12px;
  /* padding-right: 2.5rem; */
  
  &:focus {
    outline: none;
    border-color: ${theme.button.buttonActive};
  }

  &:focus + label .text,
  &:not([value='']) + label .text {
    background-color: white;
    font-size: 12px;
    color: black;
    transform: translate(0, -100%);
  }

  &:focus + label .text {
    border-color: ${theme.button.buttonActive};
    color: ${theme.button.buttonActive};
  }

  @media (max-width: 40rem) {
    width: 70vw;
  }
`;

const Label = styled.label`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 2px solid transparent;
  background-color: transparent;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const Text = styled(motion.div)`
  padding: 0 0.5rem;
  background-color: transparent;
  color: black;
  transition: transform 0.15s ease-out, font-size 0.15s ease-out, background-color 0.2s ease-out, color 0.15s ease-out;
`;

const TogglePasswordVisibilityButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 1.2rem;
  color: #888;
`;

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, value, onChange }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <PasswordInputContainer>
      <Input
        type={passwordVisible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete="off"
        aria-labelledby={`placeholder-${label}`}
        initial={{ borderColor: 'black' }}
        whileFocus={{ borderColor: `${theme.button.buttonActive}` }}
      />
      <Label htmlFor={label} id={`placeholder-${label}`}>
        <Text className="text">{label}</Text>
      </Label>
      <TogglePasswordVisibilityButton
        onClick={() => setPasswordVisible(!passwordVisible)}
        type="button"
      >
        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
      </TogglePasswordVisibilityButton>
    </PasswordInputContainer>
  );
};

export default PasswordInput;
