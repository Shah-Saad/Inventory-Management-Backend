const express = require('express');
const router = express.Router();
const StockMovementController = require('../controllers/stock_movementController');
const { verifyToken, isRole } = require('../middlewares/authMiddleware');

// 🔒 Only store_owner can record a new stock movement (stock-in, sale, manual-removal)
router.post('/create', verifyToken, isRole('store_owner'), StockMovementController.create);

// 🔒 Get all stock movements — admin only
router.get('/all', verifyToken, isRole('admin'), StockMovementController.getAll);

// 🔒 Get stock movements for a specific store (store_owner can only see their own, logic inside controller)
router.get('/store/:store_id', verifyToken, StockMovementController.getByStore);

// 🔒 Filtered stock movements for a store (e.g. by date range) — both roles
router.get('/filter/:id', verifyToken, StockMovementController.getFiltered);

module.exports = router;
