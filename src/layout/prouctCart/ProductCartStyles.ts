import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/Theme';

// Анимация загрузки
export const loadingAnimation = keyframes`
  0% {
    left: -45%;
  }
  100% {
    left: 100%;
  }
`;

export const Cart = styled.div`
  background-color: ${theme.colors.mainBg};
  width: 250px;
  min-height: 300px;
  height: max-content;
  margin: 10px;
  border-radius: 20px;
  padding: 10px;

  @media (max-width: 480px) {
    width: calc(50% - 20px); // 50% ширины экрана с учетом отступов для мобильных экранов
    /* margin: 10px; */
  }

  @media (min-width: 481px) and (max-width: 768px) {
    width: calc(33.33% - 20px); // 3 карточки в ряду на экранах планшетов
    /* margin: 10px; */
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: calc(33.33% - 20px); // Также 3 карточки для больших планшетов
    /* margin: 10px; */
  }

  @media (min-width: 1025px) {
    width: calc(25% - 20px); // 4 карточки в ряду на экранах десктопов
    /* margin: 10px; */
  }
`;



export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 20px;
  margin-bottom: 10px;
`;

export const ProductImage = styled.img<{ isLoaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  opacity: ${({ isLoaded }) => (isLoaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  display: block;
`;

export const Placeholder = styled.div<{ isLoaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.mainBg || '#f0f0f0'};
  border-radius: 20px;
  opacity: ${({ isLoaded }) => (isLoaded ? 0 : 1)};
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
`;

export const Title = styled.p`
  text-align: center;
  margin-top: 10px;
  font-size: 1.2rem;
  color: ${theme.colors.font || '#333'};
  
`;

export const PlaceholderCart = styled.div`
  background-color: ${theme.colors.mainBg};
  width: 250px;
  min-height: 300px;
  margin: 10px;
  border-radius: 20px;
  padding: 10px;
  @media (max-width: 480px) {
    width: calc(50% - 20px); // 50% ширины экрана с учетом отступов для мобильных экранов
    /* margin: 10px; */
  }

  @media (min-width: 481px) and (max-width: 768px) {
    width: calc(33.33% - 20px); // 3 карточки в ряду на экранах планшетов
    /* margin: 10px; */
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: calc(33.33% - 20px); // Также 3 карточки для больших планшетов
    /* margin: 10px; */
  }

  @media (min-width: 1025px) {
    width: calc(25% - 20px); // 4 карточки в ряду на экранах десктопов
    /* margin: 10px; */
  }
`;

export const PlaceholderImage = styled.div`
  width: 100%;
  height: 160px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
`;

export const PlaceholderContent = styled.div`
  height: 10px;
  margin-bottom: 20px;
  position: relative;
`;

export const PlaceholderControls = styled.div`
  height: 40px;
  position: relative;
`;

export const LoadWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  background-color: rgb(211, 211, 211);
  overflow: hidden;
  border-radius: 20px;
`;

export const Activity = styled.div`
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
