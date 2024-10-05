const paymentService = require('./paymentService'); // Убедитесь, что путь к файлу корректный

(async () => {
  try {
    const orderId = 'f1b99c13-c3e4-48d3-8089-2e8de24ea85f'; // Замените на ваш actual orderId
    await paymentService.getReceipt(orderId);
  } catch (error) {
    console.error('Ошибка при получении чека:', error.message);
  }
})();
