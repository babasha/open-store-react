import React, { useState, MouseEvent, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/Theme';

interface ToggleButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isActive: boolean;
  isDisabled: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ onClick, isActive, isDisabled }) => {
  const [ripples, setRipples] = useState<{ key: number, style: React.CSSProperties }[]>([]);
  const { t } = useTranslation();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled) {
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
    <Button
      onClick={handleClick}
      isActive={isActive}
      isDisabled={isDisabled}
      disabled={isDisabled}
    >
      {isActive ? t('added') : t('add_to_cart')}
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
    </Button>
  );
};

const Button = styled(motion.button)<{ isActive: boolean; isDisabled: boolean }>`
  border-radius: 30px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  background-color: ${props => (props.isActive ? theme.button.buttonActive : 'transparent')};
  color: ${props => (props.isActive ? 'white' : theme.button.buttonActive)};
  border: ${props => (props.isActive ? theme.button.buttonActive : '1px solid #0098EA')};
  font-size: 16px;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 35px;
  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'auto')};

  &:hover {
    background-color: ${props => (props.isActive ? theme.button.buttonActive : 'lightblue')};
  }

  &:disabled {
    background-color: gray;
  }
`;

const Ripple = styled(motion.span)`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
`;

export default ToggleButton;
