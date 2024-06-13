import styled from 'styled-components';
import { theme } from '../../styles/Theme';

interface StyledButtonProps {
  isActive: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  border-radius: 30px;
  cursor: pointer;
  background-color: ${props => (props.isActive ? theme.button.buttonActive : 'transparent')};
  color: ${props => (props.isActive ? 'white' : theme.button.buttonActive)};
  border: ${props => (props.isActive ? theme.button.buttonActive : '1px solid #0098EA')};
  font-size: 16px;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 35px;
  transition: 0.3s;
  margin: 0 5px;
  pointer-events: auto;

  &:hover {
    background-color: ${props => (props.isActive ? theme.button.buttonActive : 'lightblue')};
  }

  &:disabled {
    background-color: gray;
  }
`;

export default StyledButton;
