const Operation = require('../models/Operation');

const createOperation = async (operationData) => {
  const operation = new Operation(operationData);
  return await operation.save();
};

const createOperationFromTransaction = async (transactionData) => {
  const operationData = {
    transaction_id: transactionData.transaction_id,
    type: transactionData.type,
    user_id: transactionData.user_id,
    amount: transactionData.amount,
    currency: transactionData.currency,
    created_at: transactionData.created_at,
    data: transactionData.additional_data.map(item => ({
        name: item.name,
        value: String(item.value)
      })),
  };

  if (transactionData.type === 'BILL_PAYMENT') {
    operationData.company = transactionData.company;
    operationData.account_id = transactionData.account_id;
  }
  
  const operation = new Operation(operationData);
  return await operation.save();
};

const getAllOperations = async () => {
  return await Operation.find();
};

const getOperationById = async (id) => {
  return await Operation.findById(id);
};

const updateOperation = async (id, updateData) => {
  return await Operation.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteOperation = async (id) => {
  return await Operation.findByIdAndDelete(id);
};

const getFilteredOperations = async (userId, company, accountId) => {
    const filter = { user_id: userId };
    if (company) filter.company = company;
    if (accountId) filter.account_id = accountId;
  
    return await Operation.find(filter);
  };

module.exports = {
  createOperation,
  createOperationFromTransaction,
  getAllOperations,
  getOperationById,
  updateOperation,
  deleteOperation,
  getFilteredOperations
};
