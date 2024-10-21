// src/components/productPrice/Price.tsx
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/Theme';

interface PriceProps {
  amount: number;
  insideButton?: boolean;
  isActive?: boolean; // Добавляем необязательный проп isActive
}

const Price: React.FC<PriceProps> = ({ amount, insideButton = false, isActive = false }) => {
  return (
    <Container insideButton={insideButton}>
      <Amount insideButton={insideButton} isActive={isActive}>
        {amount} ₾
      </Amount>
    </Container>
  );
};

const Container = styled.div<{ insideButton: boolean }>`
  display: flex;
  align-items: center;
  margin-left: ${({ insideButton }) => (insideButton ? '0' : '10px')};
`;

const Amount = styled.span<{ insideButton: boolean; isActive: boolean }>`
  font-size: ${({ insideButton }) => (insideButton ? '14px' : '19px')};
  color: ${({ insideButton, isActive }) => {
    if (insideButton) {
      return isActive ? 'white' : theme.colors.font;
    }
    return 'black';
  }};
  margin-right: ${({ insideButton }) => (insideButton ? '8px' : '0')};
`;

export default Price;
