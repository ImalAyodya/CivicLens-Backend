const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// GET all users
router.get('/', userController.getAllUsers);

// GET user by ID
router.get('/:id', userController.getUserById);

// POST new user
router.post('/', userController.createUser);

// PUT update user
router.put('/:id', userController.updateUser);

// PUT update device token
router.put('/:id/device-token', userController.updateDeviceToken);

// DELETE user
router.delete('/:id', userController.deleteUser);

module.exports = router;