import io from 'socket.io-client';

const socket = io('https://enddel.com', {
  withCredentials: true
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('newOrder', (newOrder) => {
  console.log('New order received:', newOrder);
});

socket.on('orderUpdated', (updatedOrder) => {
  console.log('Order updated:', updatedOrder);
});

export default socket;
