const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes for citizen users only
router.post('/register', authController.registerCitizen);
router.post('/login', authController.loginUser);

// Protected routes
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);
router.put('/notification-preferences', protect, authController.updateNotificationPreferences);
router.put('/device-token', protect, authController.updateDeviceToken);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;