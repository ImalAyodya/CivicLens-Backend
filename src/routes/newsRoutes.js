const express = require('express');
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// GET all news articles
router.get('/', newsController.getAllNews);

// Special routes (must come before /:id)
router.get('/breaking', newsController.getBreakingNews);
router.get('/featured', newsController.getFeaturedNews);
router.get('/latest', newsController.getLatestNews);
router.get('/search', newsController.searchNews);
router.get('/performance', newsController.getPerformanceNews);
router.get('/stats', newsController.getNewsStats); // Add this line

// Category routes
router.get('/category/:category', newsController.getNewsByCategory);

// Specific news article routes
router.get('/:id/related', newsController.getRelatedNews);
router.post('/:id/like', authMiddleware.optional, newsController.likeNews);

// Comment routes
router.get('/:id/comments', newsController.getComments);
router.post('/:id/comments', authMiddleware.optional, newsController.addComment);
router.delete('/:id/comments/:commentId', authMiddleware.optional, newsController.deleteComment);

// Get specific news article
router.get('/:id', newsController.getNewsById);

// POST new news article
router.post('/', newsController.createNews);

// PUT update news article
router.put('/:id', newsController.updateNews);

// DELETE news article
router.delete('/:id', newsController.deleteNews);

module.exports = router;