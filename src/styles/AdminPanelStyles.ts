import styled from 'styled-components';

export const AdminPanelContainer = styled.div`
  padding: 20px;
`;

export const Section = styled.section`
  margin-top: 20px;
`;

export const SectionTitle = styled.h2`
  margin-bottom: 20px;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const RoleSelect = styled.select`
  margin-top: 10px;
  padding: 5px;
  font-size: 16px;
`;


export const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

export const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const ListItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
`;

export const ProductImage = styled.img`
  width: 50px;
  height: 50px;
`;

export const ProductDetails = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const UserDetails = styled.div`
  margin-top: 10px;
`;
export const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;