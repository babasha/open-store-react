const express = require('express');
const router = express.Router();
const { getProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');

// Конфигурация multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.get('/', getProducts);
router.post('/', upload.single('image'), isAdmin, addProduct);
router.put('/:id', upload.single('image'), isAdmin, updateProduct);
router.delete('/:id', isAdmin, deleteProduct);

module.exports = router;
