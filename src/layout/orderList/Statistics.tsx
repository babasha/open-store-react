import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import { StatisticsContainer } from '../../styles/OrderListStyles';
import ProductStatistics from './ProductStatistics';
import CustomerStatistics from './CustomerStatistics';

interface StatisticsProps {
  avgPendingTime: string;
  hourChartData: any[];
  dayChartData: any[];
}

const Statistics: React.FC<StatisticsProps> = ({
  avgPendingTime,
  hourChartData,
  dayChartData,
}) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPeriod = event.target.value as 'week' | 'month' | 'year';
    setPeriod(selectedPeriod);

    const now = new Date();
    let newStartDate: Date | null = null;
    let newEndDate: Date | null = null;

    switch (selectedPeriod) {
      case 'week':
        newStartDate = new Date(now.setDate(now.getDate() - 7));
        newEndDate = new Date();
        break;
      case 'month':
        newStartDate = new Date(now.setMonth(now.getMonth() - 1));
        newEndDate = new Date();
        break;
      case 'year':
        newStartDate = new Date(now.setFullYear(now.getFullYear() - 1));
        newEndDate = new Date();
        break;
      default:
        break;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <StatisticsContainer>
      <h3>Среднее время в статусе "в ожидании": {avgPendingTime}</h3>
      <Chart
        chartType="ColumnChart"
        data={hourChartData}
        width="100%"
        height="400px"
        options={{ legend: { position: 'top' } }}
      />
      <Chart
        chartType="ColumnChart"
        data={dayChartData}
        width="100%"
        height="400px"
        options={{ legend: { position: 'top' } }}
      />
      <label htmlFor="period">Выберите период:</label>
      <select id="period" value={period} onChange={handlePeriodChange}>
        <option value="week">Последняя неделя</option>
        <option value="month">Последний месяц</option>
        <option value="year">Последний год</option>
      </select>
      <ProductStatistics startDate={startDate} endDate={endDate} />
      <CustomerStatistics startDate={startDate} endDate={endDate} />
    </StatisticsContainer>
  );
};

export default Statistics;