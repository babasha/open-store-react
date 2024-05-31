const express = require('express');
const pool = require('./db');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const isAdmin = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(403).send('Доступ запрещен.');

  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.user = decoded;
    if (req.user.role !== 'admin') return res.status(403).send('Доступ запрещен.');
    next();
  } catch (error) {
    res.status(400).send('Неверный токен.');
  }
};

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    const products = result.rows.map((product) => ({
      ...product,
      name: {
        en: product.name_en,
        ru: product.name_ru,
        geo: product.name_geo
      }
    }));
    res.json(products);
  } catch (err) {
    console.error('Ошибка получения продуктов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

app.post('/products', upload.single('image'), isAdmin, async (req, res) => {
  const { nameEn, nameRu, nameGeo, price } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newProduct = await pool.query(
      'INSERT INTO products (name_en, name_ru, name_geo, price, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nameEn, nameRu, nameGeo, price, imageUrl]
    );
    const product = {
      ...newProduct.rows[0],
      name: {
        en: newProduct.rows[0].name_en,
        ru: newProduct.rows[0].name_ru,
        geo: newProduct.rows[0].name_geo
      }
    };
    res.json(product);
  } catch (err) {
    console.error('Ошибка добавления продукта:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

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

app.put('/products/:id', upload.single('image'), isAdmin, async (req, res) => {
  const { id } = req.params;
  const { nameEn, nameRu, nameGeo, price } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const updatedProduct = await pool.query(
      'UPDATE products SET name_en = $1, name_ru = $2, name_geo = $3, price = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [nameEn, nameRu, nameGeo, price, imageUrl, id]
    );
    const product = {
      ...updatedProduct.rows[0],
      name: {
        en: updatedProduct.rows[0].name_en,
        ru: updatedProduct.rows[0].name_ru,
        geo: updatedProduct.rows[0].name_geo
      }
    };
    res.json(product);
  } catch (err) {
    console.error('Ошибка обновления продукта:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

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
    if (err.code === '23505') { // Уникальное нарушение в PostgreSQL
      return res.status(400).json({ error: 'Email уже используется' });
    }
    console.error('Ошибка регистрации пользователя:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', message: err.message });
  }
});

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

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, first_name, last_name, email, address, phone FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения пользователей:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

app.use('/uploads', express.static('uploads'));

app.listen(3000, () => {
  console.log('Сервер работает на порту 3000');
});
