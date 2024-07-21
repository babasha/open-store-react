const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'secret_key';

// Генерация JWT токена
exports.generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
  };
  const options = {
    expiresIn: '1h', // Срок действия токена
  };
  return jwt.sign(payload, secret, options);
};

// Проверка JWT токена
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Ошибка при проверке токена:', error.message);
    return null;
  }
};
