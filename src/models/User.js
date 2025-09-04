const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  deviceToken: {
    type: String,
  },
  notificationPreferences: {
    elections: { type: Boolean, default: true },
    news: { type: Boolean, default: true },
    electionFacts: { type: Boolean, default: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);