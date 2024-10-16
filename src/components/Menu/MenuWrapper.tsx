import React, { useCallback, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, PanInfo } from 'framer-motion';
import { theme } from '../../styles/Theme';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

function useWindowWidth() {
  const isClient = typeof window === 'object';

  const [windowWidth, setWindowWidth] = useState(
    isClient ? window.innerWidth : 0
  );

  useEffect(() => {
    if (!isClient) {
      return;
    }

    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);

  return windowWidth;
}

interface StyledMenuWrapperProps {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  cartItemCount: number;
}

const StyledMenuWrapper: React.FC<StyledMenuWrapperProps> = ({
  isExpanded,
  setIsExpanded,
  isOpen,
  setIsOpen,
  children,
  cartItemCount,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPartiallyOpen, setIsPartiallyOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 652;
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    setIsOpen(newState);
  }, [isExpanded, setIsExpanded, setIsOpen]);

  const handleExpand = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
      setIsOpen(true);
      setIsPartiallyOpen(false);
    }
  }, [isExpanded, setIsExpanded, setIsOpen]);

  useEffect(() => {
    if (isOpen && isMobile && menuRef.current) {
      disableBodyScroll(menuRef.current);
    } else if (menuRef.current) {
      enableBodyScroll(menuRef.current);
    }
  }, [isOpen, isMobile]);

  useEffect(() => {
    return () => {
      if (menuRef.current) {
        enableBodyScroll(menuRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isMobile && cartItemCount > 0) {
      setIsPartiallyOpen(true);
      const timer = setTimeout(() => {
        setIsPartiallyOpen(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [cartItemCount, isMobile]);

  const handleDragStart = useCallback(() => {
    setIsAnimating(true);
  }, []);

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      requestAnimationFrame(() => {
        setIsAnimating(false);
        if (info.offset.y > 100) {
          setIsExpanded(false);
          setIsOpen(false);
          setIsPartiallyOpen(false);
        }
      });
    },
    [setIsExpanded, setIsOpen]
  );

  const shouldRenderOverlay = isOpen && isMobile;

  return (
    <>
      {shouldRenderOverlay && <Overlay />}
      <Wrapper
        ref={menuRef}
        isExpanded={isExpanded}
        isPartiallyOpen={isPartiallyOpen}
        isAnimating={isAnimating}
        onClick={handleExpand}
        drag={isExpanded && isMobile ? 'y' : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <WrapperMenu>
          {isMobile && <DragHandle isAnimating={isAnimating} />}
          {isExpanded && isMobile && (
            <CloseButton onClick={handleToggle}>×</CloseButton>
          )}
        </WrapperMenu>
        <ContentWrapper isExpanded={isExpanded}>{children}</ContentWrapper>
      </Wrapper>
    </>
  );
};

export default StyledMenuWrapper;

const Wrapper = styled(motion.div)<{
  isExpanded: boolean;
  isPartiallyOpen: boolean;
  isAnimating: boolean;
}>`
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
    background-color: ${({ isExpanded }) =>
      isExpanded ? theme.colors.primaryBg : 'transparent'};
    position: fixed;
    bottom: 0;
    padding-top: 40px;
    cursor: pointer;
    z-index: 1000;
    display: block;

    ${({ isExpanded }) =>
      isExpanded &&
      `
        height: 90vh;
        border-radius: 20px;
        overflow: hidden;
      `}
    height: ${({ isExpanded, isPartiallyOpen }) =>
      isExpanded
        ? '90vh'
        : isPartiallyOpen
        ? '120px'
        : '70px'};
    transition: height 0.3s ease, border-radius 0.3s ease,
      background-color 0.3s ease;
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

  @media (min-width: 653px) {
    display: none;
  }
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
    color: #595959;
  }
`;
