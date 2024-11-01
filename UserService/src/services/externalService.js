const amqp = require('amqplib');

let channel;
const responseMap = new Map(); 

const connectRabbitMQ = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      console.log('Attempting to connect to RabbitMQ...');
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();

      await channel.assertQueue('reply_queue', { durable: false });
      console.log('UserService connected to RabbitMQ and reply_queue declared');
      
      channel.consume('reply_queue', (msg) => {
        const correlationId = msg.properties.correlationId;
        const response = JSON.parse(msg.content.toString());

        if (responseMap.has(correlationId)) {
          responseMap.get(correlationId).resolve(response);
          responseMap.delete(correlationId); 
        } else {
          console.log(`Correlation ID did not match any pending request (received: ${correlationId})`);
        }
      }, { noAck: true });

      return;
    } catch (error) {
      console.error('Failed to connect to RabbitMQ, retrying...', error);
      retries -= 1;
      if (!retries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const sendRequest = (queue, message) => {
  return new Promise((resolve, reject) => {
    const correlationId = generateCorrelationId();
    console.log(`Preparing to send request to queue: ${queue} with correlationId: ${correlationId}`);

    responseMap.set(correlationId, { resolve, reject });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      correlationId,
      replyTo: 'reply_queue',
    });
  });
};

const generateCorrelationId = () => `${Math.random()}_${Date.now()}`;

const getUserTransactions = async (userId) => {
  console.log(`Requesting transactions for user_id: ${userId}`);
  const message = { user_id: userId };
  return await sendRequest('transaction_request_queue', message);
};

const getUserOperations = async (userId) => {
  console.log(`Requesting operations for user_id: ${userId}`);
  const message = { user_id: userId };
  return await sendRequest('operation_request_queue', message);
};

const getFilteredUserOperations = async (userId, company, account_id) => {
  console.log(`Requesting filtered operations for user_id: ${userId}, company: ${company}, account_id: ${account_id}`);
  const message = { user_id: userId, company, account_id };
  return await sendRequest('operation_request_queue', message);
};

module.exports = {
  connectRabbitMQ,
  getUserTransactions,
  getUserOperations,
  getFilteredUserOperations,
};
