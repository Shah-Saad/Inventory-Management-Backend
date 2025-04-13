const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/storeController');
const { verifyToken, isRole } = require('../middlewares/authMiddleware');

// 🔒 Admin-only: Get all stores
router.get('/all', verifyToken, isRole('admin'), StoreController.getAllStores);

// 🔒 Store owner or admin can view a specific store
// Controller should ensure store_owner can only access their own store
router.get('/get/:id', verifyToken, StoreController.get);

// 🔒 Admin-only: Create a new store
router.post('/create', verifyToken, isRole('admin'), StoreController.create);

// 🔒 Admin-only: Update a store
router.put('/update/:id', verifyToken, isRole('admin'), StoreController.update);

// 🔒 Admin-only: Delete a store
router.delete('/delete/:id', verifyToken, isRole('admin'), StoreController.delete);

module.exports = router;
