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
      const { id } = req.params;
      
      // Handle special route parameters
      if (id === 'breaking') {
        // Return breaking news
        const breakingNews = await News.find({ 
          isBreaking: true 
        }).sort({ publishedDate: -1 });
        
        return res.status(200).json(breakingNews);
      }
      
      if (id === 'search') {
        // Get search query from query parameters
        const { q } = req.query;
        
        if (!q) {
          return res.status(400).json({ message: 'Search query is required' });
        }
        
        // Search in title, content, and summary
        const searchResults = await News.find({
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } },
            { summary: { $regex: q, $options: 'i' } }
          ]
        }).sort({ publishedDate: -1 });
        
        return res.status(200).json(searchResults);
      }
      
      // Add handler for 'stats' parameter
      if (id === 'stats') {
        return this.getNewsStats(req, res);
      }
      
      // Regular ObjectId lookup for specific news
      const news = await News.findById(id);
      
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
  },

  // Get breaking news
  async getBreakingNews(req, res) {
    try {
      const breakingNews = await News.find({ 
        isBreaking: true 
      }).sort({ publishedDate: -1 });
      
      res.status(200).json(breakingNews);
    } catch (error) {
      console.error('Error getting breaking news:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get featured news
  async getFeaturedNews(req, res) {
    try {
      const featuredNews = await News.find({ 
        isFeatured: true 
      }).sort({ publishedDate: -1 });
      
      res.status(200).json(featuredNews);
    } catch (error) {
      console.error('Error getting featured news:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get news by category
  async getNewsByCategory(req, res) {
    try {
      const { category } = req.params;
      
      const news = await News.find({ 
        category: category
      }).sort({ publishedDate: -1 });
      
      res.status(200).json(news);
    } catch (error) {
      console.error('Error getting news by category:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get latest news
  async getLatestNews(req, res) {
    try {
      const { limit = 10 } = req.query;
      
      const latestNews = await News.find()
        .sort({ publishedDate: -1 })
        .limit(parseInt(limit));
      
      res.status(200).json(latestNews);
    } catch (error) {
      console.error('Error getting latest news:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Search news articles
  async searchNews(req, res) {
    try {
      const { q, category } = req.query;
      
      if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      // Build query
      const query = {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } },
          { summary: { $regex: q, $options: 'i' } }
        ]
      };
      
      // Add category filter if provided
      if (category) {
        query.category = category;
      }
      
      // Execute search
      const searchResults = await News.find(query)
        .sort({ publishedDate: -1 });
      
      res.status(200).json(searchResults);
    } catch (error) {
      console.error('Error searching news articles:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get related news articles
  async getRelatedNews(req, res) {
    try {
      const { id } = req.params;
      
      // Find the original news article
      const newsArticle = await News.findById(id);
      
      if (!newsArticle) {
        return res.status(404).json({ 
          message: 'News article not found'
        });
      }
      
      // Find related news based on:
      // 1. Same category
      // 2. Has matching tags
      // 3. Not the same article
      // 4. Recent articles first
      const relatedNews = await News.find({
        _id: { $ne: id }, // Not the same article
        $or: [
          { category: newsArticle.category }, // Same category
          { tags: { $in: newsArticle.tags || [] } } // Has at least one matching tag
        ]
      })
      .sort({ publishedDate: -1 })
      .limit(5); // Limit to 5 related articles
      
      res.status(200).json(relatedNews);
    } catch (error) {
      console.error('Error getting related news:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get politician performance news
  async getPerformanceNews(req, res) {
    try {
      const { politician } = req.query;
      let query = {
        $or: [
          { tags: { $in: ['performance', 'promise', 'achievement', 'failure'] } },
          { title: { $regex: /performance|promise|achievement|deliver|fail/i } },
          { content: { $regex: /politician.*performance|promise.*fulfill|achievement|deliver.*promise/i } },
          { category: 'politics' }
        ]
      };
      
      // Filter by specific politician if provided
      if (politician) {
        query.$and = [
          {
            $or: [
              { relatedPoliticians: politician },
              { title: { $regex: politician, $options: 'i' } },
              { content: { $regex: politician, $options: 'i' } }
            ]
          }
        ];
      }
      
      const performanceNews = await News.find(query).sort({ publishedDate: -1 });
      
      res.status(200).json(performanceNews);
    } catch (error) {
      console.error('Error getting performance news:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Like news article
  async likeNews(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : null; // If using authentication
      
      const news = await News.findById(id);
      
      if (!news) {
        return res.status(404).json({ message: 'News article not found' });
      }
      
      // Check if using authentication and tracking individual user likes
      if (userId) {
        // If user already liked, remove like (toggle)
        const userLikedIndex = news.likes.users.indexOf(userId);
        
        if (userLikedIndex !== -1) {
          // User already liked, remove like
          news.likes.users.splice(userLikedIndex, 1);
          news.likes.count = Math.max(0, news.likes.count - 1); // Ensure count doesn't go negative
          
          await news.save();
          return res.status(200).json({ 
            liked: false,
            likesCount: news.likes.count,
            message: 'Like removed successfully' 
          });
        } else {
          // User hasn't liked yet, add like
          news.likes.users.push(userId);
          news.likes.count += 1;
          
          await news.save();
          return res.status(200).json({ 
            liked: true,
            likesCount: news.likes.count,
            message: 'News article liked successfully' 
          });
        }
      } else {
        // Simple like counter without user tracking
        news.likes.count += 1;
        
        await news.save();
        return res.status(200).json({ 
          likesCount: news.likes.count,
          message: 'News article liked successfully' 
        });
      }
    } catch (error) {
      console.error('Error liking news article:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Add comment to news article
  async addComment(req, res) {
    try {
      const { id } = req.params;
      const { comment } = req.body;
      
      if (!comment) {
        return res.status(400).json({ message: 'Comment text is required' });
      }
      
      const news = await News.findById(id);
      
      if (!news) {
        return res.status(404).json({ message: 'News article not found' });
      }
      
      const userId = req.user ? req.user._id : null;
      const userName = req.user ? req.user.name : req.body.name || 'Anonymous';
      
      // Create new comment
      const newComment = {
        userId,
        name: userName,
        comment,
        date: new Date()
      };
      
      // Add to news comments array
      news.comments.push(newComment);
      await news.save();
      
      res.status(201).json({
        message: 'Comment added successfully',
        comment: newComment
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get comments for news article
  async getComments(req, res) {
    try {
      const { id } = req.params;
      
      const news = await News.findById(id);
      
      if (!news) {
        return res.status(404).json({ message: 'News article not found' });
      }
      
      res.status(200).json(news.comments);
    } catch (error) {
      console.error('Error getting comments:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete a comment
  async deleteComment(req, res) {
    try {
      const { id, commentId } = req.params;
      
      const news = await News.findById(id);
      
      if (!news) {
        return res.status(404).json({ message: 'News article not found' });
      }
      
      // Find the comment
      const commentIndex = news.comments.findIndex(c => c._id.toString() === commentId);
      
      if (commentIndex === -1) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      
      // Check if user is authorized to delete (if authenticated)
      if (req.user && req.user.role !== 'admin') {
        const comment = news.comments[commentIndex];
        if (comment.userId && comment.userId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }
      }
      
      // Remove the comment
      news.comments.splice(commentIndex, 1);
      await news.save();
      
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get news statistics
  async getNewsStats(req, res) {
    try {
      // Get total count of articles
      const totalCount = await News.countDocuments();
      
      // Count by category
      const categoryCounts = await News.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      // Count breaking news
      const breakingCount = await News.countDocuments({ isBreaking: true });
      
      // Count featured news
      const featuredCount = await News.countDocuments({ isFeatured: true });
      
      // Get most popular tags
      const tagStats = await News.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      
      // Get most active months (publications per month)
      const monthlyStats = await News.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$publishedDate' },
              month: { $month: '$publishedDate' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]);
      
      // Get most covered politicians
      const politicianStats = await News.aggregate([
        { $unwind: '$relatedPoliticians' },
        { $group: { _id: '$relatedPoliticians', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      
      // Format for response
      const formattedCategoryCounts = categoryCounts.map(item => ({
        category: item._id,
        count: item.count
      }));
      
      const formattedTagStats = tagStats.map(item => ({
        tag: item._id,
        count: item.count
      }));
      
      const formattedMonthlyStats = monthlyStats.map(item => ({
        year: item._id.year,
        month: item._id.month,
        count: item.count
      }));
      
      const formattedPoliticianStats = politicianStats.map(item => ({
        politician: item._id,
        count: item.count
      }));
      
      res.status(200).json({
        totalArticles: totalCount,
        categoryCounts: formattedCategoryCounts,
        breakingNewsCount: breakingCount,
        featuredNewsCount: featuredCount,
        topTags: formattedTagStats,
        monthlyPublications: formattedMonthlyStats,
        mostCoveredPoliticians: formattedPoliticianStats
      });
    } catch (error) {
      console.error('Error getting news stats:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = newsController;