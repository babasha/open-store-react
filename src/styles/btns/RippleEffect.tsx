import React, { useState, MouseEvent } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface RippleEffectProps {
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

interface Ripple {
  key: number;
  style: React.CSSProperties;
}

const RippleEffect: React.FC<RippleEffectProps> = ({ disabled, onClick, children }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      createRipple(event);
      if (onClick) {
        onClick(event);
      }
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
    <RippleContainer onClick={handleClick} disabled={disabled}>
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
    </RippleContainer>
  );
};

const RippleContainer = styled(motion.button)<{ disabled?: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: inherit;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const Ripple = styled(motion.span)`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
`;

export default RippleEffect;
