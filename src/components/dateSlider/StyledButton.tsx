import styled from 'styled-components';
import { theme } from '../../styles/Theme';

interface StyledButtonProps {
  isActive: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  border-radius: 10px;
  cursor: pointer;
  background-color: ${props => (props.isActive ? theme.button.buttonActive : 'transparent')};
  color: ${props => (props.isActive ? 'white' : theme.button.buttonActive)};
  border: ${props => (props.isActive ? theme.button.buttonActive : '1px solid #0098EA')};
  font-size: 16px;
  position: relative;
  overflow: hidden;
  margin-top: 15px;
  transition: 0.3s;
  padding: 5px 3px;
  pointer-events: auto;

  &:hover {
    background-color: ${props => (props.isActive ? theme.button.buttonActive : 'lightblue')};
  }

  &:disabled {
    background-color: gray;
  }

  &:first-child {
    margin-right: 5px;
  }

  @media (max-width: 652px) {
    padding: 10px 15px;
  }
  @media (max-width: 410px) {
    padding: 7px 10px;
  }
  @media (max-width: 390px) {
    padding: 7px 5px;
  }
  @media (max-width: 360px) {
    padding: 7px 2.3px;
  }
`;

export default StyledButton;
