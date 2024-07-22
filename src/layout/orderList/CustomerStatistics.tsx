import React, { useEffect, useState, useMemo } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';

interface CustomerStatisticsProps {
  startDate: Date | null;
  endDate: Date | null;
}

const CustomerStatistics: React.FC<CustomerStatisticsProps> = ({ startDate, endDate }) => {
  const [customerData, setCustomerData] = useState<[string, number][]>([]);

  useEffect(() => {
    const fetchCustomerStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:3000/orders', { withCredentials: true });
        const orders: any[] = response.data;

        // Filter orders based on the date range
        const filteredOrders = orders.filter((order) => {
          const orderDate = new Date(order.created_at);
          return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
        });

        const customerCount: { [key: string]: number } = {};

        filteredOrders.forEach((order) => {
          const customerName = `${order.first_name} ${order.last_name}`;
          customerCount[customerName] = (customerCount[customerName] || 0) + 1;
        });

        const customerData: [string, number][] = Object.entries(customerCount);
        setCustomerData(customerData);
      } catch (error: any) {
        console.error('Ошибка при получении статистики по покупателям:', error.message);
      }
    };

    fetchCustomerStatistics();
  }, [startDate, endDate]);

  const chartData = useMemo(() => [['Customer', 'Orders'], ...customerData], [customerData]);

  return (
    <div>
      <h3>Статистика по покупателям</h3>
      <Chart
        chartType="ColumnChart"
        data={chartData}
        width="100%"
        height="400px"
        options={{ legend: { position: 'top' } }}
      />
    </div>
  );
};

export default CustomerStatistics;
