require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

// Import scheduler
const { initScheduler } = require('./utils/scheduler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const electionRoutes = require('./routes/electionRoutes');
const newsRoutes = require('./routes/newsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Database connection
const promiseRoutes = require('./routes/promiseRoutes');
app.use('/promise/api', promiseRoutes);

const ministryGrowthNewsRoutes = require('./routes/ministryGrowthNewsRoutes');
app.use('/promise/api', ministryGrowthNewsRoutes);

const ministryPerformanceRoutes = require('./routes/ministryPerformanceRoutes');
app.use('/promise/api', ministryPerformanceRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Initialize scheduler after DB connection
    initScheduler();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('CivicLens Backend is running - Track Sri Lankan politician promises and performance');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
