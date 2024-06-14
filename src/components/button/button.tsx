import React, { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../styles/btns/ButtonStyles';
import RippleEffect from '../../styles/btns/RippleEffect' ;

interface ToggleButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isActive: boolean;
  isDisabled: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ onClick, isActive, isDisabled }) => {
  const { t } = useTranslation();

  return (
    <RippleEffect onClick={onClick} disabled={isDisabled}>
      <Button isActive={isActive} isDisabled={isDisabled} disabled={isDisabled}>
        {isActive ? t('added') : t('add_to_cart')}
      </Button>
    </RippleEffect>
  );
};

export default ToggleButton;
