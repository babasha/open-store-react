const express = require('express');
const pool = require('./db');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();

app.use(express.json());

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route for getting all products
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
    console.error('Error fetching products:', err.message);
    res.status(500).send('Server Error');
  }
});

// Route for adding a new product
app.post('/products', upload.single('image'), async (req, res) => {
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
    console.error('Error adding product:', err.message);
    res.status(500).send('Server Error');
  }
});

// Route for deleting a product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).send('Server Error');
  }
});

// Route for updating a product
app.put('/products/:id', upload.single('image'), async (req, res) => {
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
    console.error('Error updating product:', err.message);
    res.status(500).send('Server Error');
  }
});

// Маршрут для регистрации пользователя
app.post('/auth/register', async (req, res) => {
  const { firstName, lastName, email, address, phone, telegram, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, address, phone, telegram_username, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name, last_name, email, address, phone, telegram_username, created_at',
      [firstName, lastName, email, address, phone, telegram, passwordHash]
    );

    const user = result.rows[0];
    res.status(201).json(user);
  } catch (err) {
    if (err.code === '23505') { // Unique violation error code in PostgreSQL
      return res.status(400).json({ error: 'Email already in use' });
    }
    console.error('Error registering user:', err.message);
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

// User login route
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 OR phone = $2 OR telegram_username = $3', [username, username, username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, address: user.address, phone: user.phone, telegramUsername: user.telegram_username } });
  } catch (err) {
    console.error('Error logging in user:', err.message);
    res.status(500).send('Server Error');
  }
});

// Маршрут для получения всех пользователей
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, first_name, last_name, email, address, phone, telegram_username FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server Error');
  }
});

app.use('/uploads', express.static('uploads'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
