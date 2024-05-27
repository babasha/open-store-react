const express = require('express');
const pool = require('./db');
const multer = require('multer');
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

app.use('/uploads', express.static('uploads'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
