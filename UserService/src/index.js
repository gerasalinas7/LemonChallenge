const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: process.env.SERVICE_NAME });
});

app.listen(PORT, () => {
    console.log(`Service ${process.env.SERVICE_NAME} is running on port ${PORT}`);
});