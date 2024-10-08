const axios = require('axios');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const pool = require('./db');

// Создаём объект temporaryOrders
const temporaryOrders = {};

/**
 * Получение access_token от API Банка Грузии
 */
async function getAccessToken() {
  // Формируем строку авторизации из client_id и client_secret, закодированную в base64
  const auth = Buffer.from(`${process.env.BOG_CLIENT_ID}:${process.env.BOG_CLIENT_SECRET}`).toString('base64');

  console.log('Получаем токен доступа...');

  try {
    // Выполняем POST-запрос для получения access_token
    console.log('Отправляем запрос на получение access_token...');
    const response = await axios.post(process.env.BOG_TOKEN_URL, 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${auth}`, // Добавляем заголовок авторизации с base64 закодированными данными
        'Content-Type': 'application/x-www-form-urlencoded' // Указываем тип контента для формы
      }
    });

    console.log('Токен успешно получен:', response.data);
    return response.data.access_token; // Возвращаем access_token
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
 * @param {string} externalOrderId - Уникальный идентификатор заказа
 * @returns {string} - URL для перенаправления пользователя на страницу оплаты
 */
async function createPayment(total, items, externalOrderId) {
  console.log('Начало создания платежа...');

  try {
    // Получаем access_token для авторизации
    console.log('Запрашиваем токен доступа для создания платежа...');
    const accessToken = await getAccessToken();
    console.log('Токен доступа для платежа:', accessToken);

    if (!accessToken) {
      throw new Error('Не удалось получить токен доступа');
    }

    // Формируем данные для создания платежа
    console.log('Формируем данные для создания платежа...');
    const paymentData = {
      callback_url: process.env.BOG_CALLBACK_URL,
      external_order_id: externalOrderId,
      purchase_units: {
        currency: 'GEL',
        total_amount: Number(parseFloat(total).toFixed(2)),
        basket: items.map(item => {
          const unitPrice = Number(parseFloat(item.price).toFixed(2));
          return {
            product_id: item.productId.toString(),
            description: item.description || 'Товар',
            quantity: item.quantity,
            unit_price: unitPrice,
          };
        })
      },
      redirect_urls: {
        success: `${process.env.PUBLIC_URL}/payment/success?externalOrderId=${externalOrderId}`, // Включите externalOrderId здесь
        fail: `${process.env.PUBLIC_URL}/payment/fail`
      }
    };

    console.log('Данные для создания платежа:', JSON.stringify(paymentData, null, 2));

    // Выполняем запрос на создание платежа
    console.log('Отправляем запрос на создание платежа...');
    const response = await axios.post(process.env.BOG_PAYMENT_URL, paymentData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Заголовок с токеном доступа
        'Content-Type': 'application/json' // Указываем тип контента как JSON
      }
    });

    console.log('Ответ сервера Банка Грузии:', response.data);

    // Сохраняем accessToken в temporaryOrders
    if (temporaryOrders[externalOrderId]) {
      temporaryOrders[externalOrderId].accessToken = accessToken;
    } else {
      // Если по какой-то причине временный заказ отсутствует, создадим его
      temporaryOrders[externalOrderId] = {
        accessToken: accessToken,
      };
    }

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
  console.log('Начало верификации подписи обратного вызова...');

  // Загрузка публичного ключа из файла
  const publicKeyPath = path.join(__dirname, 'public_key.pem');
  console.log('Загружаем публичный ключ из:', publicKeyPath);
  const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

  // Создание объекта для верификации подписи
  const verifier = crypto.createVerify('SHA256');

  // Важно: данные должны быть сериализованы точно так же, как были на стороне банка
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
    if (paymentStatus !== 'completed' && paymentStatus !== 'refunded_partially') {
      console.warn('Платёж не завершён успешно:', paymentStatus);
      return { message: 'Платёж не завершён успешно' };
    }

    try {
      // Получаем сохранённые данные заказа из временного хранилища
      console.log('Получаем данные заказа для external_order_id:', external_order_id);
      const orderData = temporaryOrders[external_order_id];
      if (!orderData) {
        console.error('Данные заказа не найдены для external_order_id:', external_order_id);
        throw new Error('Данные заказа не найдены');
      }

      // Создаём запись заказа в базе данных
      console.log('Создаём запись заказа в базе данных...');
      const insertResult = await pool.query(
        'INSERT INTO orders (user_id, items, total, delivery_time, delivery_address, status, payment_status, bank_order_id, card_token, external_order_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
        [
         orderData.userId,
         JSON.stringify(orderData.items),
         orderData.total,
         orderData.deliveryTime,
         orderData.deliveryAddress,
         'completed',
         paymentStatus,
         order_id,
         orderData.accessToken,
         external_order_id // Добавьте эту строку
        ]
      );
      const newOrderId = insertResult.rows[0].id;
      console.log('Заказ успешно создан с ID:', newOrderId);

      // Удаляем временные данные заказа из временного хранилища
      console.log('Удаляем временные данные заказа для external_order_id:', external_order_id);
      delete temporaryOrders[external_order_id];

      // Возвращаем redirectUrl для успешной страницы
      const redirectUrl = `/payment/success?orderId=${newOrderId}&total=${orderData.total}&items=${encodeURIComponent(JSON.stringify(orderData.items))}`;
      console.log('Возвращаем redirectUrl для успешной страницы:', redirectUrl);
      return {
        message: 'Заказ успешно создан',
        redirectUrl: redirectUrl
      };
    } catch (error) {
      console.error('Ошибка при создании заказа:', error.message);
      throw new Error('Ошибка создания заказа после оплаты');
    }
  } else {
    console.error('Неверное событие для обработки платежа:', event);
    throw new Error('Неверное событие для обратного вызова платежа');
  }
}

/**
 * Получение чека после успешного платежа
 * @param {string} orderId - Идентификатор заказа
 * @returns {Object} - Чек в формате JSON
 */
async function getReceipt(orderId) {
  console.log('Получение чека для orderId:', orderId);

  try {
    // Получаем access_token для авторизации
    const accessToken = await getAccessToken();
    console.log('Токен доступа для получения чека:', accessToken);

    // Выполняем GET-запрос для получения чека
    const response = await axios.get(`${process.env.BOG_PAYMENT_URL}/receipt/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Полученный чек:', JSON.stringify(response.data, null, 2));
    return response.data; // Возвращаем чек в формате JSON
  } catch (error) {
    if (error.response) {
      console.error('Ошибка получения чека:', error.response.data);
      throw new Error(`Ошибка получения чека: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      console.error('Сервер не ответил на запрос получения чека:', error.request);
      throw new Error('Сервер Банка Грузии не ответил на запрос получения чека. Попробуйте позже.');
    } else {
      console.error('Ошибка настройки запроса получения чека:', error.message);
      throw new Error('Ошибка настройки запроса к API Банка Грузии при получении чека');
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