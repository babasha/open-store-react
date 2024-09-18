// src/components/Register/ErrorMessage.tsx
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/Theme';

interface ErrorMessageProps {
  message: string;
}

const Message = styled.p`
  color: ${theme.button.errorbtn};
  margin: 15px 0;
`;

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <Message>{message}</Message>;
};

export default ErrorMessage;
