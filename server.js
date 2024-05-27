const express = require('express');
const pool = require('./db');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
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
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).send('Server Error');
  }
});

// Route for adding a new product
app.post('/products', upload.single('image'), async (req, res) => {
  const { name, price } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newProduct = await pool.query(
      'INSERT INTO products (name, price, image_url) VALUES ($1, $2, $3) RETURNING *',
      [name, price, imageUrl]
    );
    console.log('New product added:', newProduct.rows[0]);
    res.json(newProduct.rows[0]);
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
    console.log(`Product with id ${id} deleted`);
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).send('Server Error');
  }
});

// Route for updating a product
app.put('/products/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    console.log('Updating product:', { id, name, price, imageUrl });
    const updatedProduct = await pool.query(
      'UPDATE products SET name = $1, price = $2, image_url = $3 WHERE id = $4 RETURNING *',
      [name, price, imageUrl, id]
    );
    console.log('Product updated:', updatedProduct.rows[0]);
    res.json(updatedProduct.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err.message);
    res.status(500).send('Server Error');
  }
});

app.use('/uploads', express.static('uploads'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
