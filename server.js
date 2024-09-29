require('dotenv').config();
const express = require('express');
const http = require('http');
const pool = require('./db');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const crypto = require('crypto');
const sendResetPasswordEmail = require('./mailer');
const { v4: uuidv4 } = require('uuid')
const passport = require('./passport-config'); // Импортируем модуль
const { createPayment, handlePaymentCallback, verifyCallbackSignature, temporaryOrders } = require('./paymentService');


console.log('Поддерживаемые форматы изображений:', sharp.format);


// cерверные коды 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.PUBLIC_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const corsOptions = {
  origin: process.env.PUBLIC_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
};

// Настройки CORS
app.use(cors(corsOptions));

// Middleware для обработки JSON
app.use(express.json());

// Middleware для заголовков CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.PUBLIC_URL);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(passport.initialize());

// Маршруты для аутентификации через Google
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     const token = jwt.sign({ id: req.user.id, role: req.user.role }, 'secret_key', { expiresIn: '1h' });
//     res.redirect(`${process.env.PUBLIC_URL}/auth/success?token=${token}`);
//   }
// );


// Конфигурация multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Загрузка файла, оригинальное имя:', file.originalname);
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const generatedFilename = Date.now() + '-' + file.originalname;
    console.log('Сгенерированное имя файла:', generatedFilename);
    cb(null, generatedFilename);
  }
});

const upload = multer({ storage: storage });

// Middleware для проверки, является ли пользователь администратором
const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ error: 'Доступ запрещен.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'Доступ запрещен.' });
  }

  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.user = decoded;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен.' });
    }
    next();
  } catch (error) {
    console.error('Ошибка при проверке токена:', error.message);
    res.status(400).json({ error: 'Неверный токен.' });
  }
};


// Middleware для проверки авторизации пользователя
const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader);

  if (!authHeader) {
    console.error('Отсутствует заголовок Authorization');
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Extracted Token:', token);

  if (!token) {
    console.error('Токен не найден в заголовке Authorization');
    return res.status(401).json({ message: 'Токен не найден' });
  }

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) {
      console.error('Ошибка при проверке токена:', err.message);
      return res.status(403).json({ message: 'Недействительный токен' });
    }
    req.user = user;
    console.log('Пользователь аутентифицирован:', user);
    next();
  });
};

module.exports = isAuthenticated;


// Маршрут для запроса сброса пароля
app.post('/auth/request-reset-password', async (req, res) => {
  const { email } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    await pool.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
      [token, expires, user.id]
    );

    sendResetPasswordEmail(user.email, token);
    res.status(200).json({ message: 'Reset password email sent' });
  } catch (err) {
    console.error('Error requesting password reset:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// Маршрут для сброса пароля
app.post('/auth/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2',
      [token, new Date()]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = userResult.rows[0];
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await pool.query(
      'UPDATE users SET password_hash = $1, reset_password_token = $2, reset_password_expires = $3 WHERE id = $4',
      [passwordHash, null, null, user.id]
    );

    res.status(200).json({ message: 'Password has been reset' });
  } catch (err) {
    console.error('Error resetting password:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Маршрут для получения всех продуктов
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    const products = result.rows.map((product) => ({
      ...product,
      image_url: product.image_url ? path.basename(product.image_url) : null,
      name: {
        en: product.name_en,
        ru: product.name_geo,
        geo: product.name_geo
      }
    }));
    res.json(products);
  } catch (err) {
    console.error('Ошибка получения продуктов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для получения всех курьеров
app.get('/couriers', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM couriers');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения курьеров:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для получения данных о конкретном курьере
app.get('/couriers/me', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM couriers WHERE user_id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Курьер не найден' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка получения курьера:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для создания платежа
app.post('/create-payment', isAuthenticated, async (req, res) => {
  const { total, items } = req.body;

  if (!total || !items || items.length === 0) {
    console.error('Некорректные данные для создания платежа:', req.body);
    return res.status(400).json({ error: 'Некорректные данные для создания платежа' });
  }

  try {
    console.log('Попытка создать платеж с данными:', { total, items });
    const { paymentUrl, receiptUrl } = await createPayment(total, items, externalOrderId);
    console.log('Платеж успешно создан, URL:', paymentUrl);
    res.json({ payment_url: paymentUrl });
  } catch (error) {
    console.error('Ошибка при создании платежа:', error.message);
    res.status(500).json({ error: 'Ошибка создания платежа' });
  }
});

// Маршрут для обработки обратного вызова
app.post('/payment/callback', async (req, res) => {
  const { event, body } = req.body;

  console.log('Получен обратный вызов с данными:', req.body); // Логируем полный ответ

  try {
    const result = await handlePaymentCallback(event, body);
    console.log('Обратный вызов обработан успешно:', result); // Логируем успешную обработку
    res.status(200).json(result);
  } catch (error) {
    console.error('Ошибка обработки обратного вызова:', error.message); // Логируем ошибки
    res.status(500).json({ message: error.message });
  }
});

// Маршрут для обновления статуса курьера
app.put('/couriers/me/status', isAuthenticated, async (req, res) => {
  const { status } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'UPDATE couriers SET status = $1 WHERE user_id = $2 RETURNING *',
      [status, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка обновления статуса курьера:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для обновления данных курьера
app.get('/couriers/me', isAuthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM couriers WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка получения данных курьера:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для добавления нового продукта
app.post('/products', upload.single('image'), isAdmin, async (req, res) => {
  try {
    console.log('POST /products - Начало обработки запроса');
    const { nameEn, nameRu, nameGeo, unit } = req.body;
    let { price, step } = req.body;

    console.log('Полученные данные:', { nameEn, nameRu, nameGeo, price, unit, step });

    // Преобразование price и step в числа
    price = parseFloat(price);
    step = parseFloat(step);

    // Обработка discounts
    let discounts = [];
    try {
      discounts = req.body.discounts ? JSON.parse(req.body.discounts) : [];
    } catch (err) {
      console.error('Ошибка при разборе discounts:', err.message);
      discounts = [];
    }
    console.log('Скидки:', discounts);

    let imageUrl = null;

    if (req.file) {
      console.log('Файл получен:', req.file);
      const fileInfo = path.parse(req.file.filename);
      const webpFileName = `${fileInfo.name}.webp`;
      const webpImagePath = path.join('uploads', webpFileName);

      try {
        console.log('Преобразование изображения в WebP...');
        await sharp(req.file.path)
          .webp({ quality: 80 })
          .toFile(webpImagePath);

        // Удаляем оригинальный файл
        fs.unlinkSync(req.file.path);
        console.log(`Изображение успешно преобразовано и сохранено как ${webpFileName}. Оригинал удалён.`);

        imageUrl = webpFileName;
      } catch (err) {
        console.error('Ошибка при конвертации изображения в WebP:', err.message);
        imageUrl = req.file.filename;
      }
    } else {
      console.log('Файл изображения не был загружен.');
    }

    console.log('Сохранение продукта в базе данных...');
    const result = await pool.query(
      'INSERT INTO products (name_en, name_ru, name_geo, price, image_url, unit, step, discounts) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        nameEn,
        nameRu,
        nameGeo,
        price,
        imageUrl ? `/uploads/${imageUrl}` : null,
        unit,
        unit === 'g' ? step : null,
        discounts,
      ]
    );

    const newProduct = result.rows[0];
    const product = {
      ...newProduct,
      name: {
        en: newProduct.name_en,
        ru: newProduct.name_ru,
        geo: newProduct.name_geo,
      },
    };

    res.status(200).json(product);
  } catch (err) {
    console.error('Ошибка при обработке запроса:', err.message);
    console.error(err.stack);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для обслуживания изображений
app.get('/images/:filename', async (req, res) => {
  console.log('GET /images - Запрос изображения:', req.params.filename);
  const filename = path.basename(req.params.filename);
  const { width } = req.query;
  const accept = req.headers.accept || '';
  console.log('Запрос ширины изображения:', width);
  console.log('Accept заголовок:', accept);

  // Определяем, поддерживает ли клиент WebP
  let format = 'jpeg'; // Формат по умолчанию
  if (accept.includes('image/webp')) {
    format = 'webp';
  }
  console.log('Выбранный формат изображения:', format);

  const imagePath = path.join(__dirname, 'uploads', `${filename}`);
  if (!fs.existsSync(imagePath)) {
    console.error('Изображение не найдено:', imagePath);
    res.status(404).send('Изображение не найдено');
    return;
  }

  try {
    console.log('Начало обработки изображения...');
    let transformer = sharp(imagePath);

    if (width) {
      console.log('Изменение размера изображения до ширины:', width);
      transformer = transformer.resize(parseInt(width));
    }

    transformer = transformer.toFormat(format);
    res.set('Cache-Control', 'public, max-age=31536000');
    res.type(`image/${format}`);
    transformer.pipe(res);
    console.log('Изображение успешно отправлено.');
  } catch (err) {
    console.error('Ошибка при обработке изображения:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для удаления продукта
app.delete('/products/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error('Ошибка удаления продукта:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для обновления информации о доставке
app.put('/user/me/delivery-option', isAuthenticated, async (req, res) => {
  const { deliveryOption } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'UPDATE users SET delivery_option = $1 WHERE id = $2 RETURNING *',
      [deliveryOption, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка обновления опции доставки:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для получения текущего режима доставки пользователя
app.get('/user/me/delivery-option', isAuthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query('SELECT delivery_option FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка получения опции доставки:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для обновления опции доставки для активных заказов
app.put('/orders/update-delivery-mode', isAuthenticated, async (req, res) => {
  const { deliveryOption } = req.body;

  try {
    const result = await pool.query(
      'UPDATE orders SET delivery_option = $1 WHERE status = $2 RETURNING *',
      [deliveryOption, 'pending']
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка обновления опции доставки для активных заказов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для обновления режима доставки для конкретного заказа
app.put('/orders/:id/delivery-option', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { deliveryOption } = req.body;

  try {
    const result = await pool.query(
      'UPDATE orders SET delivery_option = $1 WHERE id = $2 RETURNING *',
      [deliveryOption, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка обновления опции доставки:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для обновления роли пользователя
app.put('/users/:id/role', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  console.log(`Updating role for user ${id} to ${role}`); // Логирование значения роли

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Обновление роли пользователя
    const userUpdateResult = await client.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
      [role, id]
    );

    const updatedUser = userUpdateResult.rows[0];
    // Если роль обновляется на "courier", добавляем данные в таблицу couriers
    if (role === 'courier') {
      await client.query(
        'INSERT INTO couriers (user_id, first_name, last_name, email, address, phone, telegram_username) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [updatedUser.id, updatedUser.first_name, updatedUser.last_name, updatedUser.email, updatedUser.address, updatedUser.phone, updatedUser.telegram_username]
      );
    }

    await client.query('COMMIT');
    res.json(updatedUser);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Ошибка обновления роли пользователя:', err.message);
    res.status(500).send('Ошибка сервера');
  } finally {
    client.release();
  }
});

// Маршрут для получения всех курьеров со статусом "working"
app.get('/couriers/working', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM couriers WHERE status = $1', ['working']);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения курьеров со статусом working:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для обновления статуса заказа и назначения курьера
app.put('/orders/:id/assign-courier', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { courierId } = req.body;

  try {
    const result = await pool.query(
      'UPDATE orders SET courier_id = $1, status = $2 WHERE id = $3 RETURNING *',
      [courierId, 'courier_assigned', id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при назначении курьера и обновлении статуса заказа:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для обновления продукта
app.put('/products/:id', upload.single('image'), isAdmin, async (req, res) => {
  const { id } = req.params;
  const { nameEn, nameRu, nameGeo, price, unit, step } = req.body; // Добавили unit и step
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const discounts = req.body.discounts ? JSON.parse(req.body.discounts) : [];


  try {
    // Получаем текущие данные продукта
    const currentProductResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (currentProductResult.rows.length === 0) {
      return res.status(404).send('Продукт не найден');
    }

    const currentProduct = currentProductResult.rows[0];

    // Используем старое изображение, если новое не загружено
    const finalImageUrl = imageUrl || currentProduct.image_url;

    // Обновляем продукт
    const updatedProductResult = await pool.query(
      'UPDATE products SET name_en = $1, name_ru = $2, name_geo = $3, price = $4, image_url = $5, unit = $6, step = $7, discounts = $8 WHERE id = $9 RETURNING *',
      [
        nameEn,
        nameRu,
        nameGeo,
        price,
        finalImageUrl,
        unit,
        unit === 'g' ? step : null,
        discounts,
        id,
      ]
    );

    const updatedProduct = updatedProductResult.rows[0];

    const product = {
      ...updatedProduct,
      name: {
        en: updatedProduct.name_en,
        ru: updatedProduct.name_ru,
        geo: updatedProduct.name_geo,
      },
    };
    res.json(product);
  } catch (err) {
    console.error('Ошибка обновления продукта:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для регистрации пользователя
app.post('/auth/register', async (req, res) => {
  const { firstName, lastName, email, address, phone, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, address, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name, last_name, email, address, phone, role',
      [firstName, lastName, email, address, phone, passwordHash, 'user']
    );

    const user = result.rows[0];
    res.status(201).json(user);
  } catch (err) {
    console.error('Ошибка регистрации пользователя:', err.message);

    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email уже используется' });
    }
    res.status(500).json({ error: 'Ошибка сервера', message: err.message });
  }
});

// Маршрут для входа пользователя
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 OR phone = $2', [username, username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key', { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, address: user.address, phone: user.phone, role: user.role } });
  } catch (err) {
    console.error('Ошибка входа пользователя:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для получения информации о текущем пользователе
app.get('/auth/me', isAuthenticated, (req, res) => {
  pool.query('SELECT id, first_name, last_name, email, address, phone, role FROM users WHERE id = $1', [req.user.id])
    .then(result => {
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      const user = result.rows[0];
      res.json({ user });
    })
    .catch(err => {
      console.error('Ошибка при получении данных пользователя:', err.message);
      res.status(500).json({ message: 'Ошибка сервера' });
    });
});

// Маршрут для обновления данных пользователя (например, адреса)
app.put('/api/users/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { address } = req.body;

  if (req.user.id !== parseInt(id, 10)) {
    return res.status(403).json({ message: 'Нет доступа к изменению данного пользователя' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET address = $1 WHERE id = $2 RETURNING *',
      [address, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при обновлении пользователя:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


// Маршрут для инициирования платежа
app.post('/orders', async (req, res) => {
  const { userId, items, total, deliveryTime, deliveryAddress } = req.body;

  try {
    console.log('Получен userId:', userId);

    // Проверяем, существует ли пользователь
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    // Генерируем уникальный externalOrderId
    const externalOrderId = uuidv4();

 // Инициируем платёж, передавая externalOrderI
 const { paymentUrl, receiptUrl } = await createPayment(total, items, externalOrderId);

    // Сохраняем данные заказа временно
    temporaryOrders[externalOrderId] = {
      userId,
      items,
      total,
      deliveryTime,
      deliveryAddress,
      receiptUrl ,
    };

   
    // Возвращаем URL для перенаправления пользователя на страницу оплаты
    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error('Ошибка при инициировании платежа:', error.message);
    res.status(500).json({ error: 'Не удалось инициировать платёж' });
  }
});

// Маршрут для обработки обратного вызова от Банка Грузии
app.post('/payment/callback', async (req, res) => {
  const callbackSignature = req.headers['callback-signature'];
  const callbackData = req.body;

  try {
    // Проверка подписи
    const isValid = verifyCallbackSignature(callbackData, callbackSignature);
    if (!isValid) {
      console.error('Неверная подпись обратного вызова');
      return res.status(400).json({ error: 'Неверная подпись' });
    }

    // Обработка данных обратного вызова
    const result = await handlePaymentCallback(callbackData.event, callbackData.body);

    // Возвращаем 200 OK, подтверждая успешную обработку
    res.status(200).json({ message: 'Callback обработан успешно' });
  } catch (error) {
    console.error('Ошибка при обработке callback:', error.message);
    res.status(500).json({ error: 'Ошибка обработки callback' });
  }
});

// работа с чеками 
app.get('/payment/receipt/:orderId', isAuthenticated, async (req, res) => {
  console.log('Authenticated user:', req.user);
  const { orderId } = req.params;
  console.log(`Получен запрос на получение чека для заказа с ID: ${orderId}`);
  console.log('Authenticated user:', req.user);
  try {
    console.log(`Получен запрос на получение чека для заказа с ID: ${orderId}`);
    
    // Получаем заказ из базы данных
    console.log('Запрос к базе данных для получения заказа...');
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    const order = orderResult.rows[0];

    if (!order) {
      console.error(`Заказ с ID ${orderId} не найден в базе данных.`);
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    console.log(`Заказ с ID ${orderId} найден:`, order);

    // Проверяем, что пользователь запрашивает свой заказ
    console.log('Проверка, что заказ принадлежит текущему пользователю...');
    if (order.user_id !== req.user.id) {
      console.error(`Доступ запрещен для пользователя с ID ${req.user.id}.`);
      return res.status(403).json({ error: 'Доступ запрещён' });
    }

    console.log('Пользователь имеет права на получение чека.');

    // Получаем актуальный accessToken
    console.log('Получаем accessToken для запроса чека у банка...');
    const accessToken = await getAccessToken();
    console.log('accessToken успешно получен:', accessToken);

    // Запрашиваем чек у банка
    console.log(`Запрос чека по URL ${order.receipt_url}...`);
    const response = await axios.get(order.receipt_url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer', // Важно для получения бинарных данных
    });

    console.log(`Чек успешно получен от банка, статус ответа: ${response.status}`);
    
    // Логируем часть данных чека для проверки
    console.log('Первые 100 байт данных чека:', response.data.slice(0, 100));

    // Отправляем чек клиенту
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'attachment; filename="receipt.pdf"');
    res.send(response.data);
  } catch (error) {
    console.error(`Ошибка при получении чека для заказа ${orderId}:`, error.message);
    res.status(500).json({ error: 'Не удалось получить чек' });
  }
});

// Маршрут для обновления статуса заказа
app.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    const result = await pool.query(`
      SELECT 
        o.id AS order_id, 
        o.user_id, 
        u.first_name, 
        u.last_name, 
        u.address, 
        o.items, 
        o.total, 
        o.status, 
        o.created_at,
        o.delivery_time,
        p.id AS product_id,
        p.name_en AS product_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN LATERAL jsonb_array_elements(o.items) item ON true
      JOIN products p ON item->>'productId' = p.id::text
      WHERE o.id = $1
    `, [id]);

    const updatedOrder = result.rows.reduce((acc, row) => {
      if (!acc) {
        acc = {
          id: row.order_id,
          user_id: row.user_id,
          first_name: row.first_name,
          last_name: row.last_name,
          address: row.address,
          total: row.total,
          status: row.status,
          created_at: row.created_at,
          items: []
        };
      }
      acc.items.push({
        productId: row.product_id,
        productName: row.product_name,
        quantity: row.items.find(i => i.productId === row.product_id).quantity
      });
      return acc;
    }, null);

    io.emit('orderUpdated', updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Ошибка при обновлении статуса заказа:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для обновления количества товаров в заказе
app.put('/orders/:id/items', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  try {
    const result = await pool.query(
      'UPDATE orders SET items = $1 WHERE id = $2 RETURNING *',
      [JSON.stringify(items), id]
    );

    const updatedOrder = result.rows[0];
    io.emit('orderUpdated', updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Ошибка при обновлении количества товаров:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для получения всех заказов
app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id AS order_id, 
        o.user_id, 
        u.first_name, 
        u.last_name, 
        u.address, 
        u.phone,
        o.items, 
        o.total, 
        o.status, 
        o.created_at,
        o.delivery_time,
        o.delivery_option,
        p.id AS product_id,
        p.name_en AS product_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN LATERAL jsonb_array_elements(o.items) item ON true
      JOIN products p ON item->>'productId' = p.id::text
    `);

    const orders = result.rows.reduce((acc, row) => {
      const order = acc.find(o => o.id === row.order_id);
      if (order) {
        order.items.push({
          productId: row.product_id,
          productName: row.product_name,
          quantity: row.items.find(i => i.productId === row.product_id).quantity
        });
      } else {
        acc.push({
          id: row.order_id,
          user_id: row.user_id,
          first_name: row.first_name,
          last_name: row.last_name,
          address: row.address,
          phone: row.phone,
          total: row.total,
          status: row.status,
          created_at: row.created_at,
          delivery_time: row.delivery_time,
          delivery_option: row.delivery_option,
          items: [{
            productId: row.product_id,
            productName: row.product_name,
            quantity: row.items.find(i => i.productId === row.product_id).quantity
          }]
        });
      }
      return acc;
    }, []);

    res.json(orders);
  } catch (err) {
    console.error('Ошибка получения заказов:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', message: err.message });
  }
});

// Маршрут для получения заказов текущего пользователя
app.get('/api/orders/me', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения заказов пользователя:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});



// Маршрут для получения всех пользователей
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, first_name, last_name, email, address, phone, telegram_username, role FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения пользователей:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Подключение статических файлов
app.use('/uploads', express.static('uploads'));

// Маршрут для обслуживания фронтенд
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Запуск сервера
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('Новое подключение');

  socket.on('disconnect', () => {
    console.log('Отключение');
  });
});
server.js