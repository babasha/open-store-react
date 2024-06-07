import styled from 'styled-components';
import DatePicker from 'react-datepicker';

export const Container = styled.div`
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #d9534f;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #c9302c;
  }
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

export const OrderListItem = styled.div<{ isCanceled: boolean }>`
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ isCanceled }) => (isCanceled ? '#f0f0f0' : 'white')};
`;

export const StatusButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: #0056b3;
  }
`;

export const StatisticsContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  h3 {
    margin-bottom: 20px;
  }
`;

export const OrderProductList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const OrderProductItem = styled.li`
  border-bottom: 1px solid #ddd;
  padding: 5px 0;
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

// Экспортируем StyledOrderList как OrderList для совместимости с существующим кодом
export const StyledOrderList = OrderList;

export const OrderDetailsContainer = styled.div`
  p {
    margin: 5px 0;
  }

  ul {
    padding-left: 20px;
    list-style: disc;
  }
`;
