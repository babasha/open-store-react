import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';

interface ProductStatisticsProps {
  startDate: Date | null;
  endDate: Date | null;
}

const ProductStatistics: React.FC<ProductStatisticsProps> = ({ startDate, endDate }) => {
  const [productData, setProductData] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:3000/orders', { withCredentials: true });
        const orders = response.data;

        // Filter orders based on the date range
        const filteredOrders = orders.filter((order: any) => {
          const orderDate = new Date(order.created_at);
          return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
        });

        const productCount: { [key: string]: number } = {};

        filteredOrders.forEach((order: any) => {
          order.items.forEach((item: any) => {
            const productName = item.productName;
            if (productCount[productName]) {
              productCount[productName] += 1;
            } else {
              productCount[productName] = 1;
            }
          });
        });

        const productData: [string, number][] = [];
        for (const product in productCount) {
          productData.push([product, productCount[product]]);
        }

        setProductData([['Product', 'Orders'], ...productData]);
      } catch (error: any) {
        console.error('Ошибка при получении статистики по продуктам:', error.message);
      }
    };

    fetchProductStatistics();
  }, [startDate, endDate]);

  return (
    <div>
      <h3>Статистика по продуктам</h3>
      <Chart
        chartType="ColumnChart"
        data={productData}
        width="100%"
        height="400px"
        options={{ legend: { position: 'top' } }}
      />
    </div>
  );
};

export default ProductStatistics;
