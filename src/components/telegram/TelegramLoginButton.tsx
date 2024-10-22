// src/components/telegram/TelegramLoginButton.tsx

import React, { useEffect, useRef } from 'react';

interface TelegramLoginButtonProps {
  botName: string;
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('TelegramLoginButton: useEffect called');

    // Определяем глобальную функцию для обработки аутентификации
    (window as any).TelegramLoginWidgetCallback = (user: TelegramUser) => {
      console.log('TelegramLoginWidgetCallback called with user:', user);
      onAuth(user);
    };

    // Создаем элемент <script> и настраиваем его атрибуты
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?15';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-onauth', 'TelegramLoginWidgetCallback(user)');
    script.async = true;

    // Добавляем скрипт в контейнер
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
    }

    // Очистка функции при размонтировании компонента
    return () => {
      delete (window as any).TelegramLoginWidgetCallback;
    };
  }, [botName, onAuth]);

  return <div ref={containerRef}></div>;
};

export default TelegramLoginButton;