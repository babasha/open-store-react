import React from 'react';
import DatePicker from 'react-datepicker';
import {
  FlexContainer,
  SearchInput,
  DatePickers,
  StyledDatePicker,
  SortButton,
  ExportButton,
  FilterTodayButton,
} from '../../styles/OrderListStyles';

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  handleSort: () => void;
  sortOrder: 'asc' | 'desc';
  handleDeliverySort: () => void;
  deliverySortOrder: 'asc' | 'desc';
  exportToExcel: () => void;
  filterToday: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleSort,
  sortOrder,
  handleDeliverySort,
  deliverySortOrder,
  exportToExcel,
  filterToday,
}) => {
  return (
    <FlexContainer>
      <SearchInput
        type="text"
        placeholder="Поиск заказов..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <DatePickers>
        <StyledDatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          placeholderText="Дата начала"
        />
        <StyledDatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          placeholderText="Дата окончания"
        />
      </DatePickers>
      <SortButton onClick={handleSort}>
        Сортировать по дате {sortOrder === 'asc' ? '↑' : '↓'}
      </SortButton>
      <SortButton onClick={handleDeliverySort}>
        Сортировать по времени до доставки {deliverySortOrder === 'asc' ? '↑' : '↓'}
      </SortButton>
      <ExportButton onClick={exportToExcel}>Экспорт в Excel</ExportButton>
      <FilterTodayButton onClick={filterToday}>
        Показать сегодняшние заказы
      </FilterTodayButton>
    </FlexContainer>
  );
};

export default FilterControls;
