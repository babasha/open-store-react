import React from 'react';
import { createPortal } from 'react-dom';
// import { CloseButton } from ;
import { Backdrop, ModalContent, CloseButton, ModalInnerContent } from './ModalStyles';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return createPortal(
    <Backdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        {children}
      </ModalContent>
    </Backdrop>,
    document.body
  );
};

export default Modal;
