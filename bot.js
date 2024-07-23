const TelegramBot = require('node-telegram-bot-api');
const token = '7190161649:AAGFEHTtW2HaJoyXkj9d--KelDAz0R28vIk';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Ниже появится кнопка', {
      reply_markup: {
        keyboard: [
          [{ text: 'Заполнить форму' }]
        ],
        resize_keyboard: true, // Добавляем опцию для автоматического изменения размера клавиатуры
        one_time_keyboard: true // Добавляем опцию, чтобы клавиатура исчезала после нажатия кнопки
      }
    });
  }
});
