const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const startPayload = match[1]; // Получаем payload из команды /start

  if (startPayload === 'auth') {
    // Получаем информацию о пользователе
    const user = msg.from;

    // Отправляем данные пользователя на ваш сервер для авторизации
    try {
      const response = await axios.post(`${process.env.PUBLIC_URL}/auth/telegram`, { user });

      if (response.data.token) {
        // Отправляем сообщение пользователю с информацией о успешной авторизации
        bot.sendMessage(chatId, 'Вы успешно авторизовались через Telegram!');
      }
    } catch (error) {
      console.error('Ошибка при авторизации через Telegram:', error);
      bot.sendMessage(chatId, 'Произошла ошибка при авторизации через Telegram.');
    }
  }
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const url = 'https://enddel.com';

  bot.sendMessage(chatId, 'Открыть мини-приложение', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Открыть',
            web_app: { url: url }
          }
        ]
      ]
    }
  });
});
