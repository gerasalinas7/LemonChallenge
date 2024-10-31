const express = require('express');
const router = express.Router();
const operationController = require('../controllers/operationController');

router.get('/health', operationController.healthCheck);
router.post('/', operationController.createOperation);
router.get('/', operationController.getAllOperations);
router.get('/:id', operationController.getOperationById);
router.put('/:id', operationController.updateOperation);
router.delete('/:id', operationController.deleteOperation);

module.exports = router;
