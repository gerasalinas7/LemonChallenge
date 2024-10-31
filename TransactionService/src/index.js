require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const { connectRabbitMQ } = require('./services/messageQueue');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(express.json());

connectDB();
connectRabbitMQ();

app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`TransactionService running on port ${PORT}`));
