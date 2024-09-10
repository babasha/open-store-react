import React from 'react';
import { createPortal } from 'react-dom';
import { Backdrop, ModalContent, CloseButton, ModalInnerContent } from '../../components/dateSlider/ModalStyles';
import { motion } from 'framer-motion'; // Импортируем framer-motion для анимации

interface AboutModalProps {
  onClose: () => void;
  children: React.ReactNode;
  isOpen: boolean; // Добавим флаг для управления открытием/закрытием модального окна
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose, children, isOpen }) => {
  return createPortal(
    <>
      {isOpen && (
        <Backdrop
          as={motion.div} // Добавляем анимацию для backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <ModalContent
            as={motion.div} // Добавляем анимацию для самого модального окна
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>×</CloseButton>
            <ModalInnerContent>
              {children}
            </ModalInnerContent>
          </ModalContent>
        </Backdrop>
      )}
    </>,
    document.body
  );
};

export default AboutModal;
