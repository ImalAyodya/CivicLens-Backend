const admin = require('../config/firebase');
const User = require('../models/User');
const Notification = require('../models/Notification');

const notificationService = {
  // Send push notification to a single user
  async sendToUser(userId, title, body, data = {}) {
    try {
      const user = await User.findById(userId);
      
      if (!user || !user.deviceToken) {
        return { success: false, message: 'User not found or has no device token' };
      }

      const message = {
        notification: {
          title,
          body,
        },
        data,
        token: user.deviceToken,
      };

      const response = await admin.messaging().send(message);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error };
    }
  },

  // Send push notification to multiple users
  async sendToMultipleUsers(userIds, title, body, data = {}) {
    try {
      const users = await User.find({ _id: { $in: userIds } });
      const tokens = users.filter(user => user.deviceToken).map(user => user.deviceToken);

      if (tokens.length === 0) {
        return { success: false, message: 'No valid device tokens found' };
      }

      const message = {
        notification: {
          title,
          body,
        },
        data,
        tokens,
      };

      const response = await admin.messaging().sendMulticast(message);
      return { 
        success: true, 
        successCount: response.successCount,
        failureCount: response.failureCount
      };
    } catch (error) {
      console.error('Error sending notifications:', error);
      return { success: false, error };
    }
  },

  // Send push notification to all users
  async sendToAllUsers(title, body, data = {}, filterPreference = null) {
    try {
      // If there's a filter preference (like 'elections' or 'news'),
      // only get users who have that notification preference enabled
      let query = {};
      if (filterPreference) {
        query[`notificationPreferences.${filterPreference}`] = true;
      }

      const users = await User.find(query);
      const tokens = users.filter(user => user.deviceToken).map(user => user.deviceToken);

      if (tokens.length === 0) {
        return { success: false, message: 'No valid device tokens found' };
      }

      // Firebase can only send to 500 tokens at once, so we batch them
      const batchSize = 500;
      const batches = [];

      for (let i = 0; i < tokens.length; i += batchSize) {
        const batch = tokens.slice(i, i + batchSize);
        batches.push(batch);
      }

      let successCount = 0;
      let failureCount = 0;

      for (const batch of batches) {
        const message = {
          notification: {
            title,
            body,
          },
          data,
          tokens: batch,
        };

        const response = await admin.messaging().sendMulticast(message);
        successCount += response.successCount;
        failureCount += response.failureCount;
      }

      return { 
        success: true, 
        successCount,
        failureCount
      };
    } catch (error) {
      console.error('Error sending notifications:', error);
      return { success: false, error };
    }
  },

  // Create notification record in database and send push notification
  async createAndSendNotification(title, message, type, reference = null, referenceModel = null, sendToAll = true, userIds = []) {
    try {
      // Create notification record
      const notification = new Notification({
        title,
        message,
        type,
        reference,
        referenceModel,
        sentToAll: sendToAll,
      });
      
      // If not sent to all, add specific recipients
      if (!sendToAll && userIds.length > 0) {
        notification.recipients = userIds.map(id => ({
          userId: id,
          read: false
        }));
      }
      
      await notification.save();

      // Send push notification
      let notificationResult;
      
      if (sendToAll) {
        // Map type to preference filter
        const preferenceFilter = type === 'news' ? 'news' : 
                                type === 'election' ? 'elections' :
                                type === 'fact' ? 'electionFacts' : null;
        
        notificationResult = await this.sendToAllUsers(
          title, 
          message, 
          { 
            type, 
            notificationId: notification._id.toString(),
            ...(reference ? { referenceId: reference.toString() } : {}),
            ...(referenceModel ? { referenceModel } : {})
          },
          preferenceFilter
        );
      } else if (userIds.length > 0) {
        notificationResult = await this.sendToMultipleUsers(
          userIds, 
          title, 
          message, 
          { 
            type, 
            notificationId: notification._id.toString(),
            ...(reference ? { referenceId: reference.toString() } : {}),
            ...(referenceModel ? { referenceModel } : {})
          }
        );
      }

      return { notification, notificationResult };
    } catch (error) {
      console.error('Error creating and sending notification:', error);
      throw error;
    }
  }
};

module.exports = notificationService;