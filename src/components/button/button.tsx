import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ToggleButton: React.FC = () => {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    setIsAdded(!isAdded);
  };

  return (
    <Button
      as={motion.button}
      onClick={handleClick}
      isAdded={isAdded}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isAdded ? 'Добавлено' : '+ Добавить'}
    </Button>
  );
};

const Button = styled(motion.button)<{ isAdded: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  background-color: ${props => (props.isAdded ? 'blue' : 'transparent')};
  color: ${props => (props.isAdded ? 'white' : 'blue')};
  border: ${props => (props.isAdded ? 'none' : '1px solid blue')};
  font-size: 16px;

  &:hover {
    background-color: ${props => (props.isAdded ? 'darkblue' : 'lightblue')};
  }
`;

export default ToggleButton;