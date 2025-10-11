const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  politician: { type: mongoose.Schema.Types.ObjectId, ref: "Politician", required: true },
  votes: { type: Number, default: 0 }
}, { _id: false });

module.exports = mongoose.model("Candidate", CandidateSchema);
