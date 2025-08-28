const express = require('express');
const electionController = require('../controllers/electionController');

const router = express.Router();

// GET all elections
router.get('/', electionController.getAllElections);

// GET election by ID
router.get('/:id', electionController.getElectionById);

// GET election countdown
router.get('/:id/countdown', electionController.getElectionCountdown);

// POST new election
router.post('/', electionController.createElection);

// PUT update election
router.put('/:id', electionController.updateElection);

// DELETE election
router.delete('/:id', electionController.deleteElection);

// POST add election fact
router.post('/:id/facts', electionController.addElectionFact);

// POST send random fact
router.post('/:id/send-fact', electionController.sendRandomFact);

module.exports = router;