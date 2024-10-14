import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Cart } from '../prouctCart/ProductCartStyles';
import { theme } from '../../styles/Theme';
import ModalCard from './ModalCard';

interface CardPromoProps {
  title?: string;
  description?: string; // Optional prop
}

const CardPromo: React.FC<CardPromoProps> = ({ title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const transition = {
    duration: 0.4,
    ease: [0.43, 0.13, 0.23, 0.96],
  };

  return (
    <LayoutGroup>
      <>
        <PromoCard
          onClick={handleCardClick}
          layoutId="promo-card"
          initial={{ borderRadius: 10 }}
          whileHover={{ scale: 1.0 }}
          whileTap={{ scale: 0.97 }}
          transition={transition}
        >
          <FlexWrapper direction="column">
            <h5>{title || 'CardPromo'}</h5>
            <p>
              {description ||
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Est praesentium obcaecati qui facere, dignissimos minus.'}
            </p>
          </FlexWrapper>
        </PromoCard>

        <ModalCard isOpen={isOpen} onClose={handleClose} layoutId="promo-card">
          <FlexWrapper direction="column">
            <h5>{title || 'CardPromo'}</h5>
            <p>
              {description ||
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Est praesentium obcaecati qui facere, dignissimos minus.'}
            </p>
            <CloseButton onClick={handleClose}>&times;</CloseButton>
          </FlexWrapper>
        </ModalCard>
      </>
    </LayoutGroup>
  );
};


// Styled components

const PromoCard = styled(motion(Cart))`
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const AnimatedCard = styled(motion.div)`
  /* background-color: #ff6f61;  */
  background-color: ${theme.colors.primaryBg};
  padding: 20px;
  border-radius: 20px;
  position: relative;
  z-index: 1001;
  width: 90%;
  max-width: 600px;
  height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #fff;
`;

// FlexWrapper component
const FlexWrapper = styled.div<{ direction?: string }>`
  display: flex;
  flex-direction: ${(props) => props.direction || 'row'};
`;

export default CardPromo;
