require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { connectRabbitMQ } = require('./services/externalService');

const app = express();
app.use(express.json());

connectDB();
connectRabbitMQ();

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`UserService running on port ${PORT}`));
