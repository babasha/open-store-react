(function () {
    if (typeof window.Telegram === 'undefined') {
      window.Telegram = {};
    }
    if (typeof window.Telegram.WebApp === 'undefined') {
      window.Telegram.WebApp = {};
    }
  
    const WebApp = window.Telegram.WebApp;
  
    WebApp.ready = function () {
      document.dispatchEvent(new Event('TelegramWebAppReady'));
    };
  
    WebApp.initDataUnsafe = {};
  })();
  