// src/components/CancelModal.tsx
import React from 'react';
import styled from 'styled-components';

interface CancelModalProps {
  handleConfirmCancel: () => void;
  handleClose: () => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ handleConfirmCancel, handleClose }) => (
  <Modal>
    <ModalContent>
      <p>Время бесплатной отмены прошло. При отмене будет возвращено только 95% от общей суммы заказа.</p>
      <ModalButton onClick={handleConfirmCancel}>Подтвердить</ModalButton>
      <ModalButton onClick={handleClose}>Отмена</ModalButton>
    </ModalContent>
  </Modal>
);

const Modal = styled.div`
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

const ModalContent = styled.div`
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
