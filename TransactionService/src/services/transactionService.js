const Transaction = require('../models/Transaction');
const { publishToQueue } = require('./messageQueue');

const createTransaction = async (transactionData) => {
    console.log('Starting transaction creation process');
    console.log('Received transaction data:', transactionData);
  
    const transaction = new Transaction(transactionData);
    const savedTransaction = await transaction.save();
    console.log('Transaction saved to database with ID:', savedTransaction._id);
  
    const message = {
      transaction_id: savedTransaction._id,
      type: savedTransaction.type,
      user_id: savedTransaction.user_id,
      amount: savedTransaction.amount,
      currency: savedTransaction.currency,
      created_at: savedTransaction.created_at,
      status: savedTransaction.status,
      additional_data: savedTransaction.additional_data,
    };
  
    if (savedTransaction.type === 'BILL_PAYMENT') {
      message.company = savedTransaction.company;
      message.account_id = savedTransaction.account_id;
      console.log('BILL_PAYMENT detected, added company and account_id to message:', { 
        company: savedTransaction.company, 
        account_id: savedTransaction.account_id 
      });
    }
  
    console.log('Publishing message to transaction_exchange with routingKey=transaction_created');

    publishToQueue('transaction_created', message);
    return savedTransaction;
  };

const getAllTransactions = async () => {
  return await Transaction.find();
};

const getTransactionById = async (id) => {
  return await Transaction.findById(id);
};

const updateTransaction = async (id, updateData) => {
  return await Transaction.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteTransaction = async (id) => {
  return await Transaction.findByIdAndDelete(id);
};

const getTransactionsByUserId = async (user_id) => {
    if (!user_id || typeof user_id !== 'string' || user_id.trim() === '') {
        throw new Error('Invalid user_id: user_id must be a non-empty string');
    }

    try {
      const transactions = await Transaction.find({ user_id });
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions by user ID:', error.message);
      throw new Error('Could not retrieve transactions for the specified user');
    }
  };

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionsByUserId
};
