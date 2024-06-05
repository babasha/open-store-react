// src/components/TextInput.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled(motion.input)`
  height: 5rem;
  width: 40rem;
  border: 2px solid black;
  border-radius: 1rem;
  font-size: 1.4rem;
  padding: 0 1.2rem;

  &:focus {
    outline: none;
    border-color: blueviolet;
  }

  &:focus + label .text,
  &:not([value='']) + label .text {
    background-color: white;
    font-size: 1.1rem;
    color: black;
    transform: translate(0, -170%);
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
  font-size: 1.4rem;
  padding: 0 0.5rem;
  background-color: transparent;
  color: black;
  transition: transform 0.15s ease-out, font-size 0.15s ease-out, background-color 0.2s ease-out, color 0.15s ease-out;
`;

const TextInput: React.FC<{ label: string }> = ({ label }) => {
  const [value, setValue] = useState('');

  return (
    <InputContainer>
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        aria-labelledby={`placeholder-${label}`}
        initial={{ borderColor: 'black' }}
        whileFocus={{ borderColor: 'blueviolet' }}
      />
      <Label htmlFor={label} id={`placeholder-${label}`}>
        <Text className="text">{label}</Text>
      </Label>
    </InputContainer>
  );
};

export default TextInput;
