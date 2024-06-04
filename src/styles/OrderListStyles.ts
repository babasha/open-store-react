import styled from 'styled-components';
import DatePicker from 'react-datepicker';

export const Container = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
`;

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 200px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  background: #0098ea;
  color: white;

  &:hover {
    background: #7572d5;
  }
`;

export const StyledDatePicker = styled(DatePicker)`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 150px;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
`;

export const ListItem = styled.li`
  background: #ffffff;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

export const Details = styled.div`
  p {
    margin: 5px 0;
  }

  ul {
    padding-left: 20px;
    list-style: disc;
  }
`;

export const Section = styled(Container)``;

export const SectionTitle = styled(Title)``;

export const Controls = styled(FlexContainer)``;

export const SearchInput = styled(Input)``;

export const DatePickers = styled.div`
  display: flex;
  gap: 10px;
`;

export const SortButton = styled(Button)`
  background: #7572d5;
  &:hover {
    background: #0098ea;
  }
`;

export const ExportButton = styled(Button)`
  background: #28a745;
  &:hover {
    background: #218838;
  }
`;

export const FilterTodayButton = styled(Button)`
  background: #ffc107;
  &:hover {
    background: #e0a800;
  }
`;

export const OrderList = styled(List)``;

export const OrderListItem = styled(ListItem)``;

export const OrderDetails = styled(Details)``;
