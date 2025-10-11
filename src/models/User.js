const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['citizen', 'politician', 'admin'],
    default: 'citizen'
  },
  deviceToken: {
    type: String
  },
  profilePicture: {
    type: String,
    default: '/assets/default-profile.png'
  },
  notificationPreferences: {
    elections: { type: Boolean, default: true },
    news: { type: Boolean, default: true },
    facts: { type: Boolean, default: true },
    events: { type: Boolean, default: true },
    promiseUpdates: { type: Boolean, default: true }
  },
  // Additional fields for politicians
  party: {
    type: String,
    default: null
  },
  position: {
    type: String,
    default: null
  },
  constituency: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('User', userSchema);