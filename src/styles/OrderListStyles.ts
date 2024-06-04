import styled from 'styled-components';
import DatePicker from 'react-datepicker';

export const Container = styled.div`
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Section = styled.div`
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
`;

export const SectionTitle = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

export const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

export const SearchInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 200px;
`;

export const DatePickers = styled.div`
  display: flex;
  gap: 10px;
`;

export const StyledDatePicker = styled(DatePicker)`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

export const SortButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  background: #7572d5;
  color: white;

  &:hover {
    background: #5a52a4;
  }
`;

export const ExportButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  background: #4caf50;
  color: white;

  &:hover {
    background: #388e3c;
  }
`;

export const FilterTodayButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  background: #ff9800;
  color: white;

  &:hover {
    background: #e68900;
  }
`;

export const OrderList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const OrderListItem = styled.li`
  background: #ffffff;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

export const OrderDetails = styled.div`
  p {
    margin: 5px 0;
  }

  ul {
    padding-left: 20px;
    list-style: disc;
  }
`;

export const StatusButton = styled.button`
  padding: 10px;
  margin-top: 10px;
  font-size: 14px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  background: #7572d5;
  color: white;

  &:hover {
    background: #5a52a4;
  }
`;
