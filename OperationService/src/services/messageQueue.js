const amqp = require('amqplib');
const operationService = require('./operationService');

let channel;

const connectRabbitMQ = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      console.log('Attempting to connect to RabbitMQ...');
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();

      await channel.assertExchange('transaction_exchange', 'direct', { durable: true });
      const { queue } = await channel.assertQueue('', { exclusive: true });
      await channel.bindQueue(queue, 'transaction_exchange', 'transaction_created');

      channel.consume(queue, async (msg) => {
        const transactionData = JSON.parse(msg.content.toString());
        console.log('Received transaction data for creating operation:', transactionData);

        await operationService.createOperationFromTransaction(transactionData);
        channel.ack(msg);
      });

      console.log('Connected to transaction_exchange and listening for transaction_created messages');

      await channel.assertQueue('operation_request_queue', { durable: false });
      console.log('Listening for operation data requests on operation_request_queue');

      channel.consume('operation_request_queue', async (msg) => {
        const { user_id, company, account_id } = JSON.parse(msg.content.toString());
        
        const correlationId = msg.properties.correlationId;
        const replyTo = msg.properties.replyTo;

        console.log(`Received request for filtered operations: user_id=${user_id}, company=${company}, account_id=${account_id}`);
        
        const operations = await operationService.getFilteredOperations(user_id, company, account_id);

        if (correlationId && replyTo) {
          channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(operations)), { correlationId });
          console.log(`Responding with correlationId: ${correlationId} to ${replyTo}`);
        } else {
          console.error('correlationId or replyTo is missing in the message properties');
        }
        
        channel.ack(msg);
      });

      console.log('OperationService is ready and listening on operation_request_queue');
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
