// src/components/Register/Modal.tsx
import React from 'react';
import styled from 'styled-components';
import MapPicker from '../../components/MapPicker';

interface ModalProps {
  onClose: () => void;
  onAddressSelect: (address: string) => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  background-color: white;
  z-index: 1000;
  border: 1px solid #ccc;
  overflow: auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  padding: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const Modal: React.FC<ModalProps> = ({ onClose, onAddressSelect }) => {
  return (
    <>
      <ModalOverlay onClick={onClose} />
      <ModalContainer>
        <CloseButton onClick={onClose}>✕</CloseButton>
        <MapPicker onAddressSelect={onAddressSelect} />
      </ModalContainer>
    </>
  );
};

export default Modal;
