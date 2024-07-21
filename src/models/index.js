require('dotenv').config(); // Загрузка переменных окружения из файла .env
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors'); // Подключение модуля CORS
const { Server } = require('socket.io');
const pool = require('./config/db'); // Подключение к базе данных

// Импорт маршрутов
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const courierRoutes = require('./routes/courierRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.PUBLIC_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Настройки CORS
app.use(cors({
  origin: [process.env.PUBLIC_URL, 'https://web.telegram.org'],
  credentials: true
}));

// Middleware для обработки JSON
app.use(express.json());

// Middleware для заголовков CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin); // Динамическое разрешение
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Подключение маршрутов
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/couriers', courierRoutes);
app.use('/orders', orderRoutes);

// Подключение статических файлов
app.use('/uploads', express.static('uploads'));

// Маршрут для обслуживания фронтенда
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('Новое подключение');

  socket.on('disconnect', () => {
    console.log('Отключение');
  });
});
