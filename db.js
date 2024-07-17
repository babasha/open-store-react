const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '45.146.164.162', // IP-адрес вашего удаленного сервера
  database: 'openstore',
  password: '953764',
  port: 5432,
});

module.exports = pool;
