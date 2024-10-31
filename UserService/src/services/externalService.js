const axios = require('axios');

const getUserTransactions = async (userId) => {
  try {
    const response = await axios.get(`${process.env.TRANSACTION_SERVICE_URL}/api/transactions?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    throw new Error('Could not retrieve user transactions');
  }
};

const getUserOperations = async (userId) => {
  try {
    const response = await axios.get(`${process.env.OPERATION_SERVICE_URL}/api/operations?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching operations:', error.message);
    throw new Error('Could not retrieve user operations');
  }
};

module.exports = {
  getUserTransactions,
  getUserOperations,
};
