const TelegramBot = require('node-telegram-bot-api');
const token = '7246879435:AAEOX8oHojQQ5atQcD1rGIaPJEBr5hPifn4';
const bot = new TelegramBot(token, { polling: true });

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
