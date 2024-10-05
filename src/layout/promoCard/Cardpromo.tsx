import React, { useState, useEffect } from 'react';
import { FlexWrapper } from '../../components/FlexWrapper';
import styled from 'styled-components';
import { Cart } from '../prouctCart/ProductCartStyles';
import { theme } from '../../styles/Theme';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

interface Cardpromo {
  title?: string;
  description?: string; // необязательный пропс
}

const Cardpromo: React.FC<Cardpromo> = ({ title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // useEffect для блокировки прокрутки фона при открытой карточке
  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущее значение overflow
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Блокируем прокрутку
      document.body.style.overflow = 'hidden';
      // Возвращаем оригинальный стиль при размонтировании
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  return (
    <LayoutGroup>
      <>
        <PromoCard
          onClick={handleCardClick}
          layoutId="promo-card" // Присваиваем уникальный layoutId
          initial={{ borderRadius: 10 }}
        >
          <FlexWrapper direction='column'>
            <h5>{title || 'Cardpromo'}</h5>
            <p>
              {description ||
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Est praesentium obcaecati qui facere, dignissimos minus. Ad architecto expedita, accusantium laboriosam vel quibusdam amet nisi! Porro aperiam tenetur laudantium sit voluptatem?'}
            </p>
          </FlexWrapper>
        </PromoCard>

        <AnimatePresence>
          {isOpen && (
            <Overlay
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              aria-modal="true"
              role="dialog"
            >
              <AnimatedCard
                layoutId="promo-card" // Используем тот же layoutId для анимации
                initial={{ borderRadius: 10 }}
                transition={{ duration: 0.5 }}
                onClick={(e) => e.stopPropagation()} // Предотвращает закрытие при клике внутри карточки
                drag="y" // Разрешаем перетаскивание по оси Y
                dragConstraints={{ top: 0, bottom: 300 }} // Ограничиваем перетаскивание вниз до 300px
                dragElastic={0.2} // Эластичность при перетаскивании
                onDragEnd={(event, info) => {
                  // Если карточка была перетащена вниз более чем на 100px или с высокой скоростью, закрываем ее
                  if (info.offset.y > 100 || info.velocity.y > 500) {
                    handleClose();
                  }
                }}
              >
                <FlexWrapper direction='column'>
                  <h5>{title || 'Cardpromo'}</h5>
                  <p>
                    {description ||
                      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Est praesentium obcaecati qui facere, dignissimos minus. Ad architecto expedita, accusantium laboriosam vel quibusdam amet nisi! Porro aperiam tenetur laudantium sit voluptatem?'}
                  </p>
                  <CloseButton onClick={handleClose}>&times;</CloseButton>
                </FlexWrapper>
              </AnimatedCard>
            </Overlay>
          )}
        </AnimatePresence>
      </>
    </LayoutGroup>
  );
};

export default Cardpromo;

// Стилизация компонентов

const PromoCard = styled(motion(Cart))`
  background-color: ${theme.colors.accent};
  cursor: pointer;
  position: relative;
  z-index: 1; /* Обеспечивает, что карточка находится выше других элементов */
  width: 300px; /* Установите фиксированную ширину или адаптивную */
  margin: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

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
  z-index: 1000; /* Обеспечивает, что overlay выше всех остальных элементов */
`;

const AnimatedCard = styled(motion.div)`
  background-color: ${theme.colors.accent};
  padding: 20px;
  border-radius: 10px;
  position: relative;
  z-index: 1001;
  width: 90%;
  max-width: 600px;
  height: 80vh; /* Устанавливаем высоту 80% от высоты экрана */
  overflow-y: auto; /* Обеспечиваем прокрутку по вертикали внутри карточки */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #fff;
`;
