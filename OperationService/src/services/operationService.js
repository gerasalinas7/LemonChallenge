const Operation = require('../models/Operation');

// Crear una operación manualmente
const createOperation = async (operationData) => {
  const operation = new Operation(operationData);
  return await operation.save();
};

// Crear una operación a partir de una transacción recibida
const createOperationFromTransaction = async (transactionData) => {
  const operationData = {
    transaction_id: transactionData.transaction_id,
    type: transactionData.type,
    user_id: transactionData.user_id,
    amount: transactionData.amount,
    currency: transactionData.currency,
    created_at: transactionData.created_at,
    data: [
      { name: 'status', value: transactionData.status },
      ...Object.keys(transactionData.additional_data || {}).map(key => ({
        name: key,
        value: transactionData.additional_data[key],
      })),
    ],
  };

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

module.exports = {
  createOperation,
  createOperationFromTransaction,
  getAllOperations,
  getOperationById,
  updateOperation,
  deleteOperation,
};
