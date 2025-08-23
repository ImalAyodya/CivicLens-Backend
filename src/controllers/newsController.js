const News = require('../models/News');
const notificationService = require('../services/notificationService');

const newsController = {
  // Get all news articles
  async getAllNews(req, res) {
    try {
      const { category, isBreaking } = req.query;
      let query = {};
      
      if (category) query.category = category;
      if (isBreaking === 'true') query.isBreaking = true;
      
      const news = await News.find(query).sort({ createdAt: -1 });
      res.status(200).json(news);
    } catch (error) {
      console.error('Error getting news:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get news by ID
  async getNewsById(req, res) {
    try {
      const news = await News.findById(req.params.id);
      
      if (!news) {
        return res.status(404).json({ message: 'News article not found' });
      }
      
      res.status(200).json(news);
    } catch (error) {
      console.error('Error getting news article:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Create new news article
  async createNews(req, res) {
    try {
      const newNews = new News(req.body);
      await newNews.save();
      
      // Send notification for breaking news
      if (newNews.isBreaking) {
        await notificationService.createAndSendNotification(
          'Breaking News',
          newNews.title,
          'news',
          newNews._id,
          'News',
          true
        );
      } else {
        // For regular news, still send a notification but with a different title
        await notificationService.createAndSendNotification(
          'New Article',
          newNews.title,
          'news',
          newNews._id,
          'News',
          true
        );
      }
      
      res.status(201).json(newNews);
    } catch (error) {
      console.error('Error creating news article:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update news article
  async updateNews(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const news = await News.findByIdAndUpdate(id, updates, { new: true });
      
      if (!news) {
        return res.status(404).json({ message: 'News article not found' });
      }
      
      // If the article was changed to breaking news, send notification
      if (updates.isBreaking && !news.isBreaking) {
        await notificationService.createAndSendNotification(
          'Breaking News Update',
          news.title,
          'news',
          news._id,
          'News',
          true
        );
      }
      
      res.status(200).json(news);
    } catch (error) {
      console.error('Error updating news article:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete news article
  async deleteNews(req, res) {
    try {
      const news = await News.findByIdAndDelete(req.params.id);
      
      if (!news) {
        return res.status(404).json({ message: 'News article not found' });
      }
      
      res.status(200).json({ message: 'News article deleted successfully' });
    } catch (error) {
      console.error('Error deleting news article:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = newsController;