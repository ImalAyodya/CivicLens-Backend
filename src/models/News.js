const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  },
  category: {
    type: String,
    enum: ['election', 'politics', 'law', 'general', 'policy', 'legal', 'education', 'economy', 'development'],
    default: 'general',
  },
  author: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    default: 'CivicLens'
  },
  imageUrl: {
    type: String,
  },
  isBreaking: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  relatedPoliticians: [String],
  // Add likes tracking
  likes: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  // Add comments
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('News', newsSchema);