// src/components/button/button.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import ButtonWithRipple from '../../styles/btns/ButtonStyles';
import Price from '../productPrice/price'; // Импортируем компонент Price

interface ToggleButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  isActive: boolean;
  isDisabled: boolean;
  price?: number; // Необязательный проп для цены
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ onClick, isActive, isDisabled, price }) => {
  const { t } = useTranslation();

  return (
    <ButtonWithRipple
      onClick={onClick}
      isActive={isActive}
      isDisabled={isDisabled}
      hasPrice={!!price} // Передаём наличие цены для стилизации
    >
      {price !== undefined && <Price amount={price} insideButton={true} isActive={isActive} />}
      {isActive ? t('added') : t('add_to_cart')}
    </ButtonWithRipple>
  );
};

export default ToggleButton;
