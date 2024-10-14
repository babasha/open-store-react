import styled from 'styled-components';
import { theme } from '../../styles/Theme';
import { motion } from 'framer-motion';

export const TextContainer = styled.div`
  display: flex;
  margin-top: 5px;
`;

export const ActiveText = styled.p`
  color: ${theme.button.buttonDisabled};
`;

export const ClickableText = styled.p`
  color: ${theme.button.buttonActive};
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: ${theme.button.buttonHover};
  }
`;

export const BtnWrapper = styled(motion.div)<{ isActive: boolean }>`
  background-color: ${({ isActive }) => (isActive ? 'transparent' : 'transparent')};
  width: 100%;
  border-radius: 3px;
  padding: 3px 2px;
  cursor: ${({ isActive }) => (isActive ? 'default' : 'pointer')};
`;

export const Select = styled.select`
  margin-left: 10px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid ${theme.button.buttonActive};
  background-color: ${theme.colors.ShopWindowBg};
  color: ${theme.button.buttonActive};
`;

export const Label = styled.label`
  margin-bottom: 15px;
  margin-top: 30px;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: ${theme.colors.font};

  select {
    margin-left: 10px;
  }
`;

export const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: ${theme.button.buttonActive};
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  align-self: flex-start;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${theme.button.buttonHover};
  }
`;
