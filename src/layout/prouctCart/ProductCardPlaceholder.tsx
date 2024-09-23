// src/components/ProductCardPlaceholder.tsx

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/Theme';

const loadingAnimation = keyframes`
  0% {
    left: -45%;
  }
  100% {
    left: 100%;
  }
`;

const LoadWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  background-color: rgb(211, 211, 211);
  overflow: hidden;
  border-radius: 5px;
`;

const Activity = styled.div`
  position: absolute;
  left: -45%;
  height: 100%;
  width: 45%;
  background-image: linear-gradient(
    to left,
    rgba(251, 251, 251, 0.05),
    rgba(251, 251, 251, 0.3),
    rgba(251, 251, 251, 0.6),
    rgba(251, 251, 251, 0.3),
    rgba(251, 251, 251, 0.05)
  );
  animation: ${loadingAnimation} 1s infinite;
`;

const PlaceholderCard = styled.div`
  background-color: ${theme.colors.mainBg};
  width: 250px;
  min-height: 300px;
  margin: 10px;
  border-radius: 30px;
  padding: 10px;
`;

const PlaceholderImage = styled.div`
  height: 65%;
  border-radius: 30px;
  margin-bottom: 10px;
  ${LoadWrapper} {
    border-radius: 30px;
  }
`;

const PlaceholderText = styled.div`
  height: 20px;
  margin: 10px 0;
  ${LoadWrapper} {
    border-radius: 5px;
  }
`;

const ProductCardPlaceholder: React.FC = () => {
  return (
    <PlaceholderCard>
      <PlaceholderImage>
        <LoadWrapper>
          <Activity />
        </LoadWrapper>
      </PlaceholderImage>
      <PlaceholderText>
        <LoadWrapper>
          <Activity />
        </LoadWrapper>
      </PlaceholderText>
      <PlaceholderText style={{ width: '60%' }}>
        <LoadWrapper>
          <Activity />
        </LoadWrapper>
      </PlaceholderText>
    </PlaceholderCard>
  );
};

export default ProductCardPlaceholder;
