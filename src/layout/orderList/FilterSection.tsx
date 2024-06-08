// src/components/FilterSection.tsx
import React from 'react';
import FilterControls from './FilterControls';

interface FilterSectionProps {
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

const FilterSection: React.FC<FilterSectionProps> = ({
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
    <FilterControls
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      handleSort={handleSort}
      sortOrder={sortOrder}
      handleDeliverySort={handleDeliverySort}
      deliverySortOrder={deliverySortOrder}
      exportToExcel={exportToExcel}
      filterToday={filterToday}
    />
  );
};

export default FilterSection;
