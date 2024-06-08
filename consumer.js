const amqp = require('amqplib/callback_api');

amqp.connect('amqps://vwqkiirc:v_wOcr-d7J8f9wE2kLSdMXJa-sAmxPW0@goose.rmq2.cloudamqp.com/vwqkiirc', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    const queue = 'messages';

    channel.assertQueue(queue, {
      durable: false
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, (msg) => {
      console.log(" [x] Received %s", msg.content.toString());
    }, {
      noAck: true
    });
  });
});
