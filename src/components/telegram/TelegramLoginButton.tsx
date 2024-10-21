// src/components/telegram/TelegramLoginButton.tsx
import React, { useEffect } from 'react';

interface TelegramLoginButtonProps {
  botName: string; // Имя вашего бота без @
  onAuth: (user: TelegramUser) => void;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({ botName, onAuth }) => {
  useEffect(() => {
    console.log('TelegramLoginButton: useEffect called');

    // Определяем глобальную функцию для обработки аутентификации
    (window as any).TelegramLoginWidget = {
      dataOnauth: (user: TelegramUser) => {
        console.log('TelegramLoginWidget.dataOnauth called with user:', user);
        onAuth(user);
      },
    };

    // Проверяем, загружен ли уже скрипт
    const existingScript = document.getElementById('telegram-widget-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?15';
      script.id = 'telegram-widget-script';
      script.setAttribute('data-telegram-login', botName);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-userpic', 'false');
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-auth-url', `${window.location.origin}/auth/telegram`); // Убедитесь, что это правильный URL
      script.async = true;

      script.onload = () => {
        console.log('TelegramLoginButton: telegram-widget.js loaded successfully');
      };

      script.onerror = () => {
        console.error('TelegramLoginButton: Failed to load telegram-widget.js');
      };

      document.body.appendChild(script);
    } else {
      console.log('TelegramLoginButton: telegram-widget.js already exists');
    }

    // Очистка при размонтировании компонента (опционально)
    return () => {
      // Если нужно удалить скрипт при размонтировании
      // const script = document.getElementById('telegram-widget-script');
      // if (script) {
      //   script.remove();
      // }
    };
  }, [botName, onAuth]);

  return <div id="telegram-login-button"></div>;
};

export default TelegramLoginButton;
