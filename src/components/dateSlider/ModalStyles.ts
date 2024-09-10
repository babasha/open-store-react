import styled from 'styled-components';
import { motion } from 'framer-motion';

// Анимация для фона (Backdrop)
export const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

// Анимация для контента модального окна (ModalContent)
export const ModalContent = styled(motion.div)`
  background: white;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  min-width: 300px;
  z-index: 2000;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  z-index: 2000;
`;

export const ModalInnerContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2000;
`;