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
      <ModalContent
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      variants={modalVariants}
      transition={{ duration: 0.3 }}
      >
        {children}
      </ModalContent>
    </Backdrop>
  );
};

const Backdrop = styled(motion.div)`
  top: 80%;
  z-index: 1000;
  position: absolute;

`;

const ModalContent = styled(motion.div)`
  background:  ${theme.colors.mainBg};
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export default Modal;
