const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventoryController');
const { verifyToken, isRole } = require('../middlewares/authMiddleware');

// GET /api/inventory - Admin only
router.get('/', verifyToken, isRole('admin'), InventoryController.getAll);

// GET /api/inventory/get/:store_id - Admin or Store Owner (only their own store checked in controller)
router.get('/get/:store_id', verifyToken, isRole('admin', 'store_owner'), InventoryController.getByStore);

// POST /api/inventory - Store Owner only
router.post('/', verifyToken, isRole('store_owner'), InventoryController.create);

// PUT /api/inventory/:id - Store Owner only
router.put('/:id', verifyToken, isRole('store_owner'), InventoryController.update);

// DELETE /api/inventory/:id - Store Owner only
router.delete('/:id', verifyToken, isRole('store_owner'), InventoryController.delete);

module.exports = router;
