// src/styles/btns/ButtonStyles.ts
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../Theme';

interface ButtonProps {
  isActive: boolean;
  isDisabled: boolean;
}

export const Button = styled(motion.button)<ButtonProps>`
  border-radius: 30px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  background-color: ${({ isActive }) => (isActive ? theme.button.buttonActive : 'transparent')};
  color: ${({ isActive }) => (isActive ? 'white' : theme.button.buttonActive)};
  border: ${({ isActive }) => (isActive ? `1px solid ${theme.button.buttonActive}` : '1px solid #0098EA')};
  font-size: 16px;
  position: relative;
  overflow: hidden;
  padding:5px 15px;
  transition: 0.2s;
  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'auto')};

  &:hover {
    background-color: ${({ isActive }) => (isActive ? theme.button.buttonActive : 'lightblue')};
  }

  &:disabled {
    background-color: ${theme.button.buttonActive};
  }
  @media (max-width: 1024px), 
         (max-width: 820px), 
         (max-width: 540px), 
         (max-width: 430px), 
         (max-width: 390px), 
         (max-width: 375px), 
         (max-width: 360px), 
         (max-width: 344px) {
    font-size: 14px;
    padding:3px 10px;
  }
`;

export const Ripple = styled(motion.span)`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
`;
