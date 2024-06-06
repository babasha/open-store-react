// src/components/dateSlider/TimeSelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const TimeSelector = () => {
  const [selectedTime, setSelectedTime] = useState('');
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const timePickerRef = useRef(null);

  const toggleTimePicker = () => {
    setIsTimePickerOpen(!isTimePickerOpen);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    setIsTimePickerOpen(false);
  };

  // Генерация временных меток с шагом в 30 минут
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };

  // Функция для закрытия выпадающего меню при клике вне его
  const handleClickOutside = (event) => {
    if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
      setIsTimePickerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Container>
      <ArrowButton onClick={() => setSelectedTime('')}>{'<'}</ArrowButton>
      <TimePickerContainer ref={timePickerRef} onClick={toggleTimePicker}>
        <SelectedTime>{selectedTime || 'Выбрать время'}</SelectedTime>
        <AnimatePresence>
          {isTimePickerOpen && (
            <Dropdown
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {generateTimeOptions().map((time) => (
                <DropdownItem key={time} onClick={() => handleTimeChange(time)}>
                  {time}
                </DropdownItem>
              ))}
            </Dropdown>
          )}
        </AnimatePresence>
      </TimePickerContainer>
      <ArrowButton onClick={() => setSelectedTime('ASAP')}>{'>'}</ArrowButton>
    </Container>
  );
};

export default TimeSelector;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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
`;

const TimePickerContainer = styled.div`
  position: relative;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  background-color: white;
`;

const SelectedTime = styled.div`
  font-size: 16px;
  text-align: center;
  color: #000;
  flex-grow: 1;
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
`;

const DropdownItem = styled.div`
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
