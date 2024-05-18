import React, { useState, MouseEvent } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/Theme';

const ToggleButton: React.FC = () => {
  const [isAdded, setIsAdded] = useState(false);
  const { t } = useTranslation();
  const [ripples, setRipples] = useState<{ key: number, style: React.CSSProperties }[]>([]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setIsAdded(!isAdded);
    createRipple(event);
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
      isAdded={isAdded}
      // whileTap={{ scale: 0.9 }}
      // initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // transition={{ duration: 19.5 }}
    >
      {isAdded ? t('added') : t('add_to_cart')}
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

const Button = styled(motion.button)<{ isAdded: boolean }>`
  padding: 10px 20px;
  /* border: none; */
  border-radius: 30px;
  cursor: pointer;
  /* color: white; */
  background-color: ${props => (props.isAdded ? theme.button.buttonActive : 'transparent')};
  color: ${props => (props.isAdded ? 'white' : theme.button.buttonActive)};
  border: ${props => (props.isAdded ? theme.button.buttonActive : '1px solid #0098EA')};
  font-size: 16px;
  position: relative;
  overflow: hidden;
width: 123px;
height: 40px;
  &:hover {
    background-color: ${props => (props.isAdded ? theme.button.buttonActive : 'lightblue')};
  }
`;

const Ripple = styled(motion.span)`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  /* transform: scale(0); */
  pointer-events: none;
`;

export default ToggleButton;
