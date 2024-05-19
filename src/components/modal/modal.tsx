import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Backdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      isOpen={isOpen}
    >
      <ModalContent
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 1 : 0 }}
        exit={{ scale: 0 }}
        onClick={(e) => e.stopPropagation()} // Остановить всплытие клика, чтобы не закрывать модальное окно при клике внутри него
      >
        {children}
      </ModalContent>
    </Backdrop>
  );
};

const Backdrop = styled(motion.div)<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  position: fixed; // Убедитесь, что модальное окно фиксировано
  top: 120%;
  left: 50%;
  transform: translate(-50%, -50%); // Центрируем модальное окно
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export default Modal;
