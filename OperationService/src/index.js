require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const { connectRabbitMQ } = require('./services/messageQueue');
const operationRoutes = require('./routes/operationRoutes');

const app = express();
app.use(express.json());

connectDB();
connectRabbitMQ();

app.use('/api/operations', operationRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`OperationService running on port ${PORT}`));
