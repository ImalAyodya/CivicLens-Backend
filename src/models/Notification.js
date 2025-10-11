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
    enum: ['news', 'election', 'fact', 'system','general'],
    default: 'system',
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceModel',
    required: function() {
      return this.referenceModel != null;
    }
  },
  referenceModel: {
    type: String,
    enum: ['News', 'Election', null],
    validate: {
      validator: function(v) {
        // Either both reference and referenceModel are set, or both are null/undefined
        return (this.reference && v) || (!this.reference && !v);
      },
      message: 'Reference and referenceModel must both be set or both be null'
    }
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