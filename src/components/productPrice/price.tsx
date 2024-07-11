import React from 'react';
import styled from 'styled-components';

interface PriceProps {
  amount: number;
}

const Price: React.FC<PriceProps> = ({ amount }) => {
  return (
    <Container>
      <Amount>{amount} GEL</Amount>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

// const Text = styled.span`
//   font-size: 16px;
//   color: black;
//   margin-right: 5px;
// `;

const Amount = styled.span`
  font-size: 19px;
  font-weight: bold;
  color: black;
  margin-left: 10px;
  @media (max-width: 1024px) {
    font-size: 16px;
  }
  @media (max-width: 820px) {
    font-size: 16px;
  }
  @media (max-width: 540px) {
    font-size: 14px;
  }
  @media (max-width: 430px) {
    font-size: 14px;
  }
  @media (max-width: 390px) {
    font-size: 12px;
  }
  @media (max-width: 375px) {
    font-size: 12px;
  }
  @media (max-width: 360px) {
    font-size: 12px;
  }
  @media (max-width: 344px) {
    font-size: 12px;
  }
  
`;

export default Price;
