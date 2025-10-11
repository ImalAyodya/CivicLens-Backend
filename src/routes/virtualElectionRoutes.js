const express = require("express");
const router = express.Router();
const virtualElectionController = require("../controllers/virtualElectionController");

// Create a new election
router.post("/create", virtualElectionController.createElection);

// Get all elections
router.get("/", virtualElectionController.getAllElections);

// Get a specific election
router.get("/:id", virtualElectionController.getElectionById);

// Cast a vote
router.post("/vote", virtualElectionController.addVote);

// Get votes by election
router.get("/:electionId/votes", virtualElectionController.getVotesByElection);

module.exports = router;
