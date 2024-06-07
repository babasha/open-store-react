import React, { useState } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/Theme';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return createPortal(
    <Backdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        {children}
      </ModalContent>
    </Backdrop>,
    document.body
  );
};

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  min-width: 300px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const ModalInnerContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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
    <SwitchContainer>
      <StyledButton
        isActive={active === 1}
        onClick={() => handleChange(1)}
      >
        {buttonText1}
      </StyledButton>
      <StyledButton
        isActive={active === 2}
        onClick={() => handleChange(2)}
      >
        {buttonText2}
      </StyledButton>
      <TextContainer>
        {active === 1 ? (
          <ActiveText>{t('Как можно скорее')}</ActiveText>
        ) : (
          selectedDelivery ? (
            <ActiveText>{t(`Выбрано время для доставки: ${selectedDelivery.day}, ${selectedDelivery.time}`)}</ActiveText>
          ) : (
            <ClickableText onClick={toggleModal}>{t('Выбрать время доставки')}</ClickableText>
          )
        )}
      </TextContainer>
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <ModalInnerContent>
            <h2>{t('Выберите время доставки')}</h2>
            <form onSubmit={handleDeliverySelect}>
              <label>
                {t('День доставки')}:
                <select name="day">
                  <option value="Сегодня">{t('Сегодня')}</option>
                  <option value="Завтра">{t('Завтра')}</option>
                </select>
              </label>
              <label>
                {t('Время доставки')}:
                <select name="time">
                  {Array.from({ length: 48 }).map((_, index) => {
                    const hours = String(Math.floor(index / 2)).padStart(2, '0');
                    const minutes = index % 2 === 0 ? '00' : '30';
                    return <option key={index} value={`${hours}:${minutes}`}>{`${hours}:${minutes}`}</option>;
                  })}
                </select>
              </label>
              <button type="submit">{t('Подтвердить')}</button>
            </form>
          </ModalInnerContent>
        </Modal>
      )}
    </SwitchContainer>
  );
};

const SwitchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledButton = styled.button<{ isActive: boolean }>`
  border-radius: 30px;
  cursor: pointer;
  background-color: ${props => (props.isActive ? theme.button.buttonActive : 'transparent')};
  color: ${props => (props.isActive ? 'white' : theme.button.buttonActive)};
  border: ${props => (props.isActive ? theme.button.buttonActive : '1px solid #0098EA')};
  font-size: 16px;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 35px;
  transition: 0.2s;
  margin: 0 5px;
  pointer-events: auto;

  &:hover {
    background-color: ${props => (props.isActive ? theme.button.buttonActive : 'lightblue')};
  }

  &:disabled {
    background-color: gray;
  }
`;

const TextContainer = styled.div`
  margin-top: 10px;
`;

const ActiveText = styled.p`
  color: ${theme.button.buttonActive};
`;

const ClickableText = styled.p`
  color: blue;
  cursor: pointer;
  text-decoration: underline;
`;

export default DataSwitch;
