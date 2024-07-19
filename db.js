const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'enddel.com', // Домен вашего сервера
  database: 'openstore',
  password: '953764',
  port: 5432,
  ssl: {
    rejectUnauthorized: false // В некоторых случаях может понадобиться, если используется самоподписанный сертификат
  }
});

module.exports = pool;
