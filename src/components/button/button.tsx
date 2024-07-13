import React, { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonWithRipple from '../../styles/btns/ButtonStyles';

interface ToggleButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isActive: boolean;
  isDisabled: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ onClick, isActive, isDisabled }) => {
  const { t } = useTranslation();

  return (
    <ButtonWithRipple onClick={onClick} isActive={isActive} isDisabled={isDisabled} disabled={isDisabled}>
      {isActive ? t('added') : t('add_to_cart')}
    </ButtonWithRipple>
  );
};

export default ToggleButton;