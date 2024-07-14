import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/Theme';
import Basket from '../../layout/cart/basket';
import AuthorizationComponent from '../../layout/autoeization/autoComponent';
import { MenuWrapper } from '../Products';

interface MobilemenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Mobilemenu({ isOpen, setIsOpen }: MobilemenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
    setIsOpen(!isExpanded);
  }, [isExpanded, setIsOpen]);

  const handleExpand = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
      setIsOpen(true);
    }
  }, [isExpanded, setIsOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  return (
    <>
      {isOpen && <Overlay />}
      <MobilemenuWrapper
        as={motion.div}
        initial={{ height: '100px', borderRadius: '0px' }}
        animate={{ 
          height: isExpanded ? '90vh' : '100px',
          borderRadius: isExpanded ? '20px' : '0px'
        }}
        transition={{ type: 'spring', stiffness: 30 }}
        onClick={handleExpand}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(event, info) => {
          if (info.offset.y > 100) {
            setIsExpanded(false);
            setIsOpen(false);
          }
        }}
      >
        {isExpanded && <CloseButton onClick={handleToggle}>×</CloseButton>}
        <MenuWrapper>
        <Basket currentLanguage={currentLanguage} />
        <AuthorizationComponent />
      </MenuWrapper>
      </MobilemenuWrapper>
    </>
  );
}

const MobilemenuWrapper = styled(motion.div)`
  width: 100%;
  background-color: ${theme.colors.mainBg};
  display: none;
  position: fixed;
  bottom: 0;
  cursor: pointer;
  z-index: 1000;

  @media (max-width: 656px) {
    display: block;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white;

  &:hover {
    color: lightgray;
  }
`;
