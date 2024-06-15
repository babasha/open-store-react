// src/components/StatisticsSection.tsx
import React from 'react';
import Statistics from './Statistics';
import { useAuth } from '../autoeization/AuthContext';

interface StatisticsSectionProps {
  avgPendingTime: string;
  hourChartData: any[];
  dayChartData: any[];
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ avgPendingTime, hourChartData, dayChartData }) => {
  const { user } = useAuth();

  if (user?.role === 'courier') {
    return null; // Не отображаем статистику для курьеров
  }

  return (
    <Statistics
      avgPendingTime={avgPendingTime}
      hourChartData={hourChartData}
      dayChartData={dayChartData}
    />
  );
};

export default StatisticsSection;
