const express = require('express');
const pool = require('./db');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(express.json());

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
// app.post('/products', upload.single('image'), async (req, res) => {
//   try {
//     const { name, price } = req.body;
//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
