import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexWrapper } from '../FlexWrapper';
import Modal from './modal';
import StyledButton from './StyledButton';
import { TextContainer, ActiveText, ClickableText } from './DataSwitchStyles';
import { ModalInnerContent } from './ModalStyles';
import { toZonedTime } from 'date-fns-tz';

interface Delivery {
  day: string;
  time: string;
}

interface DataSwitchProps {
  buttonText1: string;
  buttonText2: string;
  onSelectedDelivery: (delivery: Delivery) => void;
}

const DataSwitch: React.FC<DataSwitchProps> = ({
  buttonText1,
  buttonText2,
  onSelectedDelivery,
}) => {
  const { t } = useTranslation();
  const [activeOption, setActiveOption] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [currentBatumiTime, setCurrentBatumiTime] = useState<Date>(
    toZonedTime(new Date(), 'Asia/Tbilisi')
  );
  const [deliveryDay, setDeliveryDay] = useState<string>('today');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBatumiTime(toZonedTime(new Date(), 'Asia/Tbilisi'));
    }, 60000); // Обновляем время каждую минуту

    return () => clearInterval(interval);
  }, []);

  const handleOptionChange = (option: number) => {
    setActiveOption(option);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleDeliverySelect = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const day = formData.get('day') as string;
    const time = formData.get('time') as string;

    const delivery = { day, time };
    setSelectedDelivery(delivery);
    onSelectedDelivery(delivery);
    setIsModalOpen(false);
  };

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDeliveryDay(event.target.value);
  };

  const generateTimeOptions = (day: string) => {
    const startTime = 10;
    const endTime = 23;
    const currentHour = currentBatumiTime.getHours();
    const currentMinutes = currentBatumiTime.getMinutes();
    const minSelectableTime = currentHour + (currentMinutes >= 30 ? 1.5 : 1);

    const options = [];

    for (let hour = startTime; hour <= endTime; hour++) {
      for (let minutes of ['00', '30']) {
        const timeValue = `${hour}:${minutes}`;
        const timeNumber = hour + (minutes === '30' ? 0.5 : 0);

        if (day === 'today' && timeNumber < minSelectableTime) {
          continue;
        }

        options.push(
          <option key={timeValue} value={timeValue}>
            {timeValue}
          </option>
        );
      }
    }

    return options;
  };

  return (
    <FlexWrapper direction="column">
      <FlexWrapper>
        <StyledButton
          isActive={activeOption === 1}
          onClick={() => handleOptionChange(1)}
        >
          {buttonText1}
        </StyledButton>
        <StyledButton
          isActive={activeOption === 2}
          onClick={() => handleOptionChange(2)}
        >
          {buttonText2}
        </StyledButton>
      </FlexWrapper>
      <TextContainer>
        {activeOption === 1 ? (
          <ActiveText>{t('as_soon_as_possible')}</ActiveText>
        ) : selectedDelivery ? (
          <ActiveText>
            {t('delivery_time_selected')}: {selectedDelivery.day},{' '}
            {selectedDelivery.time}
          </ActiveText>
        ) : (
          <ClickableText onClick={toggleModal}>
            {t('choose_delivery_time')}
          </ClickableText>
        )}
      </TextContainer>
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <ModalInnerContent>
            <h2>{t('choose_delivery_time')}</h2>
            <form onSubmit={handleDeliverySelect}>
              <label>
                {t('delivery_day')}:
                <select
                  name="day"
                  value={deliveryDay}
                  onChange={handleDayChange}
                >
                  <option value="today">{t('today')}</option>
                  <option value="tomorrow">{t('tomorrow')}</option>
                </select>
              </label>
              <label>
                {t('delivery_time')}:
                <select name="time" id="time-select">
                  {generateTimeOptions(deliveryDay)}
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
