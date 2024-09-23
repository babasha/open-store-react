import React from 'react';
import styled from 'styled-components';

type TitleProps = {
  title: string;
};

const Title: React.FC<TitleProps> = ({ title }) => {
  return <TitleText>{title}</TitleText>;
};

const TitleText = styled.p`
  text-align: center;
  margin-top: 10px;
  font-size: 1.2rem;
  color: #333;
`;

export default Title;
