// src/components/CancelModal.tsx
import React from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import styled from 'styled-components';

interface CancelModalProps {
  handleConfirmCancel: () => void;
  handleClose: () => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ handleConfirmCancel, handleClose }) => {
  const controls = useAnimation();

  const handleDragEnd = (event: Event, info: PanInfo) => {
    if (info.offset.y > 100 || info.offset.y < -100) {
      handleClose();
    } else {
      controls.start({ y: 0 });
    }
  };

  return (
    <Overlay>
      <ModalContent
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 450, damping: 40 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <p>Время бесплатной отмены прошло. При отмене будет возвращено только 95% от общей суммы заказа.</p>
        <ModalButton onClick={handleConfirmCancel}>Подтвердить</ModalButton>
        <ModalButton onClick={handleClose}>Отмена</ModalButton>
      </ModalContent>
    </Overlay>
  );
};

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ModalButton = styled.button`
  margin: 10px;
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

export default CancelModal;