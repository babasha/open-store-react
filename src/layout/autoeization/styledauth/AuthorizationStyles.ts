// src/components/AuthorizationStyles.ts
import styled from 'styled-components';
import { theme } from '../../../styles/Theme';

export const UserDetails = styled.div`
  text-align: left;
  margin-top: 20px;
  h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 10px;
  }
  button {
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    &:hover {
      background-color: #0056b3;
    }
  }
`;

export const CardInner = styled.div`
  background-color: ${theme.colors.mainBg};
  margin-top: 10px;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
`;

export const OrderList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;