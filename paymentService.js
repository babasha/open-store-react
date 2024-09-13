// paymentService.js
require('dotenv').config();
const axios = require('axios');
const pool = require('./db'); // Подключаем пул для взаимодействия с базой данных
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Получение access_token от API Банка Грузии
 */
async function getAccessToken() {
  const auth = Buffer.from(`${process.env.BOG_CLIENT_ID}:${process.env.BOG_CLIENT_SECRET}`).toString('base64');
  
  console.log('Получаем токен доступа...');

  try {
    const response = await axios.post(process.env.BOG_TOKEN_URL, 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Токен успешно получен:', response.data);
    return response.data.access_token;
  } catch (error) {
    if (error.response) {
      console.error('Ошибка получения токена доступа:', error.response.data);
      throw new Error(`Не удалось получить токен доступа: ${error.response.data.error_description || error.response.statusText}`);
    } else if (error.request) {
      console.error('Сервер не ответил на запрос:', error.request);
      throw new Error('Сервер Банка Грузии не ответил на запрос. Попробуйте позже.');
    } else {
      console.error('Ошибка настройки запроса:', error.message);
      throw new Error('Ошибка настройки запроса к API Банка Грузии');
    }
  }
}

/**
 * Создание платежной сессии через API Банка Грузии
 * @param {number} total - Общая сумма заказа
 * @param {Array} items - Список товаров
 * @returns {string} - URL для перенаправления пользователя на страницу оплаты
 */
async function createPayment(total, items) {
  console.log('Начало создания платежа...');

  try {
    const accessToken = await getAccessToken();
    console.log('Токен доступа для платежа:', accessToken);

    if (!accessToken) {
      throw new Error('Не удалось получить токен доступа');
    }

    const paymentData = {
      callback_url: process.env.BOG_CALLBACK_URL,
      purchase_units: {
        currency: 'GEL', // Можно сделать динамической передачу валюты
        total_amount: total,
        basket: items.map(item => ({
          product_id: item.productId,
          description: item.description, // Используем поле description для названия товара
          quantity: item.quantity,
          unit_price: item.price,
        }))
      },
      redirect_urls: {
        success: `${process.env.PUBLIC_URL}/payment/success`,
        fail: `${process.env.PUBLIC_URL}/payment/fail`
      }
    };

    console.log('Данные для создания платежа:', paymentData);

    const response = await axios.post(process.env.BOG_PAYMENT_URL, paymentData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Ответ сервера Банка Грузии:', response.data);
    return response.data._links.redirect.href; // Возвращаем ссылку для оплаты
  } catch (error) {
    if (error.response) {
      console.error('Ошибка создания платежа:', error.response.data);
      throw new Error(`Ошибка создания платежа: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      console.error('Сервер не ответил на запрос создания платежа:', error.request);
      throw new Error('Сервер Банка Грузии не ответил на запрос создания платежа. Попробуйте позже.');
    } else {
      console.error('Ошибка настройки запроса создания платежа:', error.message);
      throw new Error('Ошибка настройки запроса к API Банка Грузии при создании платежа');
    }
  }
}

/**
 * Верификация подписи обратного вызова от Банка Грузии
 * @param {Object} data - Тело запроса
 * @param {string} signature - Подпись из заголовка
 * @returns {boolean} - Результат проверки
 */
function verifyCallbackSignature(data, signature) {
  // Загрузка публичного ключа из файла
  const publicKeyPath = path.join(__dirname, 'public_key.pem'); // Убедитесь, что путь правильный
  const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

  // Создание объекта для верификации
  const verifier = crypto.createVerify('SHA256');

  // Важно: данные должны быть сериализованы точно так же, как были на стороне банка
  const dataString = JSON.stringify(data);
  verifier.update(dataString);
  verifier.end();

  // Проверка подписи
  const isValid = verifier.verify(publicKey, signature, 'base64');
  if (!isValid) {
    console.error('Подпись не прошла верификацию');
  }
  return isValid;
}

/**
 * Обработка обратного вызова платежа от Банка Грузии
 * @param {string} event - Тип события
 * @param {Object} body - Тело запроса
 * @returns {Object} - Результат обработки
 */
async function handlePaymentCallback(event, body) {
  console.log('Обработка обратного вызова платежа...');
  console.log('Тип события:', event);
  console.log('Данные запроса:', body);

  if (event === 'order_payment') { // Соответствует документации банка
    const { order_id, industry, capture, external_order_id, client, zoned_create_date, zoned_expire_date, order_status, buyer, purchase_units, redirect_links, payment_detail, discount, actions } = body;

    // Проверка статуса платежа
    const paymentStatus = order_status.key;
    if (paymentStatus !== 'completed' && paymentStatus !== 'refunded_partially') {
      console.warn('Платёж не завершён успешно:', paymentStatus);
      return { message: 'Платёж не завершён успешно' };
    }

    try {
      // Извлечение необходимых данных
      // Предполагается, что external_order_id содержит userId или другой идентификатор
      const userId = external_order_id;

      // Получение информации о пользователе из базы данных (если необходимо)
      const userResult = await pool.query('SELECT first_name, last_name, address FROM users WHERE id = $1', [userId]);
      const user = userResult.rows[0];
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      const items = purchase_units.basket.map(item => ({
        productId: item.product_id,
        description: item.description,
        quantity: item.quantity,
        price: item.unit_price,
      }));
      const total = purchase_units.total_amount;
      const deliveryTime = null; // Или извлечь из других данных, если доступно
      const deliveryAddress = buyer.address || user.address || null; // Предполагается, что адрес можно получить из buyer или других полей

      // Создание заказа в базе данных
      const orderResult = await pool.query(
        'INSERT INTO orders (user_id, items, total, delivery_time, delivery_address, bank_order_id, payment_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [userId, JSON.stringify(items), total, deliveryTime || null, deliveryAddress, order_id, paymentStatus]
      );

      const newOrder = orderResult.rows[0];
      console.log('Заказ успешно создан с ID:', newOrder.id);

      // Если нужно, можно отправить уведомление пользователю через Socket.io
      // Например:
      // io.emit('newOrder', newOrder);

      return { message: 'Заказ успешно создан' };
    } catch (error) {
      console.error('Ошибка при создании заказа:', error.message);
      throw new Error('Ошибка создания заказа после оплаты');
    }
  } else {
    console.error('Неверное событие для обработки платежа:', event);
    throw new Error('Неверное событие для обратного вызова платежа');
  }
}

module.exports = {
  getAccessToken,
  createPayment,
  handlePaymentCallback,
  verifyCallbackSignature
};
