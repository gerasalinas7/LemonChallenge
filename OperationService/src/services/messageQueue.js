const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertExchange('transaction_exchange', 'direct', { durable: true });
      console.log('Connected to RabbitMQ');
      return;
    } catch (error) {
      console.error('Failed to connect to RabbitMQ, retrying...', error);
      retries -= 1;
      if (!retries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};


module.exports = { connectRabbitMQ };
