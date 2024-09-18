// src/components/textinputs/TextInput.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/Theme';

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled(motion.input)`
  height: 30px;
  border: 1.5px solid black;
  border-radius: 10px;
  font-size: 14px;
  padding: 0 12px;

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

interface TextInputProps {
  label: string;
  name?: string;
  type?: string;
  value: string;
  required?: boolean; // Поддержка required
  onFocus?: () => void; // Поддержка onFocus
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean; // Поддержка readOnly
  onClick?: () => void; // Исправлено: тип onClick теперь функция
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  required = false,
  onFocus,
  onChange,
  readOnly = false, // Значение по умолчанию для readOnly
  onClick,
}) => {
  return (
    <InputContainer>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        required={required}
        readOnly={readOnly} // Передаем readOnly в input
        autoComplete="off"
        aria-labelledby={`placeholder-${label}`}
        initial={{ borderColor: 'black' }}
        onClick={onClick} // Теперь onClick принимает функцию
        whileFocus={{ borderColor: `${theme.button.buttonActive}` }}
      />
      <Label htmlFor={name} id={`placeholder-${label}`}>
        <Text className="text">{label}</Text>
      </Label>
    </InputContainer>
  );
};

export default TextInput;
