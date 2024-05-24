// const express = require('express');
// const pool = require('./db');
// const multer = require('multer');
// const path = require('path');
// const app = express();
// const { bot, users } = require('./telegramBot');  

// app.use(express.json());
// app.use(bodyParser.json());
// /// telegram test 
// app.post('/auth/telegram', (req, res) => {
//   const { id, first_name, last_name, username, auth_date, hash } = req.body;
//   const dataCheckString = `auth_date=${auth_date}\nid=${id}\nfirst_name=${first_name}\nlast_name=${last_name}${username ? `\nusername=${username}` : ''}`;
//   const secretKey = crypto.createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest();
//   const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  
//   if (hmac === hash) {
//     const user = { id, first_name, last_name, username };
//     users.push(user);
//     res.json({ isAuthenticated: true });
//   } else {
//     res.json({ isAuthenticated: false });
//   }
// });

// // Настройка multer для хранения файлов
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Путь для хранения загруженных файлов
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Имя файла
//   }
// });

// const upload = multer({ storage: storage });

// // Маршрут для проверки авторизации пользователя через Telegram
// app.get('/auth/telegram', (req, res) => {
//   const chatId = req.query.chatId;

//   const user = users.find(user => user.chatId == chatId);
//   if (user) {
//     res.send('User is authenticated');
//   } else {
//     res.send('User is not authenticated');
//   }
// });

// // Маршрут для получения всех товаров
// app.get('/products', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM products');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // Маршрут для добавления нового товара
// // app.post('/products', upload.single('image'), async (req, res) => {
// //   try {
// //     const { name, price } = req.body;
// //     const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

// //     const newProduct = await pool.query(
// //       'INSERT INTO products (name, price, image_url) VALUES ($1, $2, $3) RETURNING *',
// //       [name, price, imageUrl]
// //     );
// //     res.json(newProduct.rows[0]);
// //   } catch (err) {
// //     console.error(err.message);
// //     res.status(500).send('Server Error');
// //   }
// // });
// app.post('/products', upload.single('image'), async (req, res) => {
//   const { name, price } = req.body;
//   const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

//   try {
//     const newProduct = await pool.query(
//       'INSERT INTO products (name, price, image_url) VALUES ($1, $2, $3) RETURNING *',
//       [name, price, imageUrl]
//     );
//     res.json(newProduct.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });


// // Маршрут для удаления продукта
// app.delete('/products/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     await pool.query('DELETE FROM products WHERE id = $1', [id]);
//     res.status(204).end();
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // Маршрут для обновления продукта
// app.put('/products/:id', upload.single('image'), async (req, res) => {
//   const { id } = req.params;
//   const { name, price } = req.body;
//   const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

//   try {
//     const updatedProduct = await pool.query(
//       'UPDATE products SET name = $1, price = $2, image_url = $3 WHERE id = $4 RETURNING *',
//       [name, price, imageUrl, id]
//     );
//     res.json(updatedProduct.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// app.use('/uploads', express.static('uploads')); // Для обслуживания загруженных файлов

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });


const express = require('express');
const pool = require('./db');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');  // Не забудьте добавить этот импорт
const bodyParser = require('body-parser');  // Не забудьте добавить этот импорт
const app = express();
// const { bot, users } = require('./telegramBot');


app.use(express.json());
app.use(bodyParser.json());

// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Убедитесь, что вы установили переменную окружения TELEGRAM_BOT_TOKEN

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.post('/auth/telegram', (req, res) => {
  const { id, first_name, last_name, username, auth_date, hash } = req.body;
  const dataCheckString = `auth_date=${auth_date}\nid=${id}\nfirst_name=${first_name}\nlast_name=${last_name}${username ? `\nusername=${username}` : ''}`;
  const secretKey = crypto.createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  
  if (hmac === hash) {
    const user = { id, first_name, last_name, username };
    users.push(user);
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Настройка multer для хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Путь для хранения загруженных файлов
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Имя файла
  }
});

const upload = multer({ storage: storage });

// Маршрут для проверки авторизации пользователя через Telegram
app.get('/auth/telegram', (req, res) => {
  const chatId = req.query.chatId;

  const user = users.find(user => user.chatId == chatId);
  if (user) {
    res.send('User is authenticated');
  } else {
    res.send('User is not authenticated');
  }
});

// Маршрут для получения всех товаров
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Маршрут для добавления нового товара
app.post('/products', upload.single('image'), async (req, res) => {
  const { name, price } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newProduct = await pool.query(
      'INSERT INTO products (name, price, image_url) VALUES ($1, $2, $3) RETURNING *',
      [name, price, imageUrl]
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Маршрут для удаления продукта
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Маршрут для обновления продукта
app.put('/products/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const updatedProduct = await pool.query(
      'UPDATE products SET name = $1, price = $2, image_url = $3 WHERE id = $4 RETURNING *',
      [name, price, imageUrl, id]
    );
    res.json(updatedProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.use('/uploads', express.static('uploads')); // Для обслуживания загруженных файлов

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port', process.env.PORT || 3000);
});
