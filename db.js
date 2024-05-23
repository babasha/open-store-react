const { Pool } = require('pg');

const pool = new Pool({
  user: 'babasha',
  host: 'localhost',
  database: 'openstore',
  password: '953764',
  port: 5432,
});

module.exports = pool;