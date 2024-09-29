require('dotenv').config();
const axios = require('axios');
const pool = require('./db'); // Подключаем пул для взаимодействия с базой данных
const crypto = require('crypto');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const temporaryOrders = {}; 
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
 * @param {string} externalOrderId - Уникальный идентификатор заказа
 * @returns {string} - URL для перенаправления пользователя на страницу оплаты
 */
async function createPayment(total, items, externalOrderId) {
  console.log('Начало создания платежа...');

  try {
    const accessToken = await getAccessToken();
    console.log('Токен доступа для платежа:', accessToken);

    if (!accessToken) {
      throw new Error('Не удалось получить токен доступа');
    }

    const paymentData = {
      callback_url: process.env.BOG_CALLBACK_URL,
      external_order_id: externalOrderId,
      purchase_units: {
        currency: 'GEL',
        total_amount: Number(parseFloat(total).toFixed(2)), // Преобразуем total в число
        basket: items.map(item => {
          // Преобразуем item.price в число
          const unitPrice = Number(parseFloat(item.price).toFixed(2));
          console.log('item.price:', item.price, 'unitPrice:', unitPrice);

          return {
            product_id: item.productId.toString(),
            description: item.description || 'Товар',
            quantity: item.quantity,
            unit_price: unitPrice,
          };
        })
      },
      redirect_urls: {
        success: `${process.env.PUBLIC_URL}/payment/success`,
        fail: `${process.env.PUBLIC_URL}/payment/fail`
      }
    };

    console.log('Данные для создания платежа:', JSON.stringify(paymentData, null, 2));

    // Отправляем запрос на создание платежа
    const response = await axios.post(process.env.BOG_PAYMENT_URL, paymentData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Ответ сервера Банка Грузии:', response.data);

    // Получаем ссылки для оплаты и чека
    const paymentUrl = response.data._links.redirect.href;
    const receiptUrl = response.data._links.details.href;

    // Возвращаем оба значения
    return {
      paymentUrl,
      receiptUrl
    };
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
  console.log('Данные запроса:', JSON.stringify(body, null, 2));

  if (event === 'order_payment') {
    const { external_order_id, order_status, order_id } = body;

     // Проверка статуса платежа
     const paymentStatus = order_status.key;
     if (paymentStatus !== 'completed' && paymentStatus !== 'refunded_partially') {
       console.warn('Платёж не завершён успешно:', paymentStatus);
       return { message: 'Платёж не завершён успешно' };
     }

     try {
      // Получаем сохранённые данные заказа
      const orderData = temporaryOrders[external_order_id];
      if (!orderData) {
        throw new Error('Данные заказа не найдены');
      }

    // Создаём заказ в базе данных
    const insertResult = await pool.query(
      'INSERT INTO orders (user_id, items, total, delivery_time, delivery_address, status, payment_status, bank_order_id, receipt_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [
        orderData.userId,
        JSON.stringify(orderData.items),
        orderData.total,
        orderData.deliveryTime,
        orderData.deliveryAddress,
        'completed', // Статус заказа
        paymentStatus, // Статус платежа
        order_id, // Идентификатор заказа в банке
        orderData.receiptUrl // Сохраняем receiptUrl
      ]
    );
    const newOrderId = insertResult.rows[0].id;
    console.log('Заказ успешно создан с ID:', newOrderId);

      // Удаляем временные данные заказа
      delete temporaryOrders[external_order_id];


// Возвращаем redirectUrl для успешной страницы
return { message: 'Заказ успешно создан', 
  redirectUrl: `/payment/success?orderId=${newOrderId}&total=${orderData.total}&items=${encodeURIComponent(JSON.stringify(orderData.items))}` }

  // redirectUrl: `/payment/success?orderNumber=${external_order_id}&total=${orderData.total}&items=${encodeURIComponent(JSON.stringify(orderData.items))}` }
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
  verifyCallbackSignature,
  temporaryOrders, // Экспортируем temporaryOrders для использования в server.js
};