const amqp = require('amqplib');
const operationService = require('./operationService');

let channel = null;

const connectRabbitMQ = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();

      await channel.assertExchange('transaction_exchange', 'direct', { durable: true });
      
      const { queue } = await channel.assertQueue('', { exclusive: true });
      await channel.bindQueue(queue, 'transaction_exchange', 'transaction_created');

      channel.consume(queue, async (msg) => {
        const transactionData = JSON.parse(msg.content.toString());
        console.log('Received transaction data:', transactionData);

        await operationService.createOperationFromTransaction(transactionData);

        channel.ack(msg);
      });

      console.log('Connected to RabbitMQ and listening for transaction_created messages');
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

