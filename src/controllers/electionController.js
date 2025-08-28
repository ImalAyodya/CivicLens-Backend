const Election = require('../models/Election');
const notificationService = require('../services/notificationService');
const electionFactService = require('../services/electionFactService');

const electionController = {
  // Get all elections
  async getAllElections(req, res) {
    try {
      const { status, type } = req.query;
      let query = {};
      
      if (status) query.status = status;
      if (type) query.type = type;
      
      const elections = await Election.find(query).sort({ date: 1 });
      res.status(200).json(elections);
    } catch (error) {
      console.error('Error getting elections:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get election by ID
  async getElectionById(req, res) {
    try {
      const election = await Election.findById(req.params.id);
      
      if (!election) {
        return res.status(404).json({ message: 'Election not found' });
      }
      
      res.status(200).json(election);
    } catch (error) {
      console.error('Error getting election:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Create new election
  async createElection(req, res) {
    try {
      const newElection = new Election(req.body);
      await newElection.save();
      
      // Send notification about the new election
      await notificationService.createAndSendNotification(
        'New Election Announced',
        `${newElection.title} has been scheduled for ${new Date(newElection.date).toLocaleDateString()}`,
        'election',
        newElection._id,
        'Election',
        true
      );
      
      // Schedule fact notifications
      if (newElection.facts && newElection.facts.length > 0) {
        await electionFactService.scheduleFactNotifications(newElection._id);
      }
      
      res.status(201).json(newElection);
    } catch (error) {
      console.error('Error creating election:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update election
  async updateElection(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const election = await Election.findByIdAndUpdate(id, updates, { new: true });
      
      if (!election) {
        return res.status(404).json({ message: 'Election not found' });
      }
      
      res.status(200).json(election);
    } catch (error) {
      console.error('Error updating election:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete election
  async deleteElection(req, res) {
    try {
      const election = await Election.findByIdAndDelete(req.params.id);
      
      if (!election) {
        return res.status(404).json({ message: 'Election not found' });
      }
      
      res.status(200).json({ message: 'Election deleted successfully' });
    } catch (error) {
      console.error('Error deleting election:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Add election fact
  async addElectionFact(req, res) {
    try {
      const { id } = req.params;
      const { content, category } = req.body;
      
      const election = await Election.findById(id);
      
      if (!election) {
        return res.status(404).json({ message: 'Election not found' });
      }
      
      election.facts.push({ content, category });
      await election.save();
      
      res.status(200).json(election);
    } catch (error) {
      console.error('Error adding election fact:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get election countdown
  async getElectionCountdown(req, res) {
    try {
      const { id } = req.params;
      const election = await Election.findById(id);
      
      if (!election) {
        return res.status(404).json({ message: 'Election not found' });
      }
      
      const now = new Date();
      const electionDate = new Date(election.date);
      const timeRemaining = electionDate - now;
      
      if (timeRemaining <= 0) {
        return res.status(200).json({
          election: election,
          countdown: {
            expired: true,
            message: 'Election date has passed'
          }
        });
      }
      
      // Convert milliseconds to days, hours, minutes, seconds
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      
      res.status(200).json({
        election: election,
        countdown: {
          expired: false,
          days,
          hours,
          minutes,
          seconds,
          totalMilliseconds: timeRemaining
        }
      });
    } catch (error) {
      console.error('Error getting election countdown:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Send random election fact
  async sendRandomFact(req, res) {
    try {
      const { id } = req.params;
      const result = await electionFactService.sendRandomFactNotification(id);
      
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error sending random fact:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = electionController;