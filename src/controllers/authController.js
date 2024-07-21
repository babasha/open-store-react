const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Регистрация пользователя
exports.register = async (req, res) => {
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
    console.error('Ошибка регистрации пользователя:', err.message);

    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email уже используется' });
    }
    res.status(500).json({ error: 'Ошибка сервера', message: err.message });
  }
};

// Вход пользователя
exports.login = async (req, res) => {
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
};

// Получение информации о текущем пользователе
exports.getCurrentUser = (req, res) => {
  pool.query('SELECT id, first_name, last_name, email, address, phone, role FROM users WHERE id = $1', [req.user.id])
    .then(result => {
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      const user = result.rows[0];
      res.json({ user });
    })
    .catch(err => {
      console.error('Ошибка при получении данных пользователя:', err.message);
      res.status(500).json({ message: 'Ошибка сервера' });
    });
};
