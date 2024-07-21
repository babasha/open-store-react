// require('dotenv').config(); // Загрузка переменных окружения из файла .env
// const express = require('express');
// const http = require('http');
// const pool = require('./db'); // Подключение к базе данных
// const multer = require('multer');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const path = require('path');
// const { Server } = require('socket.io');
// const cors = require('cors'); // Подключение модуля CORS

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.PUBLIC_URL,
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// // Настройки CORS
// app.use(cors({
//   origin: [process.env.PUBLIC_URL, 'https://web.telegram.org'],
//   credentials: true
// }));

// // Middleware для обработки JSON
// app.use(express.json());

// // Middleware для заголовков CORS
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', req.headers.origin); // Динамическое разрешение
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   next();
// });

// // Конфигурация multer для загрузки файлов
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage: storage });

// // Middleware для проверки, является ли пользователь администратором
// const isAdmin = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(403).json({ error: 'Доступ запрещен.' });
//   }

//   const token = authHeader.split(' ')[1];
//   if (!token) {
//     return res.status(403).json({ error: 'Доступ запрещен.' });
//   }

//   try {
//     const decoded = jwt.verify(token, 'secret_key');
//     req.user = decoded;
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Доступ запрещен.' });
//     }
//     next();
//   } catch (error) {
//     console.error('Ошибка при проверке токена:', error.message);
//     res.status(400).json({ error: 'Неверный токен.' });
//   }
// };

// // Middleware для проверки авторизации пользователя
// const isAuthenticated = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).json({ message: 'Токен не предоставлен' });
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, 'secret_key');
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error('Ошибка при проверке токена:', error.message);
//     res.status(400).json({ message: 'Неверный токен' });
//   }
// };

// // Маршрут для получения всех продуктов
// app.get('/products', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM products');
//     const products = result.rows.map((product) => ({
//       ...product,
//       name: {
//         en: product.name_en,
//         ru: product.name_ru,
//         geo: product.name_geo
//       }
//     }));
//     res.json(products);
//   } catch (err) {
//     console.error('Ошибка получения продуктов:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для получения всех курьеров
// app.get('/couriers', isAuthenticated, async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM couriers');
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Ошибка получения курьеров:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для получения данных о конкретном курьере
// app.get('/couriers/me', isAuthenticated, async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM couriers WHERE user_id = $1', [req.user.id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Курьер не найден' });
//     }
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Ошибка получения курьера:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для обновления статуса курьера
// app.put('/couriers/me/status', isAuthenticated, async (req, res) => {
//   const { status } = req.body;
//   const userId = req.user.id;

//   try {
//     const result = await pool.query(
//       'UPDATE couriers SET status = $1 WHERE user_id = $2 RETURNING *',
//       [status, userId]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Ошибка обновления статуса курьера:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для обновления данных курьера
// app.get('/couriers/me', isAuthenticated, async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const result = await pool.query(
//       'SELECT * FROM couriers WHERE user_id = $1',
//       [userId]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Ошибка получения данных курьера:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для добавления нового продукта
// app.post('/products', upload.single('image'), isAdmin, async (req, res) => {
//   const { nameEn, nameRu, nameGeo, price } = req.body;
//   const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

//   try {
//     const newProduct = await pool.query(
//       'INSERT INTO products (name_en, name_ru, name_geo, price, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//       [nameEn, nameRu, nameGeo, price, imageUrl]
//     );
//     const product = {
//       ...newProduct.rows[0],
//       name: {
//         en: newProduct.rows[0].name_en,
//         ru: newProduct.rows[0].name_ru,
//         geo: newProduct.rows[0].name_geo
//       }
//     };
//     res.json(product);
//   } catch (err) {
//     console.error('Ошибка добавления продукта:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для удаления продукта
// app.delete('/products/:id', isAdmin, async (req, res) => {
//   const { id } = req.params;
//   try {
//     await pool.query('DELETE FROM products WHERE id = $1', [id]);
//     res.status(204).end();
//   } catch (err) {
//     console.error('Ошибка удаления продукта:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для обновления информации о доставке
// app.put('/user/me/delivery-option', isAuthenticated, async (req, res) => {
//   const { deliveryOption } = req.body;
//   const userId = req.user.id;

//   try {
//     const result = await pool.query(
//       'UPDATE users SET delivery_option = $1 WHERE id = $2 RETURNING *',
//       [deliveryOption, userId]
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Ошибка обновления опции доставки:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для получения текущего режима доставки пользователя
// app.get('/user/me/delivery-option', isAuthenticated, async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const result = await pool.query('SELECT delivery_option FROM users WHERE id = $1', [userId]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Пользователь не найден' });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Ошибка получения опции доставки:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для обновления опции доставки для активных заказов
// app.put('/orders/update-delivery-mode', isAuthenticated, async (req, res) => {
//   const { deliveryOption } = req.body;

//   try {
//     const result = await pool.query(
//       'UPDATE orders SET delivery_option = $1 WHERE status = $2 RETURNING *',
//       [deliveryOption, 'pending']
//     );

//     res.json(result.rows);
//   } catch (err) {
//     console.error('Ошибка обновления опции доставки для активных заказов:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для обновления режима доставки для конкретного заказа
// app.put('/orders/:id/delivery-option', isAuthenticated, async (req, res) => {
//   const { id } = req.params;
//   const { deliveryOption } = req.body;

//   try {
//     const result = await pool.query(
//       'UPDATE orders SET delivery_option = $1 WHERE id = $2 RETURNING *',
//       [deliveryOption, id]
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Ошибка обновления опции доставки:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для обновления роли пользователя
// app.put('/users/:id/role', isAdmin, async (req, res) => {
//   const { id } = req.params;
//   const { role } = req.body;

//   console.log(`Updating role for user ${id} to ${role}`); // Логирование значения роли

//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');

//     // Обновление роли пользователя
//     const userUpdateResult = await client.query(
//       'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
//       [role, id]
//     );

//     const updatedUser = userUpdateResult.rows[0];
//     // Если роль обновляется на "courier", добавляем данные в таблицу couriers
//     if (role === 'courier') {
//       await client.query(
//         'INSERT INTO couriers (user_id, first_name, last_name, email, address, phone, telegram_username) VALUES ($1, $2, $3, $4, $5, $6, $7)',
//         [updatedUser.id, updatedUser.first_name, updatedUser.last_name, updatedUser.email, updatedUser.address, updatedUser.phone, updatedUser.telegram_username]
//       );
//     }

//     await client.query('COMMIT');
//     res.json(updatedUser);
//   } catch (err) {
//     await client.query('ROLLBACK');
//     console.error('Ошибка обновления роли пользователя:', err.message);
//     res.status(500).send('Ошибка сервера');
//   } finally {
//     client.release();
//   }
// });

// // Маршрут для получения всех курьеров со статусом "working"
// app.get('/couriers/working', isAuthenticated, async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM couriers WHERE status = $1', ['working']);
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Ошибка получения курьеров со статусом working:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для обновления статуса заказа и назначения курьера
// app.put('/orders/:id/assign-courier', isAuthenticated, async (req, res) => {
//   const { id } = req.params;
//   const { courierId } = req.body;

//   try {
//     const result = await pool.query(
//       'UPDATE orders SET courier_id = $1, status = $2 WHERE id = $3 RETURNING *',
//       [courierId, 'courier_assigned', id]
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Ошибка при назначении курьера и обновлении статуса заказа:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для обновления продукта
// app.put('/products/:id', upload.single('image'), isAdmin, async (req, res) => {
//   const { id } = req.params;
//   const { nameEn, nameRu, nameGeo, price } = req.body;
//   const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

//   try {
//     const updatedProduct = await pool.query(
//       'UPDATE products SET name_en = $1, name_ru = $2, name_geo = $3, price = $4, image_url = $5 WHERE id = $6 RETURNING *',
//       [nameEn, nameRu, nameGeo, price, imageUrl, id]
//     );
//     const product = {
//       ...updatedProduct.rows[0],
//       name: {
//         en: updatedProduct.rows[0].name_en,
//         ru: updatedProduct.rows[0].name_ru,
//         geo: updatedProduct.rows[0].name_geo
//       }
//     };
//     res.json(product);
//   } catch (err) {
//     console.error('Ошибка обновления продукта:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для регистрации пользователя
// app.post('/auth/register', async (req, res) => {
//   const { firstName, lastName, email, address, phone, password } = req.body;
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(password, salt);

//     const result = await pool.query(
//       'INSERT INTO users (first_name, last_name, email, address, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name, last_name, email, address, phone, role',
//       [firstName, lastName, email, address, phone, passwordHash, 'user']
//     );

//     const user = result.rows[0];
//     res.status(201).json(user);
//   } catch (err) {
//     console.error('Ошибка регистрации пользователя:', err.message);

//     if (err.code === '23505') {
//       return res.status(400).json({ error: 'Email уже используется' });
//     }
//     res.status(500).json({ error: 'Ошибка сервера', message: err.message });
//   }
// });

// // Маршрут для входа пользователя
// app.post('/auth/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const result = await pool.query('SELECT * FROM users WHERE email = $1 OR phone = $2', [username, username]);
//     if (result.rows.length === 0) {
//       return res.status(400).json({ message: 'Неверные учетные данные' });
//     }

//     const user = result.rows[0];
//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Неверные учетные данные' });
//     }

//     const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key', { expiresIn: '1h' });
//     res.json({ token, user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, address: user.address, phone: user.phone, role: user.role } });
//   } catch (err) {
//     console.error('Ошибка входа пользователя:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для получения информации о текущем пользователе
// app.get('/auth/me', isAuthenticated, (req, res) => {
//   pool.query('SELECT id, first_name, last_name, email, address, phone, role FROM users WHERE id = $1', [req.user.id])
//     .then(result => {
//       if (result.rows.length === 0) {
//         return res.status(404).json({ message: 'Пользователь не найден' });
//       }
//       const user = result.rows[0];
//       res.json({ user });
//     })
//     .catch(err => {
//       console.error('Ошибка при получении данных пользователя:', err.message);
//       res.status(500).json({ message: 'Ошибка сервера' });
//     });
// });

// // Маршрут для обновления данных пользователя (например, адреса)
// app.put('/api/users/:id', isAuthenticated, async (req, res) => {
//   const { id } = req.params;
//   const { address } = req.body;

//   if (req.user.id !== parseInt(id, 10)) {
//     return res.status(403).json({ message: 'Нет доступа к изменению данного пользователя' });
//   }

//   try {
//     const result = await pool.query(
//       'UPDATE users SET address = $1 WHERE id = $2 RETURNING *',
//       [address, id]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Ошибка при обновлении пользователя:', err.message);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

// // Маршрут для создания заказа
// app.post('/orders', async (req, res) => {
//   const { userId, items, total, deliveryTime, deliveryAddress } = req.body;

//   try {
//     const userResult = await pool.query('SELECT first_name, last_name, address FROM users WHERE id = $1', [userId]);
//     const user = userResult.rows[0];

//     const orderResult = await pool.query(
//       'INSERT INTO orders (user_id, items, total, delivery_time, delivery_address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//       [userId, JSON.stringify(items), total, deliveryTime || null, deliveryAddress || user.address]
//     );

//     const orderId = orderResult.rows[0].id;

//     const productIds = items.map(item => item.productId);
//     const productResult = await pool.query('SELECT id, name_en FROM products WHERE id = ANY($1)', [productIds]);

//     const products = productResult.rows.reduce((acc, product) => {
//       acc[product.id] = product.name_en;
//       return acc;
//     }, {});

//     const newOrder = {
//       ...orderResult.rows[0],
//       first_name: user.first_name,
//       last_name: user.last_name,
//       address: user.address,
//       items: items.map(item => ({
//         ...item,
//         productName: products[item.productId]
//       }))
//     };

//     io.emit('newOrder', newOrder);
//     res.status(201).json(newOrder);
//   } catch (error) {
//     console.error('Ошибка при оформлении заказа:', error.message);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

// // Маршрут для обновления статуса заказа
// app.put('/orders/:id/status', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     await pool.query(
//       'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
//       [status, id]
//     );

//     const result = await pool.query(`
//       SELECT 
//         o.id AS order_id, 
//         o.user_id, 
//         u.first_name, 
//         u.last_name, 
//         u.address, 
//         o.items, 
//         o.total, 
//         o.status, 
//         o.created_at,
//         o.delivery_time,
//         p.id AS product_id,
//         p.name_en AS product_name
//       FROM orders o
//       JOIN users u ON o.user_id = u.id
//       JOIN LATERAL jsonb_array_elements(o.items) item ON true
//       JOIN products p ON item->>'productId' = p.id::text
//       WHERE o.id = $1
//     `, [id]);

//     const updatedOrder = result.rows.reduce((acc, row) => {
//       if (!acc) {
//         acc = {
//           id: row.order_id,
//           user_id: row.user_id,
//           first_name: row.first_name,
//           last_name: row.last_name,
//           address: row.address,
//           total: row.total,
//           status: row.status,
//           created_at: row.created_at,
//           items: []
//         };
//       }
//       acc.items.push({
//         productId: row.product_id,
//         productName: row.product_name,
//         quantity: row.items.find(i => i.productId === row.product_id).quantity
//       });
//       return acc;
//     }, null);

//     io.emit('orderUpdated', updatedOrder);
//     res.status(200).json(updatedOrder);
//   } catch (error) {
//     console.error('Ошибка при обновлении статуса заказа:', error.message);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

// // Маршрут для обновления количества товаров в заказе
// app.put('/orders/:id/items', isAuthenticated, async (req, res) => {
//   const { id } = req.params;
//   const { items } = req.body;

//   try {
//     const result = await pool.query(
//       'UPDATE orders SET items = $1 WHERE id = $2 RETURNING *',
//       [JSON.stringify(items), id]
//     );

//     const updatedOrder = result.rows[0];
//     io.emit('orderUpdated', updatedOrder);
//     res.status(200).json(updatedOrder);
//   } catch (error) {
//     console.error('Ошибка при обновлении количества товаров:', error.message);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

// // Маршрут для получения всех заказов
// app.get('/orders', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT 
//         o.id AS order_id, 
//         o.user_id, 
//         u.first_name, 
//         u.last_name, 
//         u.address, 
//         u.phone,
//         o.items, 
//         o.total, 
//         o.status, 
//         o.created_at,
//         o.delivery_time,
//         o.delivery_option,
//         p.id AS product_id,
//         p.name_en AS product_name
//       FROM orders o
//       JOIN users u ON o.user_id = u.id
//       JOIN LATERAL jsonb_array_elements(o.items) item ON true
//       JOIN products p ON item->>'productId' = p.id::text
//     `);

//     const orders = result.rows.reduce((acc, row) => {
//       const order = acc.find(o => o.id === row.order_id);
//       if (order) {
//         order.items.push({
//           productId: row.product_id,
//           productName: row.product_name,
//           quantity: row.items.find(i => i.productId === row.product_id).quantity
//         });
//       } else {
//         acc.push({
//           id: row.order_id,
//           user_id: row.user_id,
//           first_name: row.first_name,
//           last_name: row.last_name,
//           address: row.address,
//           phone: row.phone,
//           total: row.total,
//           status: row.status,
//           created_at: row.created_at,
//           delivery_time: row.delivery_time,
//           delivery_option: row.delivery_option,
//           items: [{
//             productId: row.product_id,
//             productName: row.product_name,
//             quantity: row.items.find(i => i.productId === row.product_id).quantity
//           }]
//         });
//       }
//       return acc;
//     }, []);

//     res.json(orders);
//   } catch (err) {
//     console.error('Ошибка получения заказов:', err.message);
//     res.status(500).json({ error: 'Ошибка сервера', message: err.message });
//   }
// });

// // Маршрут для получения заказов текущего пользователя
// app.get('/api/orders/me', isAuthenticated, async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT * FROM orders WHERE user_id = $1',
//       [req.user.id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Ошибка получения заказов пользователя:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Маршрут для получения всех пользователей
// app.get('/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT id, first_name, last_name, email, address, phone, telegram_username, role FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Ошибка получения пользователей:', err.message);
//     res.status(500).send('Ошибка сервера');
//   }
// });

// // Подключение статических файлов
// app.use('/uploads', express.static('uploads'));

// // Маршрут для обслуживания фронтенда
// app.use(express.static(path.join(__dirname, 'build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// // Запуск сервера
// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Сервер работает на порту ${PORT}`);
// });

// io.on('connection', (socket) => {
//   console.log('Новое подключение');

//   socket.on('disconnect', () => {
//     console.log('Отключение');
//   });
// });
