import styled from 'styled-components';
import { theme } from '../../styles/Theme';

export const CartdiInner = styled.div`
  background-color: ${theme.colors.mainBg};
  margin-top: 10px;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
`;

export const CartItemWrapper = styled.div`
  display: flex;
  position: relative;
  margin-top: 15px;
  margin-bottom: 10px;
`;

export const ItemDetails = styled.div`
  flex-grow: 1;
`;

export const DeleteButton = styled.button<{ isEditing: boolean }>`
  position: absolute;
  right: ${({ isEditing }) => (isEditing ? '0' : '-100px')};
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

export const PurchaseButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #5cb85c;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #4cae4c;
  }
`;

export const TotalPrice = styled.div`
  margin-top: 10px;
  font-weight: bold;
  font-size: 20px;
`;

export const ItemContext = styled.span`
  margin-right: 25px;
  font-size: 16px;
`;

export const ItemContextTitle = styled.span`
  font-weight: bold;
  margin-right: 25px;
  font-size: 16px;
`;

export const ErrorText = styled.p`
  color: red;
  margin-top: 10px;
`;
