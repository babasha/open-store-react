// src/components/AccordionStyles.ts
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const AccordionHeader = styled(motion.summary)`
  cursor: pointer;
  font-weight: bold;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 10px;
  user-select: none;
  &:hover {
    background: #e0e0e0;
  }
`;

export const OrderList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const LoadMoreButton = styled.button`
  padding: 10px;
  margin-top: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;
