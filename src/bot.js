const TelegramBot = require('node-telegram-bot-api');
const token = '7124361098:AAHUee-cReFTQinJQBZSBI7wob2QOIgmFRA';  // Ваш токен
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const webAppUrl = 'https://babasha.github.io/open-store-react/'; // Замените на URL вашего веб-приложения

  const opts = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Open Web App', web_app: { url: webAppUrl } }]
      ]
    }
  };

  bot.sendMessage(chatId, 'Click the button to open the web app:', opts);
});
