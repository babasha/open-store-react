import React, { useCallback, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, PanInfo } from 'framer-motion';
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
  const [isAnimating, setIsAnimating] = useState(false);

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

  const handleDragStart = useCallback(() => {
    setIsAnimating(true);
  }, []);

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    requestAnimationFrame(() => {
      setIsAnimating(false);
      if (info.offset.y > 100) {
        setIsExpanded(false);
        setIsOpen(false);
      }
    });
  }, [setIsExpanded, setIsOpen]);

  const dragConstraints = useMemo(() => ({ top: 0, bottom: 0 }), []);

  return (
    <>
      {isOpen && window.innerWidth <= 652 && <Overlay />}
      <Wrapper
  
        isExpanded={isExpanded}
        isAnimating={isAnimating}
        onClick={handleExpand}
        drag="y"
        dragConstraints={dragConstraints}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <WrapperMenu>
          <DragHandle isAnimating={isAnimating} />
          {isExpanded && window.innerWidth <= 652 && <CloseButton onClick={handleToggle}>×</CloseButton>}
        </WrapperMenu>
        <ContentWrapper isExpanded={isExpanded}>
          {children}
        </ContentWrapper>
      </Wrapper>
    </>
  );
};

export default StyledMenuWrapper;

const Wrapper = styled(motion.div)<{ isExpanded: boolean, isAnimating: boolean }>`
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
    width: 100vw; 
    left: 0; 
    right: 0; 
    background-color: ${theme.colors.primaryBg};
    position: fixed;
    bottom: 0;
    padding-top: 40px;
    cursor: pointer;
    z-index: 1000;
    display: block;

    ${({ isExpanded }) => isExpanded && `
      height: 90vh;
      border-radius: 20px;
      overflow: hidden;
    `}
    height: ${({ isExpanded }) => (isExpanded ? '90vh' : '70px')};
    transition: height 0.3s ease, border-radius 0.3s ease;
  }
`;

const WrapperMenu = styled.div`
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
  position: relative;
`;

const DragHandle = styled.div<{ isAnimating: boolean }>`
  width: ${({ isAnimating }) => (isAnimating ? '70px' : '50px')};
  height: 5px;
  border-radius: 20px;
  background-color: ${theme.colors.font};
  cursor: grab;
  transition: width 0.3s ease;
`;

const ContentWrapper = styled.div<{ isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: ${({ isExpanded }) => (isExpanded ? 'auto' : 'hidden')};
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
  bottom: 20px;
  right: 18px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: black;

  &:hover {
    color: #595959 ;
  }
`;
