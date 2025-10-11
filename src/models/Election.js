const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  image: { type: String },
  promises: [{
    description: { type: String, required: true },
    fulfilled: { type: Boolean, default: false },
  }],
  votes: { type: Number, default: 0 },
});

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,  // Make sure this field is defined
    required: true
  },
  type: {
    type: String,
    enum: ['presidential', 'parliamentary', 'provincial', 'local'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
  candidates: [candidateSchema],
  regions: [{
    name: { type: String, required: true },
    voterTurnout: { type: Number, default: 0 },
    registeredVoters: { type: Number, default: 0 },
    results: [{
      partyName: { type: String },
      votes: { type: Number, default: 0 }
    }]
  }],
  facts: [{
    content: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['tip', 'promise', 'warning', 'general'],
      default: 'general'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Election', electionSchema);