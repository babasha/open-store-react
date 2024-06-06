import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SliderContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  user-select: none;
`;

const Slider = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: row;
  cursor: grab;
`;

const SlideButton = styled.button<{ clickable: boolean }>`
  min-width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f0f0f0;
  text-align: center;
  font-size: 24px;
  color: #333;
  border: none;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  pointer-events: ${({ clickable }) => (clickable ? 'auto' : 'none')};
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 24px;
  border: none;
  cursor: pointer;
  z-index: 1;
  user-select: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const PrevButton = styled(NavigationButton)`
  left: 10px;
`;

const NextButton = styled(NavigationButton)`
  right: 10px;
`;

const TimeDropdownContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f0f0f0;
`;

const TimeDropdown = styled.select`
  font-size: 24px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(time);
    }
  }
  return times;
};

const TimeSlider: React.FC = () => {
  const [active, setActive] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const width = constraintsRef.current?.offsetWidth || 350;
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const slides = ["Привет", "Выбери время"];

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    const offset = info.offset.x;
    const direction = offset < 0 ? 1 : -1;
    const move = Math.abs(offset) > 50 ? direction : 0;
    updateActiveSlide(move);
  };

  useEffect(() => {
    x.set(-active * width);
  }, [active, width, x]);

  const updateActiveSlide = (direction: number) => {
    const newActive = (active + direction + slides.length) % slides.length;
    setActive(newActive);
  };

  const nextSlide = () => {
    updateActiveSlide(1);
  };

  const prevSlide = () => {
    updateActiveSlide(-1);
  };

  const handleTimeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(event.target.value);
    setActive(0); // Возвращаемся на первый слайд после выбора времени
  };

  return (
    <SliderContainer ref={constraintsRef}>
      <Slider
        style={{ x: springX }}
        drag="x"
        dragConstraints={{ left: -width * (slides.length - 1), right: 0 }}
        onDragEnd={handleDragEnd}
      >
        <SlideButton clickable={false} key="greeting">
          Привет
        </SlideButton>
        <TimeDropdownContainer key="select-time">
          {selectedTime ? (
            <span>{`Время: ${selectedTime}`}</span>
          ) : (
            <TimeDropdown onChange={handleTimeSelect} value={selectedTime || ''}>
              <option value="" disabled>Выберите время</option>
              {generateTimeOptions().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </TimeDropdown>
          )}
        </TimeDropdownContainer>
      </Slider>
      <PrevButton onClick={prevSlide}>&#10094;</PrevButton>
      <NextButton onClick={nextSlide}>&#10095;</NextButton>
    </SliderContainer>
  );
};

export default TimeSlider;
