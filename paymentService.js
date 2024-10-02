require('dotenv').config();
const axios = require('axios');
const pool = require('./db'); // Подключаем пул для взаимодействия с базой данных
const crypto = require('crypto');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

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
    console.error('Ошибка получения токена доступа:', error.message);
    throw new Error(`Не удалось получить токен доступа: ${error.response?.data?.error_description || error.message}`);
  }
}

/**
 * Создание платежной сессии через API Банка Грузии
 * @param {number} total - Общая сумма заказа
 * @param {Array} items - Список товаров
 * @param {string} externalOrderId - Уникальный идентификатор заказа
 * @returns {Object} - Объект с URL для оплаты и чека
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
        total_amount: Number(parseFloat(total).toFixed(2)),
        basket: items.map(item => ({
          product_id: item.productId.toString(),
          description: item.description || 'Товар',
          quantity: item.quantity,
          unit_price: Number(parseFloat(item.price).toFixed(2)),
        })),
      },
      redirect_urls: {
        success: `${process.env.PUBLIC_URL}/payment/success?externalOrderId=${externalOrderId}`,
        fail: `${process.env.PUBLIC_URL}/payment/fail`,
      },
    };

    console.log('Данные для создания платежа:', JSON.stringify(paymentData, null, 2));

    const response = await axios.post(process.env.BOG_PAYMENT_URL, paymentData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Ответ сервера Банка Грузии:', response.data);

    return {
      paymentUrl: response.data._links.redirect.href,
      receiptUrl: response.data._links.details.href,
    };
  } catch (error) {
    console.error('Ошибка создания платежа:', error.message);
    throw new Error(`Ошибка создания платежа: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Верификация подписи обратного вызова от Банка Грузии
 * @param {string} rawData - Сырое тело запроса
 * @param {string} signature - Подпись из заголовка
 * @returns {boolean} - Результат проверки
 */
function verifyCallbackSignature(rawData, signature) {
  const publicKeyPath = path.join(__dirname, 'public_key.pem');
  const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(rawData);
  verifier.end();

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

  if (event !== 'order_payment') {
    console.error('Неверное событие для обработки платежа:', event);
    throw new Error('Неверное событие для обратного вызова платежа');
  }

  const { external_order_id, order_status, order_id } = body;
  const paymentStatus = order_status.key;

  if (paymentStatus !== 'completed' && paymentStatus !== 'refunded_partially') {
    console.warn('Платёж не завершён успешно:', paymentStatus);
    return { message: 'Платёж не завершён успешно' };
  }

  try {
    // Проверяем наличие заказа в базе данных
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [external_order_id]);
    const order = orderResult.rows[0];
    if (!order) {
      throw new Error('Заказ не найден');
    }

    // Обновляем заказ в базе данных
    await pool.query(
      'UPDATE orders SET status = $1, payment_status = $2, bank_order_id = $3 WHERE id = $4',
      ['completed', paymentStatus, order_id, external_order_id]
    );

    console.log('Заказ успешно обновлён с ID:', external_order_id);

    // Возвращаем redirectUrl для успешной страницы
    return {
      message: 'Заказ успешно обновлён',
      redirectUrl: `/payment/success?orderId=${external_order_id}&total=${order.total}&items=${encodeURIComponent(order.items)}`,
    };
  } catch (error) {
    console.error('Ошибка при обновлении заказа:', error.message);
    throw new Error('Ошибка обновления заказа после оплаты');
  }
}

module.exports = {
  getAccessToken,
  createPayment,
  handlePaymentCallback,
  verifyCallbackSignature,
};
