import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/Theme';

interface ModalCardProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  layoutId?: string;
}

const ModalCard: React.FC<ModalCardProps> = ({
  isOpen,
  onClose,
  children,
  layoutId = 'modal-card',
}) => {
  // Блокировка прокрутки фона при открытом модальном окне
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isOpen) {
      // Блокировка прокрутки
      document.body.style.overflow = 'hidden';
    }
    return () => {
      // Восстановление оригинального стиля
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const transition = {
    duration: 0.4,
    ease: [0.43, 0.13, 0.23, 0.96],
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(event, info) => {
            if (info.offset.y > 100 || info.velocity.y > 500) {
              onClose();
            }
          }}
        >
          <AnimatedCard
            layoutId={layoutId}
            initial={{ borderRadius: 10 }}
            animate={{ borderRadius: 20 }}
            transition={transition}
            onClick={(e) => e.stopPropagation()}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(event, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
          >
            {children}
          </AnimatedCard>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

// Стили

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const AnimatedCard = styled(motion.div)`
  background-color: ${theme.colors.mainBg};
  padding: 20px;
  border-radius: 20px;
  position: relative;
  z-index: 1001;
  width: 90%;
  max-width: 600px;
  height: auto; /* Автоматическая высота */
  max-height: 80vh; /* Максимальная высота 80% от высоты окна */
  overflow-y: auto; /* Прокрутка при переполнении */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
`;

export default ModalCard;
