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


// Create user (Sign Up)
router.post('/signup', userController.createUser);

// Login
router.post('/login', userController.loginUser);

// Get logged-in user details
router.get('/me', auth, userController.getLoggedUserDetails);

// Update user details
router.put('/me', auth, userController.updateUserDetails);

// Delete user
router.delete('/me', auth, userController.deleteUser);

module.exports = router;