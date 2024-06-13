import styled from 'styled-components';
import { theme } from '../../styles/Theme';

export const TextContainer = styled.div`
  margin-top: 15px;
  display: flex;
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
