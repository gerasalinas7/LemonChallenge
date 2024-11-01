const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/health', userController.healthCheck);
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:userId/operations', userController.getUserOperations);
router.get('/:userId/operations/filter', userController.getFilteredOperations);

module.exports = router;
