const express = require('express');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

// Protected routes - require authentication
router.post('/', protect, userController.createUser);
router.put('/:id', protect, userController.updateUser);
router.put('/:id/device-token', protect, userController.updateDeviceToken);
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);

// Registration and login routes (if not using authRoutes)
// router.post('/register', authController.register);
// router.post('/login', authController.login);

module.exports = router;