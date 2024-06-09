import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import socket from '../../socket';
import FilterSection from './FilterSection';
import OrderSection from './OrderSection';
import StatisticsSection from './StatisticsSection';
import { Container, Title } from '../../styles/OrderListStyles';

export interface Item {
  productId: number;
  productName: string;
  quantity: number;
  ready: boolean; // Поле ready теперь обязательно
}

export interface Order {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  total: string;
  status: string;
  created_at: string;
  delivery_time: string;
  status_changed_at?: string;
  items: Item[];
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deliverySortOrder, setDeliverySortOrder] = useState<'asc' | 'desc'>('desc');
  const [avgPendingTime, setAvgPendingTime] = useState<string>('');
  const [orderStatistics, setOrderStatistics] = useState<{ hours: number[], days: number[] }>({ hours: [], days: [] });
  const [showCanceledOrders, setShowCanceledOrders] = useState<boolean>(false);

  useEffect(() => {
    fetchOrders();
    socket.on('newOrder', handleNewOrder);
    socket.on('orderUpdated', handleOrderUpdated);
    return () => {
      socket.off('newOrder', handleNewOrder);
      socket.off('orderUpdated', handleOrderUpdated);
    };
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/orders', { withCredentials: true });
      const fetchedOrders = response.data.map((order: any) => ({
        ...order,
        delivery_time: order.delivery_time || '',
      }));
      setOrders(fetchedOrders);
      calculateAvgPendingTime(fetchedOrders);
      calculateOrderStatistics(fetchedOrders);
    } catch (error: any) {
      console.error('Ошибка при получении заказов:', error.message);
    }
  }, []);

  const handleNewOrder = useCallback((newOrder: Order) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  }, []);

  const handleOrderUpdated = useCallback((updatedOrder: Order) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const filterOrders = useMemo(() => {
    let filteredOrders = orders.filter((order) => {
      const firstName = order.first_name || '';
      const lastName = order.last_name || '';
      const address = order.address || '';
      const phone = order.phone || '';

      return (
        firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm)
      );
    });

    if (startDate) {
      filteredOrders = filteredOrders.filter(
        (order) => new Date(order.created_at) >= startDate
      );
    }

    if (endDate) {
      filteredOrders = filteredOrders.filter(
        (order) => new Date(order.created_at) <= endDate
      );
    }

    return filteredOrders;
  }, [orders, searchTerm, startDate, endDate]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filterOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'orders.xlsx');
  }, [filterOrders]);

  const handleSort = useCallback(() => {
    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setOrders(sortedOrders);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  }, [orders, sortOrder]);

  const parseDeliveryTime = useCallback((deliveryTime: string): Date => {
    const [day, time] = deliveryTime.split(', ');
    const [hours, minutes] = time.split(':').map(Number);
    const deliveryDate = new Date();

    if (day === 'Сегодня') {
      // Ничего не делаем, дата остается сегодняшней
    } else if (day === 'Завтра') {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    deliveryDate.setHours(hours);
    deliveryDate.setMinutes(minutes);
    deliveryDate.setSeconds(0);
    return deliveryDate;
  }, []);

  const handleDeliverySort = useCallback(() => {
    const sortedOrders = [...orders].sort((a, b) => {
      const deliveryA = a.delivery_time ? parseDeliveryTime(a.delivery_time).getTime() : 0;
      const deliveryB = b.delivery_time ? parseDeliveryTime(b.delivery_time).getTime() : 0;
      return deliverySortOrder === 'asc' ? deliveryA - deliveryB : deliveryB - deliveryA;
    });
    setOrders(sortedOrders);
    setDeliverySortOrder(deliverySortOrder === 'asc' ? 'desc' : 'asc');
  }, [orders, deliverySortOrder, parseDeliveryTime]);

  const calculateAvgPendingTime = useCallback((orders: Order[]) => {
    const pendingOrders = orders.filter(order => order.status === 'pending');
    if (pendingOrders.length === 0) {
      setAvgPendingTime('N/A');
      return;
    }

    const totalPendingTime = pendingOrders.reduce((total, order) => {
      const createdAt = new Date(order.created_at).getTime();
      const now = new Date().getTime();
      return total + (now - createdAt);
    }, 0);

    const avgPendingTimeMs = totalPendingTime / pendingOrders.length;
    setAvgPendingTime(formatDuration(avgPendingTimeMs));
  }, []);

  const formatDuration = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }, []);

  const calculateOrderStatistics = useCallback((orders: Order[]) => {
    const hours = new Array(24).fill(0);
    const days = new Array(7).fill(0);

    orders.forEach(order => {
      const createdAt = new Date(order.created_at);
      hours[createdAt.getHours()] += 1;
      days[createdAt.getDay()] += 1;
    });

    setOrderStatistics({ hours, days });
  }, []);

  const hourChartData = useMemo(() => [
    ['Hour', 'Orders'],
    ...orderStatistics.hours.map((count, hour) => [`${hour}:00`, count]),
  ], [orderStatistics.hours]);

  const dayChartData = useMemo(() => [
    ['Day', 'Orders'],
    ...['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => [day, orderStatistics.days[index]]),
  ], [orderStatistics.days]);

  const filterToday = useCallback(() => {
    const today = new Date();
    setStartDate(new Date(today.setHours(0, 0, 0, 0)));
    setEndDate(new Date(today.setHours(23, 59, 59, 999)));
  }, []);

  const activeOrders = useMemo(() => filterOrders.filter(order => order.status !== 'canceled'), [filterOrders]);
  const canceledOrders = useMemo(() => filterOrders.filter(order => order.status === 'canceled'), [filterOrders]);

  return (
    <Container>
      <Title>Список заказов</Title>
      <FilterSection
        searchTerm={searchTerm}
        setSearchTerm={handleSearch}
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
      <OrderSection
        title="Активные заказы"
        orders={activeOrders}
        setOrders={setOrders}
      />
      <OrderSection
        title="Отмененные заказы"
        orders={canceledOrders}
        setOrders={setOrders}
        showCanceledOrders={showCanceledOrders}
        setShowCanceledOrders={setShowCanceledOrders}
        disableTimers
      />
      <StatisticsSection
        avgPendingTime={avgPendingTime}
        hourChartData={hourChartData}
        dayChartData={dayChartData}
      />
    </Container>
  );
};

export default OrderList;
