const electionFactService = require('../services/electionFactService');
const Election = require('../models/Election');

// Function to run scheduled tasks
const runScheduledTasks = async () => {
  try {
    console.log('Running scheduled tasks...');
    
    // Send election countdown notifications
    await electionFactService.sendCountdownNotification();
    
    // Send random facts for upcoming elections
    const upcomingElections = await Election.find({ 
      status: 'upcoming',
      date: { $gt: new Date() }
    });
    
    if (upcomingElections.length > 0) {
      // Pick a random election to send a fact for
      const randomIndex = Math.floor(Math.random() * upcomingElections.length);
      const randomElection = upcomingElections[randomIndex];
      
      // Only send if there are facts to send
      if (randomElection.facts && randomElection.facts.length > 0) {
        await electionFactService.sendRandomFactNotification(randomElection._id);
      }
    }
    
    console.log('Scheduled tasks completed');
  } catch (error) {
    console.error('Error running scheduled tasks:', error);
  }
};

// Initialize scheduler
const initScheduler = () => {
  // Run tasks every day at midnight
  setInterval(runScheduledTasks, 24 * 60 * 60 * 1000);
  
  // For development/testing, also run once at startup
  runScheduledTasks();
  
  console.log('Scheduler initialized');
};

module.exports = { initScheduler };