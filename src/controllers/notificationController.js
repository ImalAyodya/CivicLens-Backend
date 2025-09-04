const Notification = require('../models/Notification');
const User = require('../models/User');
const notificationService = require('../services/notificationService');

const notificationController = {
  // Get all notifications
  async getAllNotifications(req, res) {
    try {
      const notifications = await Notification.find().sort({ sentAt: -1 });
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error getting notifications:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get user notifications
  async getUserNotifications(req, res) {
    try {
      const { userId } = req.params;
      
      // Find notifications that were either sent to all users or specifically to this user
      const notifications = await Notification.find({
        $or: [
          { sentToAll: true },
          { 'recipients.userId': userId }
        ]
      }).sort({ sentAt: -1 });
      
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error getting user notifications:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Mark notification as read
  async markNotificationAsRead(req, res) {
    try {
      const { userId, notificationId } = req.params;
      
      const notification = await Notification.findById(notificationId);
      
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      
      // If the notification was sent to all users, add this user to recipients and mark as read
      if (notification.sentToAll) {
        const existingRecipient = notification.recipients.find(
          recipient => recipient.userId.toString() === userId
        );
        
        if (existingRecipient) {
          existingRecipient.read = true;
          existingRecipient.readAt = new Date();
        } else {
          notification.recipients.push({
            userId,
            read: true,
            readAt: new Date()
          });
        }
      } else {
        // For targeted notifications, find and update the specific recipient
        const recipientIndex = notification.recipients.findIndex(
          recipient => recipient.userId.toString() === userId
        );
        
        if (recipientIndex === -1) {
          return res.status(400).json({ message: 'User is not a recipient of this notification' });
        }
        
        notification.recipients[recipientIndex].read = true;
        notification.recipients[recipientIndex].readAt = new Date();
      }
      
      await notification.save();
      res.status(200).json(notification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update user notification preferences
  async updateNotificationPreferences(req, res) {
    try {
      const { userId } = req.params;
      const { elections, news, electionFacts } = req.body;
      
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update only the provided preferences
      if (elections !== undefined) {
        user.notificationPreferences.elections = elections;
      }
      
      if (news !== undefined) {
        user.notificationPreferences.news = news;
      }
      
      if (electionFacts !== undefined) {
        user.notificationPreferences.electionFacts = electionFacts;
      }
      
      await user.save();
      res.status(200).json(user.notificationPreferences);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Send custom notification
  async sendCustomNotification(req, res) {
    try {
      const { title, message, type, userIds } = req.body;
      
      if (!title || !message) {
        return res.status(400).json({ message: 'Title and message are required' });
      }
      
      const result = await notificationService.createAndSendNotification(
        title,
        message,
        type || 'system',
        null,
        null,
        !userIds || userIds.length === 0,
        userIds
      );
      
      res.status(201).json(result);
    } catch (error) {
      console.error('Error sending custom notification:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = notificationController;