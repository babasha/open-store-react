// src/components/OrderCardStyles.ts
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Card = styled(motion.li)`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Header = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

export const DetailsButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

export const ProductList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ProductItem = styled.li`
  border-top: 1px solid #eee;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;

  &:first-child {
    border-top: none;
  }
`;
