import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexWrapper } from '../FlexWrapper';
import Modal from './modal';
import StyledButton from './StyledButton';
import { TextContainer, ActiveText, ClickableText } from './DataSwitchStyles';
import { ModalInnerContent } from './ModalStyles';

interface DataSwitchProps {
  buttonText1: string;
  buttonText2: string;
  isActive1: boolean;
  isActive2: boolean;
  onSelectedDelivery: (delivery: { day: string; time: string }) => void;
}

const DataSwitch: React.FC<DataSwitchProps> = ({ buttonText1, buttonText2, isActive1, isActive2, onSelectedDelivery }) => {
  const [active, setActive] = useState(1);
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<{ day: string; time: string } | null>(null);

  const handleChange = (option: number) => {
    setActive(option);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleDeliverySelect = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const day = formData.get('day') as string;
    const time = formData.get('time') as string;

    onSelectedDelivery({ day, time }); // Update state with selected delivery time
    setSelectedDelivery({ day, time });
    setIsModalOpen(false);
  };

  return (
    <FlexWrapper direction='column'>
      <FlexWrapper>
        <StyledButton isActive={active === 1} onClick={() => handleChange(1)}>
          {buttonText1}
        </StyledButton>
        <StyledButton isActive={active === 2} onClick={() => handleChange(2)}>
          {buttonText2}
        </StyledButton>
      </FlexWrapper>
      <TextContainer>
        {active === 1 ? (
          <ActiveText>{t('as_soon_as_possible')}</ActiveText>
        ) : (
          selectedDelivery ? (
            <ActiveText>{t('delivery_time_selected')}: {selectedDelivery.day}, {selectedDelivery.time}</ActiveText>
          ) : (
            <ClickableText onClick={toggleModal}>{t('choose_delivery_time')}</ClickableText>
          )
        )}
      </TextContainer>
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <ModalInnerContent>
            <h2>{t('choose_delivery_time')}</h2>
            <form onSubmit={handleDeliverySelect}>
              <label>
                {t('delivery_day')}:
                <select name="day">
                  <option value="today">{t('today')}</option>
                  <option value="tomorrow">{t('tomorrow')}</option>
                </select>
              </label>
              <label>
                {t('delivery_time')}:
                <select name="time">
                  {Array.from({ length: 48 }).map((_, index) => {
                    const hours = String(Math.floor(index / 2)).padStart(2, '0');
                    const minutes = index % 2 === 0 ? '00' : '30';
                    return <option key={index} value={`${hours}:${minutes}`}>{`${hours}:${minutes}`}</option>;
                  })}
                </select>
              </label>
              <button type="submit">{t('confirm')}</button>
            </form>
          </ModalInnerContent>
        </Modal>
      )}
    </FlexWrapper>
  );
};

export default DataSwitch;
