const operationService = require('../services/operationService');

exports.healthCheck = (req, res) => {
  res.status(200).json({ status: 'OperationService is healthy' });
};

exports.createOperation = async (req, res) => {
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
  try {
    const operation = await operationService.getOperationById(req.params.id);
    if (!operation) return res.status(404).json({ message: 'Operation not found' });
    res.status(200).json(operation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOperation = async (req, res) => {
  try {
    const operation = await operationService.updateOperation(req.params.id, req.body);
    if (!operation) return res.status(404).json({ message: 'Operation not found' });
    res.status(200).json(operation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOperation = async (req, res) => {
  try {
    const operation = await operationService.deleteOperation(req.params.id);
    if (!operation) return res.status(404).json({ message: 'Operation not found' });
    res.status(200).json({ message: 'Operation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
