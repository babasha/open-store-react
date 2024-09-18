import styled from 'styled-components';
import ButtonWithRipple from '../../styles/btns/ButtonStyles';
import { theme } from '../../styles/Theme';

export const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1rem;
`;

export const RegisterButton = styled(ButtonWithRipple)`
  /* Дополнительные стили можно добавить здесь */
`;

export const LoginTitle = styled.h3`
  margin: 10px 0;
`;

export const ErrorMessage = styled.p`
  color: ${theme.button.errorbtn};
  margin: 15px 0;
`;

export const MapModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const MapContent = styled.div`
  width: 70%;
  height: 70%;
  background-color: white;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
`;
