require('dotenv').config();
const axios = require('axios');
const pool = require('./db'); // Подключаем пул для взаимодействия с базой данных

// Функция для получения access_token с логированием
async function getAccessToken() {
  const auth = Buffer.from(`${process.env.BOG_CLIENT_ID}:${process.env.BOG_CLIENT_SECRET}`).toString('base64');
  
  console.log('Получаем токен доступа...'); // Логируем начало процесса

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

// Функция для создания платежа с максимальным логированием
async function createPayment(total, items) {
  console.log('Начало создания платежа...'); // Логируем начало процесса

  try {
    const accessToken = await getAccessToken(); // Получаем токен доступа
    console.log('Токен доступа для платежа:', accessToken); // Логируем токен доступа

    if (!accessToken) {
      throw new Error('Не удалось получить токен доступа');
    }

    const paymentData = {
      callback_url: process.env.BOG_CALLBACK_URL,
      purchase_units: {
        currency: 'GEL', // Можно сделать динамическую передачу валюты
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

    console.log('Данные для создания платежа:', paymentData); // Логируем данные платежа

    const response = await axios.post(process.env.BOG_PAYMENT_URL, paymentData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Ответ сервера Банка Грузии:', response.data); // Логируем успешный ответ от сервера
    return response.data._links.redirect.href; // Возвращаем ссылку для оплаты
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

// Функция для обработки обратного вызова с логированием
async function handlePaymentCallback(event, body) {
  console.log('Обработка обратного вызова платежа...'); // Логируем начало обработки
  console.log('Тип события:', event); // Логируем тип события
  console.log('Данные запроса:', body); // Логируем данные тела запроса

  if (event === 'payment_success') {
    const { bank_order_id, userId, items, total, deliveryTime, deliveryAddress } = body;

    try {
      // Логируем ID заказа, присвоенный банком
      console.log('ID заказа от банка:', bank_order_id);

      // После успешной оплаты создается заказ
      const orderResult = await pool.query(
        'INSERT INTO orders (user_id, items, total, delivery_time, delivery_address, bank_order_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userId, JSON.stringify(items), total, deliveryTime || null, deliveryAddress, bank_order_id]
      );

      console.log('Заказ успешно создан с ID:', orderResult.rows[0].id); // Логирование успешного создания заказа в базе данных

      return { message: 'Заказ успешно создан' };
    } catch (error) {
      console.error('Ошибка при создании заказа:', error.message);
      throw new Error('Ошибка создания заказа после оплаты');
    }
  } else {
    console.error('Неверное событие для обработки платежа');
    throw new Error('Неверное событие для обратного вызова платежа');
  }
}

module.exports = {
  getAccessToken,
  createPayment,
  handlePaymentCallback
};