const pool = require('../config/db');

// Получение всех курьеров
exports.getCouriers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM couriers');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения курьеров:', err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Получение данных о конкретном курьере
exports.getMyCourier = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM couriers WHERE user_id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Курьер не найден' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка получения курьера:', err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Обновление статуса курьера
exports.updateCourierStatus = async (req, res) => {
  const { status } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'UPDATE couriers SET status = $1 WHERE user_id = $2 RETURNING *',
      [status, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка обновления статуса курьера:', err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Получение всех курьеров со статусом "working"
exports.getWorkingCouriers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM couriers WHERE status = $1', ['working']);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения курьеров со статусом working:', err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Назначение курьера на заказ и обновление статуса заказа
exports.assignCourierToOrder = async (req, res) => {
  const { id } = req.params;
  const { courierId } = req.body;

  try {
    const result = await pool.query(
      'UPDATE orders SET courier_id = $1, status = $2 WHERE id = $3 RETURNING *',
      [courierId, 'courier_assigned', id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при назначении курьера и обновлении статуса заказа:', err.message);
    res.status(500).send('Ошибка сервера');
  }
};
