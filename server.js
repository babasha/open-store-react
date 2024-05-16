const express = require('express');
const pool = require('./db');
const app = express();

app.use(express.json()); // Для парсинга JSON запросов

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
app.post('/products', async (req, res) => {
  try {
    const { name, price } = req.body;
    const newProduct = await pool.query(
      'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
      [name, price]
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
