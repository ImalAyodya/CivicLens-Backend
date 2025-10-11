const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token - utility function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const authController = {
  // Register user
  async register(req, res) {
    try {
      const { username, name, email, password, deviceToken } = req.body;

      // Validate required fields
      if (!username || !name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Check if user already exists
      const userExists = await User.findOne({ 
        $or: [{ email }, { username }] 
      });

      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user with 'citizen' role by default
      const user = await User.create({
        username,
        name,
        email,
        password: hashedPassword,
        role: 'citizen', // Always create as citizen for public app
        deviceToken: deviceToken || null
      });

      if (user) {
        // Return user data with token
        res.status(201).json({
          success: true,
          data: {
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            notificationPreferences: user.notificationPreferences,
            token: generateToken(user._id)
          },
          message: 'User registered successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid user data'
        });
      }
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { email, password, deviceToken } = req.body;

      // Validate email and password
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      // Find user by email
      const user = await User.findOne({ email });

      // Check if user exists and password matches
      if (user && (await bcrypt.compare(password, user.password))) {
        // Update device token if provided
        if (deviceToken) {
          user.deviceToken = deviceToken;
          await user.save();
        }

        // Update last login time
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
          success: true,
          data: {
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            notificationPreferences: user.notificationPreferences,
            token: generateToken(user._id)
          },
          message: 'Login successful'
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get current user profile
  async getProfile(req, res) {
    try {
      // req.user is set by the protect middleware
      const user = await User.findById(req.user._id).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { name, email, username, profilePicture } = req.body;
      const userId = req.user._id;

      // Build update object with only the fields that are provided
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (username) updateData.username = username;
      if (profilePicture) updateData.profilePicture = profilePicture;

      // Check if email or username already exists if being updated
      if (email || username) {
        const query = { _id: { $ne: userId } }; // Exclude current user
        
        if (email) query.email = email;
        if (username) query.username = username;
        
        const existingUser = await User.findOne(query);
        
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Email or username already in use'
          });
        }
      }

      // Update user profile
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Update notification preferences
  async updateNotificationPreferences(req, res) {
    try {
      const { notificationPreferences } = req.body;
      const userId = req.user._id;

      if (!notificationPreferences) {
        return res.status(400).json({
          success: false,
          message: 'Notification preferences are required'
        });
      }

      // Update only notification preferences
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { notificationPreferences },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          notificationPreferences: updatedUser.notificationPreferences
        },
        message: 'Notification preferences updated successfully'
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Update device token
  async updateDeviceToken(req, res) {
    try {
      const { deviceToken } = req.body;
      const userId = req.user._id;

      if (!deviceToken) {
        return res.status(400).json({
          success: false,
          message: 'Device token is required'
        });
      }

      // Update device token
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { deviceToken },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Device token updated successfully'
      });
    } catch (error) {
      console.error('Error updating device token:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user._id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      // Get user with password
      const user = await User.findById(userId);

      // Check if current password is correct
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Simple register function for citizens only
  async registerCitizen(req, res) {
    try {
      const { username, name, email, password } = req.body;
      
      // Basic validation
      if (!username || !name || !email || !password) {
        return res.status(400).json({
          success: false, 
          message: 'Please provide all required fields'
        });
      }
      
      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user (citizen only)
      const user = await User.create({
        username,
        name,
        email,
        password: hashedPassword,
        role: 'citizen' // Force role to be citizen
      });
      
      // Respond with token
      if (user) {
        res.status(201).json({
          success: true,
          token: generateToken(user._id),
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid user data'
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },
  
  // Simple login function
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }
      
      // Find user
      const user = await User.findOne({ email });
      
      // Check user exists and password matches
      if (user && await bcrypt.compare(password, user.password)) {
        // Update last login time
        user.lastLogin = new Date();
        await user.save();
        
        res.status(200).json({
          success: true,
          token: generateToken(user._id),
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
};

module.exports = authController;