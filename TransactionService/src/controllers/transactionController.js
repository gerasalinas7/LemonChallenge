const transactionService = require('../services/transactionService');
const mongoose = require('mongoose');

exports.healthCheck = (req, res) => {
  res.status(200).json({ status: 'TransactionService is healthy' });
};

exports.createTransaction = async (req, res) => {
    const { type, user_id, amount, currency } = req.body;
  
    if (!type || !user_id || !amount || !currency) {
      return res.status(400).json({ message: 'Faltan campos obligatorios en la solicitud' });
    }
  
    const validTypes = ['SWAP', 'DEPOSIT', 'WITHDRAWAL', 'BILL_PAYMENT'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Tipo de transacción no válido' });
    }
  
    try {
      const transaction = await transactionService.createTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionById = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de transacción no válido' });
    }
  
    try {
      const transaction = await transactionService.getTransactionById(id);
      if (!transaction) return res.status(404).json({ message: 'Transacción no encontrada' });
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.updateTransaction = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de transacción no válido' });
    }
  
    try {
      const transaction = await transactionService.updateTransaction(id, req.body);
      if (!transaction) return res.status(404).json({ message: 'Transacción no encontrada' });
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de transacción no válido' });
    }
  
    try {
      const transaction = await transactionService.deleteTransaction(id);
      if (!transaction) return res.status(404).json({ message: 'Transacción no encontrada' });
      res.status(200).json({ message: 'Transacción eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
