const Transaction = require('../models/Transaction');
const messageQueue = require('./messageQueue');

const createTransaction = async (transactionData) => {
  const transaction = new Transaction(transactionData);
  const savedTransaction = await transaction.save();

  // Publicar evento en RabbitMQ
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
  messageQueue.publish('transaction_created', message);

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

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
