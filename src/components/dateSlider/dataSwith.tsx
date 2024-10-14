import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexWrapper } from '../FlexWrapper';
import ModalCard from '../../layout/promoCard/ModalCard'; // Убедитесь, что путь правильный
import StyledButton from './StyledButton';
import {
  TextContainer,
  ActiveText,
  ClickableText,
  BtnWrapper,
  Select,
  Label,
  SubmitButton,
} from './DataSwitchStyles';
import { toZonedTime } from 'date-fns-tz';
import { motion, LayoutGroup } from 'framer-motion';
import { ModalInnerContent } from './ModalStyles';

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

  // Обновляем текущее время каждые 60 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBatumiTime(toZonedTime(new Date(), 'Asia/Tbilisi'));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Обновляем выбранную опцию доставки, если выбрана опция 1
  useEffect(() => {
    if (activeOption === 1) {
      setSelectedDelivery(null);
      onSelectedDelivery({ day: 'asap', time: 'asap' });
    }
  }, [activeOption, onSelectedDelivery]);

  const handleOptionChange = (option: number) => {
    setActiveOption(option);
    // Уберите автоматическое открытие модального окна при выборе опции 2
    // Если нужно, можно добавить дополнительные действия здесь
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
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

  const generateTimeOptions = useMemo(() => {
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

        if (deliveryDay === 'today' && timeNumber < minSelectableTime) {
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
  }, [currentBatumiTime, deliveryDay]);

  const layoutId = 'delivery-modal';

  return (
    <LayoutGroup>
      <FlexWrapper direction="column">
        <FlexWrapper justify="space-between">
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
            <BtnWrapper
              as={motion.div}
              layoutId={layoutId}
              isActive={true}
            >
              <ActiveText>{t('as_soon_as_possible')}</ActiveText>
            </BtnWrapper>
          ) : selectedDelivery ? (
            <BtnWrapper
              as={motion.div}
              layoutId={layoutId}
              isActive={true}
            >
              <ActiveText>
                {t('delivery_time_selected')}: {selectedDelivery.day},{' '}
                {selectedDelivery.time}
              </ActiveText>
            </BtnWrapper>
          ) : (
            <BtnWrapper
              as={motion.div}
              layoutId={layoutId}
              isActive={false}
              onClick={toggleModal}
            >
              <ClickableText>{t('choose_delivery_time')}</ClickableText>
            </BtnWrapper>
          )}
        </TextContainer>
        <ModalCard
          isOpen={isModalOpen}
          onClose={toggleModal}
          layoutId={layoutId}
        >
          <ModalInnerContent>
            <h2>{t('choose_delivery_time')}</h2>
            <form onSubmit={handleDeliverySelect}>
              <Label>
                {t('delivery_day')}:
                <Select
                  name="day"
                  value={deliveryDay}
                  onChange={handleDayChange}
                >
                  <option value="today">{t('today')}</option>
                  <option value="tomorrow">{t('tomorrow')}</option>
                </Select>
              </Label>
              <Label>
                {t('delivery_time')}:
                <Select name="time" id="time-select">
                  {generateTimeOptions}
                </Select>
              </Label>
              <SubmitButton type="submit">{t('confirm')}</SubmitButton>
            </form>
          </ModalInnerContent>
        </ModalCard>
      </FlexWrapper>
    </LayoutGroup>
  );
};

export default DataSwitch;
