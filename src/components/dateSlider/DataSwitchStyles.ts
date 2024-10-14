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
  background-color: ${({ isActive }) => (isActive ? 'transparent' : 'red')};
  width: 100%;
  border-radius: 3px;
  padding: 3px 2px;
`;
