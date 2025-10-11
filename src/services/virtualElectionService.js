const VirtualElection = require("../models/VirtualElection");
const Vote = require("../models/Vote");

const virtualElectionService = {
  async createElection(data) {
    return await VirtualElection.create(data);
  },

  async getAllElections() {
    return await VirtualElection.find().populate("candidates.politician");
  },

  async getElectionById(id) {
    return await VirtualElection.findById(id).populate("candidates.politician");
  },

  async addVote(electionId, politicianId, voterId) {
    // prevent duplicate voting
    const existingVote = await Vote.findOne({ election: electionId, voterId });
    if (existingVote) throw new Error("You have already voted.");

    const vote = await Vote.create({ 
      election: electionId, 
      candidate: politicianId, 
      voterId 
    });

    // Increment vote count for the candidate in the election
    await VirtualElection.findOneAndUpdate(
      { _id: electionId, "candidates.politician": politicianId },
      { $inc: { "candidates.$.votes": 1, totalVotes: 1 } },
      { new: true }
    );

    return vote;
  },

  async getVotesByElection(electionId) {
    const election = await VirtualElection.findById(electionId).populate(
      "candidates.politician"
    );
    if (!election) throw new Error("Election not found");
    return election.candidates.map((c) => ({
      politician: c.politician.name,
      votes: c.votes,
    }));
  },
};

module.exports = virtualElectionService;
