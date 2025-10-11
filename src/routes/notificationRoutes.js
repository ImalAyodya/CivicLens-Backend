const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// GET all notifications
router.get('/', notificationController.getAllNotifications);

// GET user notifications
router.get('/user/:userId', notificationController.getUserNotifications);

// POST send test notification
router.post('/test', notificationController.sendTestNotification);

// PUT mark notification as read - with authentication
router.put('/:notificationId/read', authMiddleware.protect, notificationController.markAsRead);

// Legacy route - keep for backward compatibility
router.put('/:notificationId/read/:userId', notificationController.markNotificationAsRead);

// PUT update notification preferences
router.put('/preferences/:userId', notificationController.updateNotificationPreferences);

// POST send custom notification
router.post('/send', notificationController.sendCustomNotification);

module.exports = router;