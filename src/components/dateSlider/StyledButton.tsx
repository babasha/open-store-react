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
  /* width: 120px; */
  /* height: 35px; */
  margin-top: 15px;
  transition: 0.3s;
  padding: 5px 0px 5px 0px;
  /* margin: 0 5px; */
  margin-right: 5px;
  pointer-events: auto;

  &:hover {
    background-color: ${props => (props.isActive ? theme.button.buttonActive : 'lightblue')};
  }

  &:disabled {
    background-color: gray;
  }

  @media (max-width: 652px) {
    padding: 10px 15px;
    /* margin-top: 25px; */
  /* padding-top: 20px; */
  }
`;

export default StyledButton;
