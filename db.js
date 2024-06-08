const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'amqps://vwqkiirc:v_wOcr-d7J8f9wE2kLSdMXJa-sAmxPW0@goose.rmq2.cloudamqp.com/vwqkiirc',
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
