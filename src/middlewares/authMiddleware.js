const jwt = require('jsonwebtoken');

// Middleware для проверки авторизации пользователя
exports.isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Ошибка при проверке токена:', error.message);
    res.status(400).json({ message: 'Неверный токен' });
  }
};

// Middleware для проверки, является ли пользователь администратором
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен' });
  }
  next();
};
