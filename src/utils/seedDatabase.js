const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Election = require('../models/Election');
const News = require('../models/News');
const Notification = require('../models/Notification');

// Import seed data
const { pastElectionData, upcomingElectionData } = require('./seedData/electionData');
const { citizenUsersData, adminUser, politicianUsersData } = require('./seedData/userData');
const { newsData } = require('./seedData/newsData');

// Configure env variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Election.deleteMany({});
    await News.deleteMany({});
    await Notification.deleteMany({});
    
    // Seed users
    console.log('Seeding user data...');
    
    // Hash passwords and insert citizen users
    const citizenPromises = citizenUsersData.map(async (userData) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      return User.create({
        ...userData,
        password: hashedPassword
      });
    });
    await Promise.all(citizenPromises);
    
    // Insert admin user
    const adminSalt = await bcrypt.genSalt(10);
    const adminHashedPassword = await bcrypt.hash(adminUser.password, adminSalt);
    
    await User.create({
      ...adminUser,
      password: adminHashedPassword
    });
    
    // Insert politician users
    const politicianPromises = politicianUsersData.map(async (politicianData) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(politicianData.password, salt);
      
      return User.create({
        ...politicianData,
        password: hashedPassword
      });
    });
    await Promise.all(politicianPromises);
    
    // Seed elections
    console.log('Seeding election data...');
    const insertedElections = await Election.insertMany(pastElectionData);
    const insertedUpcomingElections = await Election.insertMany(upcomingElectionData);
    console.log(`Inserted ${insertedElections.length} past elections and ${insertedUpcomingElections.length} upcoming elections`);
    
    // Seed news
    console.log('Seeding news data...');
    const insertedNews = await News.insertMany(newsData);
    console.log(`Inserted ${insertedNews.length} news articles`);
    
    // Create sample notifications
    console.log('Creating sample notifications...');
    
    // Basic notification that doesn't require references
    const notifications = [
      {
        title: 'Welcome to CivicLens',
        message: 'Thank you for joining CivicLens. Stay informed about Sri Lankan politics and elections.',
        type: 'system',  // Changed from 'general' to 'system'
        sentToAll: true,
        createdAt: new Date()
      }
    ];
    
    // Find election reference safely
    const presidentialElection = await Election.findOne({ 
      title: { $regex: /2025.*Presidential/i }  // More flexible search
    });
    if (presidentialElection) {
      notifications.push({
        title: 'Election Countdown: 2025 Presidential Election',
        message: '100 days until the 2025 Presidential Election. Make sure you\'re registered to vote!',
        type: 'election',
        reference: presidentialElection._id,
        referenceModel: 'Election',
        sentToAll: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      });
    } else {
      // Print more debugging information
      console.log('Warning: 2025 presidential election not found');
      const allElections = await Election.find({});
      console.log('Available elections:', allElections.map(e => ({
        title: e.title,
        year: e.year,
        type: e.type
      })));
    }
    
    // Find news reference safely
    const economicNews = await News.findOne({ title: /Economic Revival Plan/i });
    if (economicNews) {
      notifications.push({
        title: 'Breaking News',
        message: 'President Anura Kumara announces new economic revival plan for Sri Lanka.',
        type: 'news',
        reference: economicNews._id,
        referenceModel: 'News',
        sentToAll: true,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      });
    } else {
      console.log('Warning: Economic plan news not found');
    }
    
    // Insert notifications
    const insertedNotifications = await Notification.insertMany(notifications);
    console.log(`Inserted ${insertedNotifications.length} notifications`);
    
    console.log('Database seeding completed successfully');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    
    // Ensure mongoose connection is closed on error
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB due to error');
    }
    
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();