const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// GET all notifications
router.get('/', notificationController.getAllNotifications);

// GET user notifications
router.get('/user/:userId', notificationController.getUserNotifications);

// PUT mark notification as read
router.put('/:notificationId/read/:userId', notificationController.markNotificationAsRead);

// PUT update notification preferences
router.put('/preferences/:userId', notificationController.updateNotificationPreferences);

// POST send custom notification
router.post('/send', notificationController.sendCustomNotification);

module.exports = router;