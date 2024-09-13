// src/styles/btns/ButtonStyles.tsx
import styled from 'styled-components';
import { motion, MotionProps } from 'framer-motion';
import { theme } from '../Theme';
import React, { useState, MouseEvent } from 'react';

interface ButtonProps extends MotionProps {
  isActive: boolean;
  isDisabled: boolean;
}

interface Ripple {
  key: number;
  style: React.CSSProperties;
}

const StyledButton = styled(motion.button)<ButtonProps>`
  border-radius: 30px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  background-color: ${({ isActive }) => (isActive ? theme.button.buttonActive : 'transparent')};
  color: ${({ isActive }) => (isActive ? 'white' : theme.button.buttonActive)};
  border: ${({ isActive }) => (isActive ? `1px solid ${theme.button.buttonActive}` : '1px solid #0098EA')};
  font-size: 16px;
  position: relative;
  /* overflow: hidden; */
  padding: 5px 15px;
  transition: 0.2s;
  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'auto')};

  &:hover {
    background-color: ${({ isActive }) => (isActive ? theme.button.buttonActive : 'lightblue')};
  }

  &:disabled {
    background-color: ${theme.button.buttonActive};
  }

  @media (max-width: 1024px) {
    font-size: 14px;
    padding: 8px 15px;
  }
  @media (max-width: 820px) {
    font-size: 14px;
    padding: 5px 12px;
  }
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 5px 12px;
  }
  @media (max-width: 540px) {
    font-size: 14px;
    padding: 5px 12px;
  }
  @media (max-width: 430px) {
    font-size: 14px;
    padding: 3px 10px;
  }
  @media (max-width: 414px) {
    font-size: 14px;
    padding: 3px 10px;
  }
  @media (max-width: 390px) {
    font-size: 14px;
    padding: 3px 10px;
  }
  @media (max-width: 375px) {
    font-size: 12px;
    padding: 3px 10px;
  }
  @media (max-width: 360px) {
    font-size: 12px;
    padding: 3px 10px;
  }
  @media (max-width: 344px) {
    font-size: 12px;
    padding: 3px 10px;
  }
`;

const Ripple = styled(motion.span)`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
`;

export const ButtonWithRipple: React.FC<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ isActive, isDisabled, children, onClick, ...props }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && onClick) {
      createRipple(event);
      onClick(event);
    }
  };

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const offsetX = event.clientX - button.getBoundingClientRect().left - radius;
    const offsetY = event.clientY - button.getBoundingClientRect().top - radius;
    const newRipple = { key: Date.now(), style: { width: diameter, height: diameter, left: offsetX, top: offsetY } };

    setRipples(prevRipples => [...prevRipples, newRipple]);
  };

  return (
    <StyledButton isActive={isActive} isDisabled={isDisabled} onClick={handleClick} {...props}>
      {children}
      {ripples.map(({ key, style }) => (
        <Ripple
          key={key}
          style={style}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.9 }}
          onAnimationComplete={() => setRipples(prevRipples => prevRipples.filter(r => r.key !== key))}
        />
      ))}
    </StyledButton>
  );
};

export default ButtonWithRipple;
