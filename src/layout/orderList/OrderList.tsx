import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import socket from '../../socket';

import {
  SearchInput,
  DatePickers,
  StyledDatePicker,
  SortButton,
  ExportButton,
  FilterTodayButton,
  OrderList as StyledOrderList,
  OrderListItem,
  OrderDetails,
  StatusButton
} from '../../styles/OrderListStyles';
import styled from 'styled-components';

interface Item {
  productId: number;
  productName: string;
  quantity: number;
}

interface Order {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  address: string;
  total: string;
  status: string;
  created_at: string;
  items: Item[];
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
      setOrders(response.data);
    } catch (error: any) {
      console.error('Ошибка при получении заказов:', error.message);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await axios.put(`http://localhost:3000/orders/${id}/status`, { status }, { withCredentials: true });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );
    } catch (error: any) {
      console.error('Ошибка при обновлении статуса заказа:', error.message);
    }
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

  const renderOrderList = () => {
    const filteredOrders = filterOrders();
    return filteredOrders.map((order) => (
      <OrderListItem key={order.id}>
        <OrderDetails>
          <p>Идентификатор заказа: {order.id}</p>
          <p>Идентификатор пользователя: {order.user_id}</p>
          <p>Пользователь: {order.first_name} {order.last_name}</p>
          <p>Адрес: {order.address}</p>
          <p>Итог: ${order.total}</p>
          <p>Статус: {order.status}</p>
          <StatusButton onClick={() => handleStatusChange(order.id, order.status === 'pending' ? 'assembly' : 'pending')}>
            {order.status === 'pending' ? 'Начать сборку' : 'Вернуться к состоянию ожидания'}
          </StatusButton>
          <p>Продукты:</p>
          <ul>
            {order.items.map((item) => (
              <li key={item.productId}>
                Продукт: {item.productName} (ID: {item.productId}) - Количество: {item.quantity}
              </li>
            ))}
          </ul>
          <p>Создано: {new Date(order.created_at).toLocaleString()}</p>
        </OrderDetails>
      </OrderListItem>
    ));
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
        <SortButton onClick={() => setOrders([...orders].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()))}>
          Сортировать по дате
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
        {renderOrderList()}
      </StyledOrderList>
    </Container>
  );
};

export default OrderList;

export const Container = styled.div`
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

