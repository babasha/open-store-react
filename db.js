const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'https://enddel.com', // IP-адрес вашего удаленного сервера
  database: 'openstore',
  password: '953764',
  port: 5432,
});

module.exports = pool;
