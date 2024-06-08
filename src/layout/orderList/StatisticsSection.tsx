import React from 'react';
import Statistics from './Statistics';

interface StatisticsSectionProps {
  avgPendingTime: string;
  hourChartData: any[];
  dayChartData: any[];
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ avgPendingTime, hourChartData, dayChartData }) => {
  return (
    <Statistics
      avgPendingTime={avgPendingTime}
      hourChartData={hourChartData}
      dayChartData={dayChartData}
    />
  );
};

export default StatisticsSection;