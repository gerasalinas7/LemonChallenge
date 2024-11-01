const operationService = require('../services/operationService');
const mongoose = require('mongoose');

exports.healthCheck = (req, res) => {
  res.status(200).json({ status: 'OperationService is healthy' });
};

exports.createOperation = async (req, res) => {
  const { transaction_id, type, user_id, amount, currency } = req.body;

  if (!transaction_id || !type || !user_id || !amount || !currency) {
    return res.status(400).json({ message: 'Faltan campos obligatorios en la solicitud' });
  }

  try {
    const operation = await operationService.createOperation(req.body);
    res.status(201).json(operation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOperations = async (req, res) => {
  try {
    const operations = await operationService.getAllOperations();
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOperationById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de operación no válido' });
  }

  try {
    const operation = await operationService.getOperationById(id);
    if (!operation) return res.status(404).json({ message: 'Operación no encontrada' });
    res.status(200).json(operation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFilteredOperations = async (req, res) => {
  const { user_id, company, account_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'El user_id es obligatorio para la consulta filtrada' });
  }

  try {
    const operations = await operationService.getFilteredOperations(user_id, company, account_id);
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateOperation = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de operación no válido' });
  }

  try {
    const operation = await operationService.updateOperation(id, req.body);
    if (!operation) return res.status(404).json({ message: 'Operación no encontrada' });
    res.status(200).json(operation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOperation = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de operación no válido' });
  }

  try {
    const operation = await operationService.deleteOperation(id);
    if (!operation) return res.status(404).json({ message: 'Operación no encontrada' });
    res.status(200).json({ message: 'Operación eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};