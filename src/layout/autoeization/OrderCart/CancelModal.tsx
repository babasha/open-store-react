import React from 'react';
import { useAnimation, PanInfo } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Overlay, ModalContent, ModalButton } from '../../../styles/ModalBaseStyles';

interface CancelModalProps {
  handleConfirmCancel: () => void;
  handleClose: () => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ handleConfirmCancel, handleClose }) => {
  const controls = useAnimation();
  const { t } = useTranslation();

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
        <p>{t('cancel_warning')}</p>
        <ModalButton onClick={handleConfirmCancel}>{t('confirm')}</ModalButton>
        <ModalButton onClick={handleClose}>{t('cancel')}</ModalButton>
      </ModalContent>
    </Overlay>
  );
};

export default CancelModal;
