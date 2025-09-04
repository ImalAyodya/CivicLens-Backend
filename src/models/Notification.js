const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['news', 'election', 'fact', 'system'],
    default: 'system',
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceModel',
  },
  referenceModel: {
    type: String,
    enum: ['News', 'Election'],
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  sentToAll: {
    type: Boolean,
    default: false,
  },
  recipients: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    read: { type: Boolean, default: false },
    readAt: { type: Date }
  }]
});

module.exports = mongoose.model('Notification', notificationSchema);