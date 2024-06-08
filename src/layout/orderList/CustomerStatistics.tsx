import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';

interface CustomerStatisticsProps {
  startDate: Date | null;
  endDate: Date | null;
}

const CustomerStatistics: React.FC<CustomerStatisticsProps> = ({ startDate, endDate }) => {
  const [customerData, setCustomerData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomerStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:3000/orders', { withCredentials: true });
        const orders = response.data;

        // Filter orders based on the date range
        const filteredOrders = orders.filter((order: any) => {
          const orderDate = new Date(order.created_at);
          return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
        });

        const customerCount: { [key: string]: number } = {};

        filteredOrders.forEach((order: any) => {
          const customerName = `${order.first_name} ${order.last_name}`;
          if (customerCount[customerName]) {
            customerCount[customerName] += 1;
          } else {
            customerCount[customerName] = 1;
          }
        });

        const customerData: [string, number][] = [];
        for (const customer in customerCount) {
          customerData.push([customer, customerCount[customer]]);
        }

        setCustomerData([['Customer', 'Orders'], ...customerData]);
      } catch (error: any) {
        console.error('Ошибка при получении статистики по покупателям:', error.message);
      }
    };

    fetchCustomerStatistics();
  }, [startDate, endDate]);

  return (
    <div>
      <h3>Статистика по покупателям</h3>
      <Chart
        chartType="ColumnChart"
        data={customerData}
        width="100%"
        height="400px"
        options={{ legend: { position: 'top' } }}
      />
    </div>
  );
};

export default CustomerStatistics;
