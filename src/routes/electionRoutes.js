const express = require('express');
const electionController = require('../controllers/electionController');

const router = express.Router();

// GET all elections
router.get('/', electionController.getAllElections);

// GET past elections
router.get('/past', electionController.getElectionById);

// GET past election by year
router.get('/past/:year', electionController.getPastElectionByYear);

// GET election years
router.get('/years', electionController.getElectionById);

// GET upcoming elections
router.get('/upcoming', electionController.getElectionById);

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

// GET specific election by ID (Keep this as the last route to avoid conflicts)
router.get('/:id', electionController.getElectionById);

module.exports = router;