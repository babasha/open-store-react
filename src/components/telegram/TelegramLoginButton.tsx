// src/components/TelegramLoginButton.tsx
import React, { useEffect } from 'react';

interface TelegramLoginButtonProps {
  botName: string; // Имя пользователя вашего бота без @
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
    // @ts-ignore
    window.TelegramLoginWidget = {
      dataOnauth: (user: TelegramUser) => {
        onAuth(user);
      },
    };
  }, [onAuth]);

  return (
    <div>
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?7"
        data-telegram-login={botName}
        data-size="large"
        data-userpic="false"
        data-request-access="write"
        data-auth-url={`${window.location.origin}/telegram-auth`} // URL вашего бэкенда для аутентификации
      ></script>
    </div>
  );
};

export default TelegramLoginButton;
