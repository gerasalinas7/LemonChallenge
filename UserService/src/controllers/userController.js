const userService = require('../services/userService');
const externalService = require('../services/externalService');

exports.healthCheck = (req, res) => {
  res.status(200).json({ status: 'UserService is healthy' });
};

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await externalService.getUserTransactions(req.params.userId);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOperations = async (req, res) => {
  try {
    const operations = await externalService.getUserOperations(req.params.userId);
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
