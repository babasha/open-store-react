// import styled from 'styled-components';
import { theme } from '../../styles/Theme';
import ButtonWithRipple from '../../styles/btns/ButtonStyles';
import styled, { keyframes } from 'styled-components';

export const CartdiInner = styled.div`
  background-color: ${theme.colors.mainBg};
  /* margin-top: 10px; */
  padding: 20px;
  border-radius: 10px;
  /* width: 100%; */
  @media (max-width: 652px) {
  margin-bottom: 10px;
  padding-top: 20px;
  }

`;

export const CartItemWrapper = styled.div`
  display: flex;
  position: relative;
  margin-top: 15px;
  /* margin-bottom: 10px; */
  @media (max-width: 652px) {
    margin-bottom: 5px; 
  /* margin-top: 25px; */
  /* padding-top: 20px; */
  }
`;

export const ItemDetails = styled.div`
  /* flex-grow: 1; */
  /* margin-bottom: 10px; */
 /* background-color: #00e6ac4c; */
  
  width: 100%;
  /* height: 20px; */
   
`;

export const DeleteButton = styled.button<{ isEditing: boolean }>`
  position: absolute;
  right: ${({ isEditing }) => (isEditing ? '0' : '-5px')};
  opacity: ${({ isEditing }) => (isEditing ? 1 : 0)};
  transition: right 0.3s ease-in-out, opacity 0.3s ease-in-out;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #d9534f;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }
`;

export const PurchaseButton = styled(ButtonWithRipple)`
  /* margin-left: -2%; */
  width: 103%;
  border-radius: 10px;
  padding: 10px 0px;
  background-color: ${({ isActive }) => (isActive ? theme.button.buttonActive : 'transparent')};
  color: ${({ isActive }) => (isActive ? 'white' : theme.button.buttonActive)};
  border: ${({ isActive }) => (isActive ? `1px solid ${theme.button.buttonActive}` : '1px solid #0098EA')};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? theme.button.buttonActive : 'lightblue')};
  }

  &:disabled {
    background-color: grey;
    border-color: grey;
    cursor: not-allowed;
  }
`;

export const TotalPrice = styled.div`
  /* margin-top: 10px; */
  font-weight: bold;
  font-size: 20px;
`;

export const ItemContext = styled.span`
  margin-right: 25px;
  font-size: 16px;
`;

export const ItemContextTitle = styled.span`
  font-weight: bold;
  margin-right: 20px;
  font-size: 16px;
  text-align: center;
`;

export const ErrorText = styled.p`
  color: red;
  margin-top: 10px;
`;
export const BascketTitle = styled.h2`
 font-size: 24px;
 padding-top: -25px;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const DiscountInfo = styled.div`
  color: ${theme.colors.font};
  font-size: 12px;
  margin-top: 2px;
  background-color: ${theme.colors.ShopWindowBg};
  margin-top: 5px;
  padding: 5px 5px;
  border-radius: 3px;
  width: 70%;
  opacity: 0;
  animation: ${fadeIn} 0.5s forwards; /* добавлена анимация */
`;

export const ItemWrapper = styled.div`
  /* color: #15f1ba; */
  
  width: 100%;
  height: 20px;
`;