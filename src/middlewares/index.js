// middlewares/index.js
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Middleware для проверки авторизации пользователя
const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Ошибка при проверке токена:', error.message);
    res.status(400).json({ message: 'Неверный токен' });
  }
};

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

module.exports = {
  isAuthenticated,
  isAdmin,
  upload
};
