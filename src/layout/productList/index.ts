import styled from 'styled-components';

export const Section = styled.section`
  padding: 20px;
`;

export const SectionTitle = styled.h2`
  margin-bottom: 20px;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
`;

export const ListItem = styled.li`
  margin-bottom: 10px;
`;

export const ProductDetails = styled.div`
  display: flex;
  align-items: center;
`;

export const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
`;

export const Button = styled.button`
  padding: 8px 12px;
  margin-right: 10px;
  background-color: #09f;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0077cc;
  }
`;
