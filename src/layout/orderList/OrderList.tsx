import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import socket from '../../socket';
import OrderItem from './OrderItem';
import {
  Container,
  Title,
  FlexContainer,
  SearchInput,
  DatePickers,
  StyledDatePicker,
  SortButton,
  ExportButton,
  FilterTodayButton,
  OrderList as StyledOrderList
} from '../../styles/OrderListStyles';

interface Item {
  productId: number;
  productName: string;
  quantity: number;
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
  items: Item[];
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Добавляем состояние для сортировки

  useEffect(() => {
    fetchOrders();
    socket.on('newOrder', (newOrder: Order) => {
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    });
    socket.on('orderUpdated', (updatedOrder: Order) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    });
    return () => {
      socket.off('newOrder');
      socket.off('orderUpdated');
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/orders', { withCredentials: true });
      const fetchedOrders = response.data.map((order: any) => ({
        ...order,
        delivery_time: order.delivery_time || '',
      }));
      setOrders(fetchedOrders);
    } catch (error: any) {
      console.error('Ошибка при получении заказов:', error.message);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filterOrders = () => {
    let filteredOrders = orders.filter((order) => {
      const firstName = order.first_name || '';
      const lastName = order.last_name || '';
      const address = order.address || '';

      return (
        firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.toLowerCase().includes(searchTerm.toLowerCase())
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
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filterOrders());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'orders.xlsx');
  };

  const handleSort = () => {
    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setOrders(sortedOrders);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Container>
      <Title>Список заказов</Title>
      <FlexContainer>
        <SearchInput
          type="text"
          placeholder="Поиск заказов..."
          value={searchTerm}
          onChange={handleSearch}
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
        <ExportButton onClick={exportToExcel}>Экспорт в Excel</ExportButton>
        <FilterTodayButton onClick={() => {
          const today = new Date();
          setStartDate(new Date(today.setHours(0, 0, 0, 0)));
          setEndDate(new Date(today.setHours(23, 59, 59, 999)));
        }}>
          Показать сегодняшние заказы
        </FilterTodayButton>
      </FlexContainer>
      <StyledOrderList>
        {filterOrders().map((order) => (
          <OrderItem key={order.id} order={order} setOrders={setOrders} />
        ))}
      </StyledOrderList>
    </Container>
  );
};

export default OrderList;
