const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Get all users
router.get('/all', UserController.getAllUsers);

// Get a specific user by ID
router.get('/get/:id', UserController.get);

// Create a new user
router.post('/create', UserController.create);

// Update an existing user
router.put('/update/:id', UserController.update);

// Delete a user
router.delete('/delete/:id', UserController.delete);

module.exports = router;
