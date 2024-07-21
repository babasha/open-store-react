// src/components/textinputs/TextInput.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled(motion.input)`
  height: 30px;
  width: 90%;
  border: 2px solid black;
  border-radius: 10px;
  font-size: 14px;
  padding: 0 12px;

  &:focus {
    outline: none;
    border-color: blueviolet;
  }

  &:focus + label .text,
  &:not([value='']) + label .text {
    background-color: white;
    font-size: 12px;
    color: black;
    transform: translate(0, -100%);
  }

  &:focus + label .text {
    border-color: blueviolet;
    color: blueviolet;
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
  border: 3px solid transparent;
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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({ label, name, type = 'text', value, onChange }) => {
  return (
    <InputContainer>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete="off"
        aria-labelledby={`placeholder-${label}`}
        initial={{ borderColor: 'black' }}
        whileFocus={{ borderColor: 'blueviolet' }}
      />
      <Label htmlFor={name} id={`placeholder-${label}`}>
        <Text className="text">{label}</Text>
      </Label>
    </InputContainer>
  );
};

export default TextInput;
