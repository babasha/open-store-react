import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/Theme';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1 },
};

const Modal: React.FC<ModalProps> = ({ isOpen, children, onMouseEnter, onMouseLeave }) => {
  return (
    <Backdrop
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      variants={modalVariants}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      transition={{ duration: 0.3 }}
    >
      <ModalContent>
        {children}
      </ModalContent>
    </Backdrop>
  );
};

const Backdrop = styled(motion.div)`
  top: 80%;
  z-index: 999;
  position: absolute;
`;

const ModalContent = styled.div`
  background: ${theme.colors.mainBg};
  position: relative;
  border-radius: 10px;
  width: 80px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 199;
`;

export default Modal;
