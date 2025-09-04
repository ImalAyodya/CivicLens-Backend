const User = require('../models/User');

const userController = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Create new user
  async createUser(req, res) {
    try {
      const { username, email, deviceToken } = req.body;
      
      // Check if user with same email already exists
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      
      const newUser = new User({
        username,
        email,
        deviceToken
      });
      
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const user = await User.findByIdAndUpdate(id, updates, { new: true });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update device token
  async updateDeviceToken(req, res) {
    try {
      const { id } = req.params;
      const { deviceToken } = req.body;
      
      if (!deviceToken) {
        return res.status(400).json({ message: 'Device token is required' });
      }
      
      const user = await User.findByIdAndUpdate(
        id,
        { deviceToken },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating device token:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = userController;