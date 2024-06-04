import React, { useState, useEffect } from 'react';
import { Section, SectionTitle, Controls, SearchInput, DatePickers, StyledDatePicker, SortButton, ExportButton, FilterTodayButton, OrderList as List, OrderListItem as ListItem, OrderDetails } from '../../styles/OrderListStyles';
import 'react-datepicker/dist/react-datepicker.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

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
  items: Item[];
  total: number;
  status: string;
  created_at: string;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterToday, setFilterToday] = useState(false);

  useEffect(() => {
    fetch('/orders', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message) });
        }
        return response.json();
      })
      .then((data: Order[]) => {
        setOrders(data);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        alert(`Error fetching orders: ${error.message}`);
      });
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    const searchLower = search.toLowerCase();
    const matchesSearch = search
      ? order.first_name.toLowerCase().includes(searchLower) ||
        order.last_name.toLowerCase().includes(searchLower) ||
        order.address.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.productName.toLowerCase().includes(searchLower))
      : true;

    const matchesDateRange = startDate && endDate
      ? orderDate >= startDate && orderDate <= endDate
      : true;

    const matchesToday = filterToday
      ? orderDate >= getTodayDate()
      : true;

    return matchesSearch && matchesDateRange && matchesToday;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortOrder === 'asc') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'orders.xlsx');
  };

  return (
    <Section>
      <SectionTitle>Orders List</SectionTitle>
      <Controls>
        <SearchInput 
          type="text" 
          placeholder="Search orders..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)} 
        />
        <DatePickers>
          <StyledDatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
          />
          <StyledDatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
          />
        </DatePickers>
        <SortButton onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          Sort by Date {sortOrder === 'asc' ? '▲' : '▼'}
        </SortButton>
        <ExportButton onClick={handleExportToExcel}>
          Export to Excel
        </ExportButton>
        <FilterTodayButton onClick={() => setFilterToday(!filterToday)}>
          {filterToday ? 'Show All Orders' : 'Show Today\'s Orders'}
        </FilterTodayButton>
      </Controls>
      <List>
        {sortedOrders.length > 0 ? (
          sortedOrders.map((order) => (
            <ListItem key={order.id}>
              <OrderDetails>
                <p>Order ID: {order.id}</p>
                <p>User ID: {order.user_id}</p>
                <p>User: {order.first_name} {order.last_name}</p>
                <p>Address: {order.address}</p>
                <p>Total: ${order.total}</p>
                <p>Status: {order.status}</p>
                <p>Products:</p>
                <ul>
                  {order.items.map((item: Item) => (
                    <li key={item.productId}>
                      Product: {item.productName} (ID: {item.productId}) - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
                <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
              </OrderDetails>
            </ListItem>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </List>
    </Section>
  );
};

export default OrderList;
