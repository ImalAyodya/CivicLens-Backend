const Election = require('../models/Election');
const notificationService = require('./notificationService');
const moment = require('moment');

const electionFactService = {
  // Get a random fact from an election
  async getRandomFact(electionId) {
    try {
      const election = await Election.findById(electionId);
      
      if (!election || !election.facts || election.facts.length === 0) {
        return null;
      }
      
      const randomIndex = Math.floor(Math.random() * election.facts.length);
      return election.facts[randomIndex];
    } catch (error) {
      console.error('Error getting random fact:', error);
      throw error;
    }
  },

  // Schedule election facts notification
  async scheduleFactNotifications(electionId) {
    // This function would be called when an election is created
    // It would set up a schedule to send facts periodically
    // For simplicity, we'll just create a function to send a fact now
    return this.sendRandomFactNotification(electionId);
  },

  // Send random fact notification
  async sendRandomFactNotification(electionId) {
    try {
      const election = await Election.findById(electionId);
      
      if (!election || !election.facts || election.facts.length === 0) {
        return { success: false, message: 'No facts available for this election' };
      }
      
      const randomFact = await this.getRandomFact(electionId);
      
      if (!randomFact) {
        return { success: false, message: 'Could not get a random fact' };
      }

      // Customize title based on fact category
      let title;
      switch (randomFact.category) {
        case 'tip':
          title = 'Voting Tip';
          break;
        case 'promise':
          title = 'Election Promise';
          break;
        case 'warning':
          title = 'Important Warning';
          break;
        default:
          title = `${election.title} - Fact`;
      }
      
      // Send notification with this fact
      const notificationResult = await notificationService.createAndSendNotification(
        title,
        randomFact.content,
        'fact',
        electionId,
        'Election',
        true
      );

      return {
        success: true,
        fact: randomFact,
        notification: notificationResult
      };
    } catch (error) {
      console.error('Error sending fact notification:', error);
      return { success: false, error };
    }
  },

  // Check and send countdown notifications
  async sendCountdownNotification() {
    try {
      const now = new Date();
      // Find upcoming elections
      const upcomingElections = await Election.find({
        status: 'upcoming',
        date: { $gt: now }
      });

      for (const election of upcomingElections) {
        const electionDate = moment(election.date);
        const daysUntilElection = electionDate.diff(moment(), 'days');
        
        // Send notifications at specific milestones
        // You can customize these thresholds
        if (daysUntilElection === 30 || 
            daysUntilElection === 14 || 
            daysUntilElection === 7 || 
            daysUntilElection === 3 || 
            daysUntilElection === 1) {
          
          let message;
          if (daysUntilElection === 1) {
            message = `${election.title} is tomorrow! Make sure you're prepared to vote.`;
          } else {
            message = `${daysUntilElection} days until ${election.title}. Don't forget to vote on ${electionDate.format('MMMM D, YYYY')}.`;
          }

          await notificationService.createAndSendNotification(
            'Election Countdown',
            message,
            'election',
            election._id,
            'Election',
            true
          );
        }
      }

      return { success: true, message: 'Countdown notifications processed' };
    } catch (error) {
      console.error('Error sending countdown notifications:', error);
      return { success: false, error };
    }
  }
};

module.exports = electionFactService;