// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg', // Используем PostgreSQL
    connection: {
      host: 'enddel.com', // Домен вашего сервера
      user: 'postgres', // Имя пользователя базы данных
      password: '953764', // Пароль пользователя базы данных
      database: 'openstore', // Имя базы данных
      ssl: {
        rejectUnauthorized: false // В некоторых случаях может понадобиться, если используется самоподписанный сертификат
      }
    },
    migrations: {
      directory: './migrations', // Путь к миграциям
    },
    seeds: {
      directory: './seeds', // Путь к семенам (начальным данным)
    },
  },
  staging: {
    client: 'pg', // Используем PostgreSQL
    connection: {
      host: 'enddel.com', // Домен вашего сервера
      user: 'postgres', // Имя пользователя базы данных
      password: '953764', // Пароль пользователя базы данных
      database: 'openstore', // Имя базы данных
      ssl: {
        rejectUnauthorized: false // В некоторых случаях может понадобиться, если используется самоподписанный сертификат
      }
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations', // Путь к миграциям
    },
    seeds: {
      directory: './seeds', // Путь к семенам (начальным данным)
    },
  },
  production: {
    client: 'pg', // Используем PostgreSQL
    connection: {
      host: 'enddel.com', // Домен вашего сервера
      user: 'postgres', // Имя пользователя базы данных
      password: '953764', // Пароль пользователя базы данных
      database: 'openstore', // Имя базы данных
      ssl: {
        rejectUnauthorized: false // В некоторых случаях может понадобиться, если используется самоподписанный сертификат
      }
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations', // Путь к миграциям
    },
    seeds: {
      directory: './seeds', // Путь к семенам (начальным данным)
    },
  }
};
