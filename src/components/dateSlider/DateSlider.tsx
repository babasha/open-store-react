import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import clamp from 'lodash/clamp';
import styled from 'styled-components';

const TimeSelector: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [width, setWidth] = useState<number>(350);

  // Генерация временных меток с шагом в 30 минут
  const generateTimeOptions = (): string[] => {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const slides = [
    <Slide key="default">
      {selectedTime ? selectedTime : 'Выбрать время'}
    </Slide>,
    <Slide key="picker">
      <TimePicker>
        {generateTimeOptions().map((time) => (
          <TimeOption key={time} onClick={() => handleTimeChange(time)}>
            {time}
          </TimeOption>
        ))}
      </TimePicker>
    </Slide>
  ];

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    setCurrentSlide(0); // Возвращаемся к первому слайду после выбора времени
  };

  return (
    <Container ref={containerRef}>
      <ArrowButton onClick={handlePrev}>{'<'}</ArrowButton>
      <SliderWrapper>
        <motion.div
          className="slider"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(event, info) => {
            const offset = info.offset.x;
            if (Math.abs(offset) > width / 2) {
              offset > 0 ? handlePrev() : handleNext();
            }
          }}
          style={{ x }}
          animate={{ x: -currentSlide * width }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {slides}
        </motion.div>
      </SliderWrapper>
      <ArrowButton onClick={handleNext}>{'>'}</ArrowButton>
    </Container>
  );
};

// Стили
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
`;

const ArrowButton = styled.button`
  background-color: #1e90ff;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 50%;
  margin: 0 5px;

  &:hover {
    background-color: #007bff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SliderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

const Slide = styled.div`
  min-width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TimePicker = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
`;

const TimeOption = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
  &:active {
    background-color: #007bff;
    color: white;
  }
`;

export default TimeSelector;
