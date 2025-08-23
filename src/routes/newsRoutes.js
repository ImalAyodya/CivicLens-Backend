const express = require('express');
const newsController = require('../controllers/newsController');

const router = express.Router();

// GET all news articles
router.get('/', newsController.getAllNews);

// GET news article by ID
router.get('/:id', newsController.getNewsById);

// POST new news article
router.post('/', newsController.createNews);

// PUT update news article
router.put('/:id', newsController.updateNews);

// DELETE news article
router.delete('/:id', newsController.deleteNews);

module.exports = router;