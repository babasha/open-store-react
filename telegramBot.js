const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

let users = [];

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;

  if (!users.find(user => user.chatId === chatId)) {
    users.push({ chatId, username });
    bot.sendMessage(chatId, 'Welcome! You are successfully registered.');
  } else {
    bot.sendMessage(chatId, 'You are already registered.');
  }
});

module.exports = { bot, users };
