const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/health', userController.healthCheck);
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:userId/transactions', userController.getUserTransactions);
router.get('/:userId/operations', userController.getUserOperations);

module.exports = router;
