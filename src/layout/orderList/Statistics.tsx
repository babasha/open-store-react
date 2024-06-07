import React from 'react';
import { Chart } from 'react-google-charts';
import { StatisticsContainer } from '../../styles/OrderListStyles';

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
    </StatisticsContainer>
  );
};

export default Statistics;
