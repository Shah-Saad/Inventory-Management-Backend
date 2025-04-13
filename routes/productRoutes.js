const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { verifyToken, isRole } = require('../middlewares/authMiddleware');

// Get all products (open to everyone)
router.get('/all', ProductController.getAll);

// Get a specific product by ID (open to everyone)
router.get('/get/:id', ProductController.get);

// 🔐 Admin-only routes
// Create a new product
router.post('/create', verifyToken, isRole('admin'), ProductController.create);

// Update a product
router.put('/update/:id', verifyToken, isRole('admin'), ProductController.update);

// Delete a product
router.delete('/delete/:id', verifyToken, isRole('admin'), ProductController.delete);

module.exports = router;
