const axios = require('axios');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid'); // Для генерации UUID
const express = require('express');
const app = express();
const pool = require('./db');
const temporaryOrders = {};

/**
 * Получение access_token от API Банка Грузии
 */
async function getAccessToken(userId) {
  console.log('Получен userId в getAccessToken:', userId);
  // Формируем строку авторизации из client_id и client_secret, закодированную в base64
  const auth = Buffer.from(
    `${process.env.BOG_CLIENT_ID}:${process.env.BOG_CLIENT_SECRET}`
  ).toString('base64');
  console.log('Получаем токен доступа...');
  try {
    // Выполняем POST-запрос для получения access_token
    console.log('Отправляем запрос на получение access_token...');
    const response = await axios.post(
      process.env.BOG_TOKEN_URL,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`, // Заголовок авторизации
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    console.log('Токен успешно получен:', response.data);

    // Убираем сохранение токена в таблицу users

    return response.data.access_token; // Возвращаем access_token
  } catch (error) {
    // Обработка ошибок
    if (error.response) {
      console.error('Ошибка получения токена доступа:', error.response.data);
      throw new Error(
        `Не удалось получить токен доступа: ${
          error.response.data.error_description || error.response.statusText
        }`
      );
    } else if (error.request) {
      console.error('Сервер не ответил на запрос:', error.request);
      throw new Error(
        'Сервер Банка Грузии не ответил на запрос. Попробуйте позже.'
      );
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
 * @param {string} externalOrderId - Уникальный идентификатор заказа
 * @param {number} userId - Идентификатор пользователя
 * @param {string} deliveryTime - Время доставки
 * @param {string} deliveryAddress - Адрес доставки
 * @returns {string} - URL для перенаправления пользователя на страницу оплаты
 */
async function createPayment(
  total,
  items,
  externalOrderId,
  userId,
  deliveryTime,
  deliveryAddress
) {
  console.log('Начало создания платежа...');
  console.log('Получен userId в createPayment:', userId);

  try {
    // Получаем access_token для авторизации
    console.log('Запрашиваем токен доступа для создания платежа...');
    const accessToken = await getAccessToken(userId);
    console.log('Токен доступа для платежа:', accessToken);

    if (!accessToken) {
      throw new Error('Не удалось получить токен доступа');
    }

    // Сохраняем данные заказа вместе с accessToken
    temporaryOrders[externalOrderId] = {
      userId,
      items,
      total,
      deliveryTime,
      deliveryAddress,
      accessToken, // Сохраняем accessToken
    };

    // Формируем данные для создания платежа
    console.log('Формируем данные для создания платежа...');
    const paymentData = {
      callback_url: process.env.BOG_CALLBACK_URL, // URL для обратного вызова
      external_order_id: externalOrderId, // Внешний идентификатор заказа
      purchase_units: {
        currency: 'GEL', // Валюта платежа
        total_amount: Number(parseFloat(total).toFixed(2)),
        basket: items.map((item) => {
          // Преобразуем item.price в число с двумя знаками после запятой
          const unitPrice = Number(parseFloat(item.price).toFixed(2));
          console.log('item.price:', item.price, 'unitPrice:', unitPrice);

          return {
            product_id: item.productId.toString(), // Идентификатор товара
            description: item.description || 'Товар',
            quantity: item.quantity,
            unit_price: unitPrice,
          };
        }),
      },
      redirect_urls: {
        success: `${process.env.PUBLIC_URL}/payment/success`,
        fail: `${process.env.PUBLIC_URL}/payment/fail`,
      },
    };

    console.log(
      'Данные для создания платежа:',
      JSON.stringify(paymentData, null, 2)
    );

    // Выполняем запрос на создание платежа
    console.log('Отправляем запрос на создание платежа...');
    const response = await axios.post(
      process.env.BOG_PAYMENT_URL,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Заголовок с токеном доступа
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Ответ сервера Банка Грузии:', response.data);
    return response.data._links.redirect.href; // Возвращаем ссылку для оплаты
  } catch (error) {
    if (error.response) {
      // Обрабатываем ошибку, если сервер вернул ответ с кодом ошибки
      console.error('Ошибка создания платежа:', error.response.data);
      throw new Error(
        `Ошибка создания платежа: ${
          error.response.data.message || error.response.statusText
        }`
      );
    } else if (error.request) {
      // Обрабатываем ошибку, если сервер не ответил
      console.error(
        'Сервер не ответил на запрос создания платежа:',
        error.request
      );
      throw new Error(
        'Сервер Банка Грузии не ответил на запрос создания платежа. Попробуйте позже.'
      );
    } else {
      // Обрабатываем ошибку настройки запроса
      console.error(
        'Ошибка настройки запроса создания платежа:',
        error.message
      );
      throw new Error(
        'Ошибка настройки запроса к API Банка Грузии при создании платежа'
      );
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
  console.log('Начало верификации подписи обратного вызова...');

  // Загрузка публичного ключа из файла
  const publicKeyPath = path.join(__dirname, 'public_key.pem');
  console.log('Загружаем публичный ключ из:', publicKeyPath);
  const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

  // Создание объекта для верификации подписи
  const verifier = crypto.createVerify('SHA256');

  // Данные должны быть сериализованы так же, как на стороне банка
  const dataString = JSON.stringify(data);
  console.log('Сериализованные данные для верификации:', dataString);
  verifier.update(dataString);
  verifier.end();

  // Проверка подписи с использованием публичного ключа
  const isValid = verifier.verify(publicKey, signature, 'base64');
  console.log('Результат верификации подписи:', isValid);
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
  console.log('Данные запроса:', JSON.stringify(body, null, 2));

  if (event === 'order_payment') {
    const { external_order_id, order_status, order_id } = body;

    // Проверка статуса платежа
    const paymentStatus = order_status.key;
    console.log('Статус платежа:', paymentStatus);
    if (
      paymentStatus !== 'completed' &&
      paymentStatus !== 'refunded_partially'
    ) {
      console.warn('Платёж не завершён успешно:', paymentStatus);
      return { message: 'Платёж не завершён успешно' };
    }

    try {
      // Получаем сохранённые данные заказа из temporaryOrders
      console.log(
        'Получаем данные заказа для external_order_id:',
        external_order_id
      );
      const orderData = temporaryOrders[external_order_id];
      if (!orderData) {
        console.error(
          'Данные заказа не найдены для external_order_id:',
          external_order_id
        );
        throw new Error('Данные заказа не найдены');
      }

      const { accessToken } = orderData;

      // Получаем receipt_url с помощью функции getReceipt
      const receiptData = await getReceipt(order_id, accessToken);
      const receiptUrl = receiptData.receipt_url; // Убедитесь, что это правильное поле

      // Создаём запись заказа в базе данных, включая card_token и receipt_url
      console.log('Создаём запись заказа в базе данных...');
      const insertResult = await pool.query(
        'INSERT INTO orders (user_id, items, total, delivery_time, delivery_address, status, payment_status, bank_order_id, card_token, receipt_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
        [
          orderData.userId, // ID пользователя
          JSON.stringify(orderData.items), // Список товаров в формате JSON
          orderData.total, // Общая сумма заказа
          orderData.deliveryTime, // Время доставки
          orderData.deliveryAddress, // Адрес доставки
          'completed', // Статус заказа
          paymentStatus, // Статус платежа
          order_id, // Идентификатор заказа в банке
          accessToken, // Сохраняем accessToken в card_token
          receiptUrl, // Сохраняем receipt_url
        ]
      );
      const newOrderId = insertResult.rows[0].id;
      console.log('Заказ успешно создан с ID:', newOrderId);

      // Удаляем временные данные заказа
      console.log(
        'Удаляем временные данные заказа для external_order_id:',
        external_order_id
      );
      delete temporaryOrders[external_order_id];

      // Возвращаем redirectUrl для успешной страницы
      const redirectUrl = `/payment/success?orderNumber=${external_order_id}&total=${
        orderData.total
      }&items=${encodeURIComponent(JSON.stringify(orderData.items))}`;
      console.log('Возвращаем redirectUrl для успешной страницы:', redirectUrl);
      return {
        message: 'Заказ успешно создан',
        redirectUrl: redirectUrl,
      };
    } catch (error) {
      console.error('Ошибка при создании заказа:', error.message);
      throw new Error('Ошибка создания заказа после оплаты');
    }
  } else {
    // Обрабатываем ошибку, если событие не поддерживается
    console.error('Неверное событие для обработки платежа:', event);
    throw new Error('Неверное событие для обратного вызова платежа');
  }
}

/**
 * Получение чека после успешного платежа
 * @param {string} orderId - Идентификатор заказа
 * @param {string} accessToken - Токен доступа
 * @returns {Object} - Чек в формате JSON
 */
async function getReceipt(orderId, accessToken) {
  console.log('Получение чека для orderId:', orderId);

  try {
    // Выполняем GET-запрос для получения чека
    const response = await axios.get(
      `${process.env.BOG_PAYMENT_URL}/receipt/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Полученный чек:', JSON.stringify(response.data, null, 2));
    return response.data; // Возвращаем чек в формате JSON
  } catch (error) {
    if (error.response) {
      console.error('Ошибка получения чека:', error.response.data);
      throw new Error(
        `Ошибка получения чека: ${
          error.response.data.message || error.response.statusText
        }`
      );
    } else if (error.request) {
      console.error(
        'Сервер не ответил на запрос получения чека:',
        error.request
      );
      throw new Error(
        'Сервер Банка Грузии не ответил на запрос получения чека. Попробуйте позже.'
      );
    } else {
      console.error(
        'Ошибка настройки запроса получения чека:',
        error.message
      );
      throw new Error(
        'Ошибка настройки запроса к API Банка Грузии при получении чека'
      );
    }
  }
}

module.exports = {
  getAccessToken,
  createPayment,
  handlePaymentCallback,
  verifyCallbackSignature,
  getReceipt,
  temporaryOrders, // Экспортируем temporaryOrders для использования в server.js
};
