require('dotenv').config();
const axios = require('axios');
const pool = require('./db'); // Подключаем пул для взаимодействия с базой данных

// Функция для получения access_token
async function getAccessToken() {
  const auth = Buffer.from(`${process.env.BOG_CLIENT_ID}:${process.env.BOG_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(process.env.BOG_TOKEN_URL, 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Токен успешно получен:', response.data); // Логируем успешное получение токена
    return response.data.access_token;
  } catch (error) {
    if (error.response) {
      // Сервер вернул ответ с ошибкой (4xx или 5xx)
      console.error('Ошибка получения токена доступа:', error.response.data);
      throw new Error(`Не удалось получить токен доступа: ${error.response.data.error_description || error.response.statusText}`);
    } else if (error.request) {
      // Запрос был отправлен, но ответа не последовало
      console.error('Сервер не ответил на запрос:', error.request);
      throw new Error('Сервер Банка Грузии не ответил на запрос. Попробуйте позже.');
    } else {
      // Ошибка при настройке запроса
      console.error('Ошибка настройки запроса:', error.message);
      throw new Error('Ошибка настройки запроса к API Банка Грузии');
    }
  }
}

// Функция для создания платежа
async function createPayment(total, items) {
  try {
    const accessToken = await getAccessToken(); // Получаем токен доступа
    if (!accessToken) {
      throw new Error('Не удалось получить токен доступа');
    }

    const paymentData = {
      callback_url: process.env.BOG_CALLBACK_URL,
      purchase_units: {
        currency: 'GEL', // Здесь можно добавить динамическую передачу валюты, если нужно
        total_amount: total,
        basket: items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.price,
        }))
      },
      redirect_urls: {
        success: `${process.env.PUBLIC_URL}/payment/success`,
        fail: `${process.env.PUBLIC_URL}/payment/fail`
      }
    };

    const response = await axios.post(process.env.BOG_PAYMENT_URL, paymentData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Платеж успешно создан:', response.data); // Логируем успешное создание платежа
    return response.data._links.redirect.href;
  } catch (error) {
    if (error.response) {
      // Сервер вернул ответ с ошибкой
      console.error('Ошибка создания платежа:', error.response.data);
      throw new Error(`Ошибка создания платежа: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      // Запрос был отправлен, но ответа не последовало
      console.error('Сервер не ответил на запрос создания платежа:', error.request);
      throw new Error('Сервер Банка Грузии не ответил на запрос создания платежа. Попробуйте позже.');
    } else {
      // Ошибка при настройке запроса
      console.error('Ошибка настройки запроса создания платежа:', error.message);
      throw new Error('Ошибка настройки запроса к API Банка Грузии при создании платежа');
    }
  }
}

// Функция для обработки обратного вызова
async function handlePaymentCallback(event, body) {
  if (event === 'order_payment') {
    const { order_id, order_status } = body;

    // Обновляем статус заказа в базе данных
    try {
      console.log('Обрабатываем платеж для заказа:', order_id); // Логируем информацию о заказе
      await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [order_status.key, order_id]);
      console.log('Статус заказа обновлен успешно:', order_status.key); // Логируем успешное обновление статуса
      return { message: 'Платеж успешно обработан' };
    } catch (error) {
      console.error('Ошибка обновления статуса заказа:', error.message);
      throw new Error('Ошибка обработки платежа');
    }
  } else {
    throw new Error('Неверное событие для обратного вызова платежа');
  }
}

module.exports = {
  getAccessToken,
  createPayment,
  handlePaymentCallback
};
