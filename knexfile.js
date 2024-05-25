// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg', // Используем PostgreSQL
    connection: {
      host: '127.0.0.1', // Локальный хост
      user: 'postgres', // Имя пользователя базы данных
      password: '953764', // Пароль пользователя базы данных
      database: 'openstore', // Имя базы данных
    },
    migrations: {
      directory: './migrations', // Путь к миграциям
    },
    seeds: {
      directory: './seeds', // Путь к семенам (начальным данным)
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
