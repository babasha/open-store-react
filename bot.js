// telegram-web-ap.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const url = process.env.PUBLIC_URL;

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

// Удалите TypeScript декларации из серверного файла
// declare global {
//   interface Window {
//     Telegram: {
//       WebApp: {
//         ready: () => void;
//         initDataUnsafe: any;
//       };
//     };
//   }
// }

module.exports = {}; // Используйте CommonJS экспорт для серверного файла
