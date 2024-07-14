import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/Theme';

interface StyledMenuWrapperProps {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const StyledMenuWrapper: React.FC<StyledMenuWrapperProps> = ({
  isExpanded,
  setIsExpanded,
  isOpen,
  setIsOpen,
  children
}) => {
  const handleToggle = useCallback(() => {
    setIsExpanded(!isExpanded);
    setIsOpen(!isExpanded);
  }, [isExpanded, setIsOpen, setIsExpanded]);

  const handleExpand = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
      setIsOpen(true);
    }
  }, [isExpanded, setIsOpen, setIsExpanded]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  return (
    <>
      {isOpen && window.innerWidth <= 652 && <Overlay />}
      <Wrapper
        isExpanded={isExpanded}
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
        {isExpanded && window.innerWidth <= 652 && <CloseButton onClick={handleToggle}>×</CloseButton>}
        <ContentWrapper isExpanded={isExpanded}>
          {children}
        </ContentWrapper>
      </Wrapper>
    </>
  );
};

export default StyledMenuWrapper;

const Wrapper = styled(motion.div)<{ isExpanded: boolean }>`
  display: flex;
  width: 300px;
  flex-direction: column;
  @media (max-width: 1024px) {
    width: 280px;
  }
  @media (max-width: 820px) {
    width: 250px;
  }

  @media (max-width: 652px) {
    width: 100vw; /* Ensure full viewport width */
    left: 0; /* Position from the left edge */
    right: 0; /* Position from the right edge */
    background-color: ${theme.colors.mainBg};
    position: fixed;
    bottom: 0;
    cursor: pointer;
    z-index: 1000;
    display: block;

    ${({ isExpanded }) => isExpanded && `
      height: 90vh;
      border-radius: 20px;
      overflow: hidden; /* Hide overflow when expanded */
    `}
    height: ${({ isExpanded }) => (isExpanded ? '90vh' : '50px')};
    transition: height 0.3s ease, border-radius 0.3s ease;
  }
`;

const ContentWrapper = styled.div<{ isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: ${({ isExpanded }) => (isExpanded ? 'auto' : 'hidden')}; /* Enable scrolling when expanded */
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
