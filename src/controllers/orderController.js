const pool = require('../config/db');
const { Server } = require('socket.io');
const io = new Server();

// Создание заказа
exports.createOrder = async (req, res) => {
  const { userId, items, total, deliveryTime, deliveryAddress } = req.body;

  try {
    const userResult = await pool.query('SELECT first_name, last_name, address FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, items, total, delivery_time, delivery_address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, JSON.stringify(items), total, deliveryTime || null, deliveryAddress || user.address]
    );

    const orderId = orderResult.rows[0].id;

    const productIds = items.map(item => item.productId);
    const productResult = await pool.query('SELECT id, name_en FROM products WHERE id = ANY($1)', [productIds]);

    const products = productResult.rows.reduce((acc, product) => {
      acc[product.id] = product.name_en;
      return acc;
    }, {});

    const newOrder = {
      ...orderResult.rows[0],
      first_name: user.first_name,
      last_name: user.last_name,
      address: user.address,
      items: items.map(item => ({
        ...item,
        productName: products[item.productId]
      }))
    };

    io.emit('newOrder', newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Ошибка при оформлении заказа:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Обновление статуса заказа
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    const result = await pool.query(`
      SELECT 
        o.id AS order_id, 
        o.user_id, 
        u.first_name, 
        u.last_name, 
        u.address, 
        o.items, 
        o.total, 
        o.status, 
        o.created_at,
        o.delivery_time,
        p.id AS product_id,
        p.name_en AS product_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN LATERAL jsonb_array_elements(o.items) item ON true
      JOIN products p ON item->>'productId' = p.id::text
      WHERE o.id = $1
    `, [id]);

    const updatedOrder = result.rows.reduce((acc, row) => {
      if (!acc) {
        acc = {
          id: row.order_id,
          user_id: row.user_id,
          first_name: row.first_name,
          last_name: row.last_name,
          address: row.address,
          total: row.total,
          status: row.status,
          created_at: row.created_at,
          items: []
        };
      }
      acc.items.push({
        productId: row.product_id,
        productName: row.product_name,
        quantity: row.items.find(i => i.productId === row.product_id).quantity
      });
      return acc;
    }, null);

    io.emit('orderUpdated', updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Ошибка при обновлении статуса заказа:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Обновление количества товаров в заказе
exports.updateOrderItems = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  try {
    const result = await pool.query(
      'UPDATE orders SET items = $1 WHERE id = $2 RETURNING *',
      [JSON.stringify(items), id]
    );

    const updatedOrder = result.rows[0];
    io.emit('orderUpdated', updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Ошибка при обновлении количества товаров:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Получение всех заказов
exports.getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id AS order_id, 
        o.user_id, 
        u.first_name, 
        u.last_name, 
        u.address, 
        u.phone,
        o.items, 
        o.total, 
        o.status, 
        o.created_at,
        o.delivery_time,
        o.delivery_option,
        p.id AS product_id,
        p.name_en AS product_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN LATERAL jsonb_array_elements(o.items) item ON true
      JOIN products p ON item->>'productId' = p.id::text
    `);

    const orders = result.rows.reduce((acc, row) => {
      const order = acc.find(o => o.id === row.order_id);
      if (order) {
        order.items.push({
          productId: row.product_id,
          productName: row.product_name,
          quantity: row.items.find(i => i.productId === row.product_id).quantity
        });
      } else {
        acc.push({
          id: row.order_id,
          user_id: row.user_id,
          first_name: row.first_name,
          last_name: row.last_name,
          address: row.address,
          phone: row.phone,
          total: row.total,
          status: row.status,
          created_at: row.created_at,
          delivery_time: row.delivery_time,
          delivery_option: row.delivery_option,
          items: [{
            productId: row.product_id,
            productName: row.product_name,
            quantity: row.items.find(i => i.productId === row.product_id).quantity
          }]
        });
      }
      return acc;
    }, []);

    res.json(orders);
  } catch (err) {
    console.error('Ошибка получения заказов:', err.message);
    res.status(500).json({ error: 'Ошибка сервера', message: err.message });
  }
};

// Получение заказов текущего пользователя
exports.getUserOrders = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения заказов пользователя:', err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Обновление опции доставки для активных заказов
exports.updateDeliveryMode = async (req, res) => {
  const { deliveryOption } = req.body;

  try {
    const result = await pool.query(
      'UPDATE orders SET delivery_option = $1 WHERE status = $2 RETURNING *',
      [deliveryOption, 'pending']
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка обновления опции доставки для активных заказов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Обновление режима доставки для конкретного заказа
exports.updateOrderDeliveryOption = async (req, res) => {
  const { id } = req.params;
  const { deliveryOption } = req.body;

  try {
    const result = await pool.query(
      'UPDATE orders SET delivery_option = $1 WHERE id = $2 RETURNING *',
      [deliveryOption, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка обновления опции доставки:', err.message);
    res.status(500).send('Ошибка сервера');
  }
};
